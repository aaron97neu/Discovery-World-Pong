#!/usr/bin/env bash
set -x -e

#################################################################
# This file creates a custom ISO for the AI Pong Exhibit based
# off of the open source Ubuntu Server ISO. For more information
# look at the ISO Creation Documentation under the docs directory
# where this file is located. (/autoinstall-iso/docs)
# Modified: 3/12/2025
#################################################################

############
# Variables
############
ISO_DIRECTORY='iso-test'

# Prerequisites
# p7zip - for unpacking the source ISO
# wget - to download fresh build of Ubuntu Server ISO from online
# xorriso - for building the modified ISO
sudo apt update
sudo apt install p7zip-full wget xorriso --install-suggests

# Set up build environment
cd ../..

# Check if the directory exists, and if so, remove it
if [ -d "$ISO_DIRECTORY" ]; then
    echo "Directory $ISO_DIRECTORY already exists. Removing it..."
    rm -rf "$ISO_DIRECTORY"
fi

mkdir "$ISO_DIRECTORY"
cd "$ISO_DIRECTORY"
wget https://releases.ubuntu.com/jammy/ubuntu-22.04.5-live-server-amd64.iso

# Unpack files and partition images from the source ISO
7z -y x ubuntu-22.04.5-live-server-amd64.iso -osource-files
# Remove open source server ISO to save space
rm ubuntu-22.04.5-live-server-amd64.iso

cd source-files
mv '[BOOT]' ../BOOT 

# Edit the ISO grub.cfg file
# Need to specify path to user-data file (cdrom/server/)
cd boot/grub
sed -i 's/menuentry "Try or Install Ubuntu Server"/menuentry "Pong Autoinstall Ubuntu Server"/' grub.cfg
sed -i 's|linux\t*/casper/vmlinuz  ---|linux\t/casper/vmlinuz quiet autoinstall ds=nocloud\\;s=/cdrom/server/  ---|' grub.cfg

# Copy the user-data and meta-data files along with other source files
cd ../../../../setup/autoinstall-iso
cp -r server "../../$ISO_DIRECTORY/source-files/"

# Generate the new custom Ubuntu Server ISO
cd "../../$ISO_DIRECTORY/source-files"

xorriso -as mkisofs -r \
  -V 'Server Pong ISO' \
  -o ../ubuntu-server-pong-autoinstall.iso \
  --grub2-mbr ../BOOT/1-Boot-NoEmul.img \
  -partition_offset 16 \
  --mbr-force-bootable \
  -append_partition 2 28732ac11ff8d211ba4b00a0c93ec93b ../BOOT/2-Boot-NoEmul.img \
  -appended_part_as_gpt \
  -iso_mbr_part_type a2a0d0ebe5b9334487c068b6b72699c7 \
  -c '/boot.catalog' \
  -b '/boot/grub/i386-pc/eltorito.img' \
    -no-emul-boot -boot-load-size 4 -boot-info-table --grub2-boot-info \
  -eltorito-alt-boot \
  -e '--interval:appended_partition_2:::' \
  -no-emul-boot \
  .