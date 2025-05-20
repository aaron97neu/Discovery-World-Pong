# Change of ISO Guide

### Description
This shell script called `iso-change.sh` updates a pre-existing ISO. This would be used after editing the files
under the `/ISO_DIRECTORY/source-files/server` directory (user-data, meta-data, etc.) to apply the new changes
into a newly generated ISO. The shell script outputs the new ISO into the `/ISO_DIRECTORY`.

### Things to Note
1. If you are having trouble running the script it may need certain permissions to run properly. Run the command
`chmod +x iso-change.sh` to make the script executable.

2. There is one varibale in the script called `$ISO_DIRECTORY` that specifies where the updated iso creation will
be and can be changed to different names. You need to 
**specify the same name as whatever the same variable in the `iso-create.sh` was set to when you created the ISO for the first time.**

### Steps Followed in `iso-change.sh`
**These are all automatically done in the shell script. You don't need to follow these steps manually to create the iso unless you really want to.**

1. Move into correct directory specified with the `$ISO_DIRECTORY` variable

2. Run the command to generate the new ISO
- if -o which is the 3rd line in the command has the same name as the previous ISO
**it will overwrite the old one when it generates the newly updated ISO** (look at the picture in `iso-create.md`
to see a picture of the line being referred to)
- **only changes made in the `$ISO_DIRECTORY` will be applied to the new ISO**. If you make changes in the
`/setup/autoinstall-iso/server` directory these will not be applied when running the `iso-change.sh`. To apply
changes there you must run `iso-create.sh` to create a fresh image