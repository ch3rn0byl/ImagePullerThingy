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
