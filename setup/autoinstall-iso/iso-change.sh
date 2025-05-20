#!/usr/bin/env bash
set -x -e

#############################################################################
# This file updates a pre-existing custom ISO for the AI Pong
# Exhibit. For more information look at the ISO Change Documentation
# under the docs directory where this file is located. (/autoinstall-iso/docs)
# Modified: 3/12/2025
#############################################################################

############
# Variables
############
ISO_DIRECTORY='iso-test'

#Run command to generate new ISO (if -o has the same name as previous ISO it will be overwritten)
cd "../../$ISO_DIRECTORY/source-files"

xorriso -as mkisofs -r \
  -V 'Ubuntu Server Pong ISO' \
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