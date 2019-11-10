# Dump obfuscated modules
This script was written to beat any driver where the source has been obfuscated. All this does is pulls it from memory so you can view it statically rather than a bunch of garbage. Sometimes it can dump it almost perfectly, sometimes you have to fix the image base, and sometimes you have to fix the iat and what not so your mileage may very if you use this.

# How to use it?
WinDbg SHOULD load the JavaScript dll by default. You can check it with the following command:
```
2: kd> .scriptproviders
Available Script Providers:
    NatVis (extension '.NatVis')
    JavaScript (extension '.js')
```
If JavaScript is shown, you're good to go otherwise you can do the following command to load it:
```
2: kd> .load jsprovider.dll
```
Next is to load the script:
```
2: kd> .scriptload C:\Users\ch3rn\Desktop\DumpModule.js
JavaScript script successfully loaded from 'C:\Users\ch3rn\Desktop\DumpModule.js'
```
Once loaded, you can kinda get the picture what's going on:
```
2: kd> dx -r1 -v Debugger.State.Scripts.DumpModule.Contents
Debugger.State.Scripts.DumpModule.Contents                 : [object Object]
    host             : [object Object]
    WriteToFile     
    GetAmountOfModules
    DumpDriver      
    ToDisplayString  [ToDisplayString([FormatSpecifier]) - Method which converts the object to its display string representation according to an optional format specifier]
```
This just shows you the functions that are in this script. You can either run it or save it to a variable so you can call it later on rather than some long ass command:
```
2: kd> dx @$myscript = Debugger.State.Scripts.DumpModule.Contents
@$myscript = Debugger.State.Scripts.DumpModule.Contents                 : [object Object]
    host             : [object Object]
```
Now actually running it!
```
2: kd> dx @$myscript.DumpDriver("capcom")
>>> There are 193 loaded modules!
>>> Searching for capcom...found it!
>>> Module Name: Capcom.sys
>>> Module Base Address: 0xfffff80057d20000
>>> Module Size: 0xc00
>>> Dumping capcom from memory starting at fffff80057d20000...done!
>>> Writing capcom to disk...done!
>>> Done!

@$myscript.DumpDriver("capcom")
```
To unload the script:
```
2: kd> .scriptunload C:\Users\ch3rn\Desktop\DumpModule.js
JavaScript script unloaded from 'C:\Users\ch3rn\Desktop\DumpModule.js'
```
Once this is done, there would be a new filename written to disk. In this case, it will be capcom_dumped_by_windbg.sys. If it was an obfuscated driver, you can now view it much easier in Ida and actually get an idea of what's going on. 
Too Sick
