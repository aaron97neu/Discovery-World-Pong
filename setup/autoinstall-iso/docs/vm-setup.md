# Running the Custom ISO in a Virtual Machine Guide

### Description
This guide goes over how to setup the Virtual Machine using OracleBox to run the custom ISO if you are not
using a native Linux device.

### Things to Note
1. This guide is setup specifically for the **OracleBox** Virtual Machine but could probably be easily
replicated on a different virtual machine application.
2. These steps were created in mind for a native Windows device. The steps might differ slightly for a
different native OS.

### Assigning the ISO to an Existing VM
These steps can be used if the VM has already been created using this guide to replace an old ISO with a
new ISO. **If the VM has not been created yet skip this section**.

1. Click on VM Settings -> Storage.
2. Under Controller: IDE select the current ISO and click on the small red x to delete it.
3. Click the green + to add a new ISO.
4. Finally, click OK to apply the changes. Run the VM as normal.

### Creating the VM
1. Follow the other guides to create the ISO using the shell script (start at `overview.md` if you don't
know where to start). Make note of the location where the ISO image is located on your local system.

2. Download the latest version of [Oracle VM Virtual Box](https://www.oracle.com/virtualization/technologies/vm/downloads/virtualbox-downloads.html).

3. In VirtualBox, select Machine -> New

4. Name the VM any name you would like and then select the ISO image that you made note of earlier.

5. **Select the option Skip Unattended Installation** and do not set a password and username as that is
all configured in the ISO.

6. Under Hardware, set the RAM to about 8gb (~8,192mb) and set Processors between 1-4 CPU (your choice)

7. Under Hard Disk, create a hard disk that is 75gb and check "Pre-allocate Full Size" (this seems like a
lot but once the containers are built the system is very large)

8. **Very Important**: Click Finish and let the VM build fully. It should not automatically open and start
running. If it does you've done something wrong.

9. Now go to the VM and click on Settings -> Display. Under Graphics Controller select VBoxSVGA. This will
give you a compatability warning but that can be ignored.

10. Select OK and clcik start to begin running the VM.

### VM Setup
1. Once the VM opens, you will be presented with several installation options. Select the first one
`Pong AutoInstall Ubuntu Server` by pressing the Enter key.

2. Now the installation will start. This process can take anywhere between 20-45 minutes and will reboot
several times. Be patient and let it run. There will be a failure to unmount the iso but you can ignore it.
Continue with steps below while the system installs.

3. If errors occur, start a shell by pressing enter and look at `/var/log/syslog` using vim to view relevant
installation output and errors (use Shift+g in vim to skip to the end of the syslog).

4. After the first restart, you will be presented with a terminal that prompts you to login. The default username
is 'dwpong' and the default password set in the `user-data` file is 'pong'. Once you login, the post-install
script will start to run. It will ask for the password again a few times.

5. Make sure you follow the instructions that appear on the terminal to set up keys in the git repository.

6. The system will restart again and then boot up with a login GUI which means everything was installed correctly.