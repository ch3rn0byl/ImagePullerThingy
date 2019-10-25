// No idea why to use this, but best practice I guess? 
"use strict";

// This is to hold my module object
var mObject = {};

function initializeScript()
{
    return [new host.apiVersionSupport(1, 3)];
}

// I iterate through all known modules, so I get the size like this
function getAmountOfModules()
{
    var amount = 0;
    let ctl = host.namespace.Debugger.Utility.Control;

    // This just gets all loaded modules and counts them
    for (var i of ctl.ExecuteCommand("lmo"))
    {
        amount++;
    }
    return amount;
}

function writeToFile(filename, BinaryData)
{
    let file = null;

    // Grab the file extension
    var fileExtension = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 1);

    // Modify the name to include the string
    var modified = filename.split(".")[0] + "_modded_by_windbg";
    filename = filename.replace(filename, modified + fileExtension);

    // will need to take the directory path from user
    let FilePath = "C:\\Users\\ch3rn0byl\\Desktop\\" + filename;

    try {
        // Elimates the need for file checking as it just always creates it, yolo
        file = host.namespace.Debugger.Utility.FileSystem.CreateFile(FilePath, "CreateAlways");
        file.WriteBytes(BinaryData);
    } catch (e) {
        host.diagnostics.debugLog(e.stack);
        return -1;
    }
    file.Close();
}

function invokeScript()
{
    // For easier printing purposes
    var dbgPrint = host.diagnostics.debugLog;
    // For executing WinDbg commands
    let ctl = host.namespace.Debugger.Utility.Control;

    // Iterate through all known modules, so I can get the amount of modules loaded like this:
    var amount = getAmountOfModules();
    dbgPrint("There are ", amount, " loaded modules\n");

    // Iterate through all modules to get base address, size, name, etc
    var offset = 0;

    // For now
    var thingy = "aksfridge";
    do
    {
        try {
            let lm = host.currentProcess.Modules[offset];
            let moduleName = lm.Name.toLowerCase();
            if (moduleName.indexOf(thingy) !== -1)
            {
                // Extracting the name of the module because almost all of them come out in this
                // format: \??\c:\windows\system32\drivers\afunix.sys
                mObject.Name = lm.Name.split('\\').pop();
                mObject.BaseAddress = lm.BaseAddress;
                mObject.Size = lm.Size;
                break;
            }
        } catch (e) {
            e.message = "Unable to find module --> " + thingy;
            dbgPrint(e.stack, "\n");
            return -1;
        }
        offset++;
    } while (offset <= amount);

    dbgPrint("Module Name: ", mObject.Name, "\n");
    dbgPrint("Modue Base Address: ", mObject.BaseAddress, "\n");
    dbgPrint("Module Size: ", mObject.Size, "\n");

    // This freaking works!!
    var buffer = new ArrayBuffer(mObject.Size)
    var uint8View = new Uint8Array(buffer);

    var i = 0;
    while (i < mObject.Size)
    {
        let aksfridge = ctl.ExecuteCommand("db " + mObject.BaseAddress.add(i).toString(16) + " l1");
        for (var line of aksfridge)
        {
            // Copy each byte into the buffer
            line = line.split(' ')[2];
            uint8View[i] = parseInt(line, 16);
        }
        i++;
    }

    // Write dumped file to disc
    if (writeToFile(mObject.Name, uint8View) === -1)
    {
        dbgPrint("Writing dumped version of ", mObject.Name, " was unsuccessful!\n");
        return -1;
    }
    dbgPrint("Done!\n");
}
