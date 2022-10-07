---
title: "What happens, when you start computer with linux?!"
description: "Detail information about linux boot process"
date: "2022-10-07"
banner:
  src: "../../images/lukas-NLSXFjl_nhc-unsplash.jpg"
  alt: "Linux boot process"
  caption: 'Photo by <u><a href="https://unsplash.com/photos/NLSXFjl_nhc">Lukas</a></u>'
categories:
  - "Linux"
keywords:
  - "Linux"
  - "Operating systems"
---

<!-- ## Code block test

```css
.AClass .Subtitle {
  margin: -0.5rem 0 0 0;
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.5rem;
}

.AnotherClass p {
  font-size: 1.125rem;
  margin-bottom: 2rem;
}

.AThirdClass {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

@media (max-width: 768px) {
  .AClass {
    flex-direction: column;
  }
  .AnotherClass {
    display: block;
  }
}
``` -->
<!-- 
Inline code: `print()` -->
## How did the idea come about
I managed to go to several interviews for positions such as devops engineer and system administrator. And always, believe me, always ask about how Linux boots. And each time, telling the process in general terms, I am asked to tell more and more about it. So a strong-willed decision was made to write a very detailed blog in order to close this issue once and for all. Well, let's get started!

## 1. The boot button pressed.
I think I will not go into details about how the processor, RAM, and so on. We'll skip this. It will be enough for us to know that the BIOS is loading! We need it to check and configure the hardware, boot the OS, and provide basic information about the system. But I'm more interested in how the BIOS loads our favorite Linux. Everything is simple! Having received information about the disks, and the order in which they were loaded, we begin to read MBR or GPT records until we find the right one.
A few words about the boot record (MBR). The first entry will store information about the bootloader, about 500 megabytes in size. This is exactly the partition that we always create by partitioning the disk when installing the system. The BIOS, finding this section, also finds the bootloader, which starts the system boot process. I think I'll write a separate blog about how partition tables work, grub, and all that. Let's write it in TODO) Let's just assume that grub was found and started working.

### 2. What exactly grub is doing?
Quick reminder - this article will focus on grub1 as it is more relevant. Well, and because I wanted to.
As I said earlier when explaining the partition tables, disks, and bootloader setup, the text would fill a whole article. Therefore, I’ll just tell you how grub helps to start the same process with PID 1. 
After the bootloader starts, it will start generating files such as boot.img, core.img, and a large number of modules necessary for the normal operation of the system. boot.omg and core.img are very important. They run and find important files, but the final output is always the same - kernel.img. It is this file that recognizes the file system (/boot), where the grub configuration file lies(/boot/grub2/grub2.cfg), which launches the familiar grub welcome window.
After we select the menu item, kernel.img loads the corresponding kernel of the operating system (the same vmlinuz, it lies in /boot), pulls up the grub.cfg configuration parameters, and transfers them to the kernel, including the root file system. And after loading the kernel, grub fully transfers control to it.

### 3. Starting and initializing the kernel.
A very important note: I will be talking about init, not systemd! They are very different, but I will also write about systemd sometime.
As we remember, before dying a worthy death, grub managed to pass the startup parameters to the kernel and transferred control to it. It is the idle task. We need it becuase we need always have at least one task. Usually this is splash or swapper, you can google about them yourself.
Usually this is splash or swapper, you can google about them yourself. Subsequent processes are started with fork, and we arrive at the great big boss process - PID 1. This is the system initialization process, which becomes the daddy for all other processes. In addition, another process is immediately created - PID 2. This is the kernel thread a.k.a kthread, which completes the initialization and configuration of the kernel environment.

### 4. Inird
We have created two processes! init and kthread. But here is the trap! These are not processes, but kernel threads. We can't capture them with ps yet. It will be born when kernel_init starts the init process. That is, we need to run /sbin/init. And yet another trap! It also lies in the root section, which contains its own file system. Therefore, file system drivers are also needed. AND ANOTHER TRAP. Drivers then lie in the root section) So we came to the famous chicken-and-egg problem, what is born first into the world?
Smart and polite people came up with a way. What if we just collect information about the root file system, find out the driver, and put it all in some file that is loaded before loading the root file system and start the root FS from it. 
This is where toys like initrd and initramfs come into play. They perform the same function, although their implementation is different. All we need to know is that an intermediate file is created when the OS is installed, this file is essentially a full-fledged temporary file system, and we need it to load the init process.

### 5. The user space 
Congratulations!!! We've entered user space, ending our hellish journey through the kernel. I'm sure the new walk will be easy!
Init has already begun initializing the entire system. He has the right to execute, now he's the big boss here.
Generally speaking, OS initialization is a very voluminous process. I will give an approximate order - reading the runlevel; initialization of the system class environment; initialization of the custom class environment according to the runlevel; executing the rc.local file to execute user-defined startup commands to be executed; terminal loading. Hmm, something is not very simple, right? Don't worry, we'll figure it out.
The runlevel initializes the various system environments. For example, the familiar safe mode of Windows. There are 7 of them, from 0 to 6. And here they are, from left to right:
0: shuts down the system
1: single user mode
2: Multi-user mode without NFS (no network)
3: Full multiplayer mode (with network), but no graphical shell. His forte is all sorts of server Linuxes.
4: Not used. The user can adjust this level based on his goals
5: X11. Same as 3, but with GUI.
6: reboot the system to restart it
Now you know that when you shutdown or restart Linux, the init process is given two runlevels - 0 and 6)
Init systems have an /etc/inittab file that passes run levels to a process and performs the operations described in the file. By the way, there is no such thing in systemd systems. 
Init further reads a large number of configuration files in order to initialize one or another environment at the run level - the same rc.local. I think I will supplement the article later, explaining these processes. Let's move on to the login window as soon as possible!
Linux is a multi-tasking and multi-user operating system that allows multiple people to work online at the same time. But everyone must enter a username and password to verify their identity and finally log in. But is it a GUI for users at login, or a pure command line mode for users? This is terminal specific, which means that the terminal needs to be loaded before logging in.
Virtual terminals come into play. Yes, those same ttys that are a virtual device - the keyboard! There are 6 of them, you can switch between them - for example, being in a graphical shell, you can exit it by switching to another tty. We can tell which terminals are monitored by Init by looking in its configuration files.
Finally, we can enter our username and password. A process has already been started that will check input and allow authentication, logging will be introduced, and so on. We are inside! You can start looking at memes on the internet

### Summary
Thanks for reading! Far from an ideal description of the download process, and the article will be supplemented, I'm sure more than once. I plan to start developing Linux from Scratch again (last time I almost did not succeed, the battle was lost in disgrace). But this time I can! I'm sure there will be something to tell and write).