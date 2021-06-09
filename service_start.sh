#!/bin/bash
echo "Changing node version with NVM..."
. /home/pi/.nvm/nvm.sh;
nvm use 12
echo "Starting script..."
node fan.js --quiet
