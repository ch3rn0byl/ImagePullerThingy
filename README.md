# Driver-Puller-Thingy

Ran into obfuscated drivers, which is a pain in the dick to deal with. Instead, got the idea of yanking it from memory to atleast get an idea of what's going on. It works for the most part. 

For example, this particular driver comes out as garbage and seems like a nightmare:
![aksfridge](https://github.com/ch3rn0byl/Driver-Puller-Thingy/blob/master/wtf.PNG)

When I run the script inside the debugger, I get the following output:
```
There are 189 loaded modules
Module Name: aksfridge.sys
Modue Base Address: 0xfffff800555c0000
Module Size: 0x26000
Done!
```

Then when I put the dumped binary into Ida, I get this:
![output](https://github.com/ch3rn0byl/Driver-Puller-Thingy/blob/master/fml.PNG)

These two files compared is slightly different. I need to figure out how to fix this up:
![comparison](https://github.com/ch3rn0byl/Driver-Puller-Thingy/blob/master/comp.PNG)

This is a work in progress! Cleaner code and arguments shall come. Right now, the path of the file is hardcoded and the driver name is also hard coded. Also, I hate javascript!

ToDos:
  1. Clean up code, make it more efficient? Learn more JavaScript because this was horrible and took me longer than it should have.
  2. Add arguments, etc.
  3. Figure out how to clean up the binary itself to make it more of a decent copy than rip, whatever
  4. Figure out what's up with the sizes from memory than the actual binary on disk. No clue what the deal is with that
