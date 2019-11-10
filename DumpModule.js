"use strict";

let ModuleObject = {
    Name : "",
    BaseAddress : 0,
    Size : 0
}

function initializeScript()
{
    return [new host.apiVersionSupport(1, 3)];
}

function invokeScript()
{
    host.diagnostics.debugLog("Sup!\n");
}

function WriteToFile(ModuleName, DumpedData)
{
    let file = null;

    var FileExtension = ModuleName.slice((ModuleName.lastIndexOf(".") - 1 >>> 0) + 1);
    var ModifiedName = ModuleName.split(".")[0] + "_dumped_by_windbg";
    ModuleName = ModuleName.replace(ModuleName, ModifiedName + FileExtension);

    // this will need to get changed! 
    let FilePath = "C:\\Users\\ch3rn\\Desktop\\" + ModuleName;

    try {
        file = host.namespace.Debugger.Utility.FileSystem.CreateFile(FilePath, "CreateAlways");
        file.WriteBytes(DumpedData);
    } catch (err) {
        return err;
    }
    file.Close();
}

function GetAmountOfModules()
{
    var amount = 0;
    let ctl = host.namespace.Debugger.Utility.Control;

    for (let item of ctl.ExecuteCommand("lmo"))
    {
        amount++;
    }
    return amount;
}

function DumpDriver(DriverName)
{
    var dbgPrint = host.diagnostics.debugLog;
    let ctl = host.namespace.Debugger.Utility.Control;

    if (DriverName === undefined)
    {
        dbgPrint(">>> You need to specify a driver to dump!\n");
        return;
    }

    var Amount = GetAmountOfModules();
    dbgPrint(">>> There are ", Amount, " loaded modules!\n");

    let index = 0;
    dbgPrint(">>> Searching for ", DriverName, "...");
    do
    {
        try {
            let lm = host.currentProcess.Modules[index];
            let ModuleName = lm.Name.toLowerCase();
            if (ModuleName.indexOf(DriverName) !== -1)
            {
                dbgPrint("found it!\n");
                ModuleObject.Name = lm.Name.split("\\").pop();
                ModuleObject.BaseAddress = lm.BaseAddress;
                ModuleObject.Size = lm.Size;
                break;
            }
        } catch (err) {
            err.message = "Unable to find module --> " + DriverName;
            dbgPrint("uh-oh!\n");
            dbgPrint(err.stack, "\n\n");
            return;
        }
        index++;
    } while (index < Amount);

    dbgPrint(">>> Module Name: ", ModuleObject.Name, "\n");
    dbgPrint(">>> Module Base Address: ", ModuleObject.BaseAddress, "\n");
    dbgPrint(">>> Module Size: ", ModuleObject.Size, "\n");

    var buffer = new ArrayBuffer(ModuleObject.Size);
    var uint8View = new Uint8Array(buffer);

    index = 0;
    dbgPrint(">>> Dumping ", DriverName, " from memory starting at ", ModuleObject.BaseAddress.toString(16), "...");
    do
    {
        let DumpMemory = ctl.ExecuteCommand("db " + ModuleObject.BaseAddress.add(index).toString(16) + " l1");
        for (var byte of DumpMemory)
        {
            byte = byte.split(" ")[2];
            uint8View[index] = parseInt(byte, 16);
        }
        index++;
    } while (index < ModuleObject.Size);
    dbgPrint("done!\n");

    dbgPrint(">>> Writing ", DriverName, " to disk...");
    let status = WriteToFile(ModuleObject.Name, uint8View);
    if (status !== undefined)
    {
        dbgPrint("uh-oh!\n");
        dbgPrint(">>> ", status.stack, "\n\n");
        return;
    }
    dbgPrint("done!\n");
    dbgPrint(">>> Done!\n\n");
}
