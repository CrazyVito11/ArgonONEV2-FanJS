# Argon ONE V2 FanJS
A simple NodeJS application that can control the fan speed of a Argon ONE V2 case based on the CPU temperature.

## Developed and tested with
- NodeJS 12
- PhpStorm 2020.1.1

## Basic installation
1. Enable I2C
    ```console
    sudo raspi-config
    ```
   Go to `Interface Options > I2C` and select Yes
2. Use NVM to switch NodeJS versions *(optional, requires NVM to be installed)*
    ```console
    nvm use 12
    ```
3. Make a copy of `example.fan_config.json` and rename it to `fan_config.json`
    ```console
    cp example.fan_config.json fan_config.json
    ```
4. Change the settings in `fan_config.json` if you want to customize the default settings
5. Install the Node packages 
    ```console
    npm install
    ```
6. Run the `fan.js` file with NodeJS
    ```console
    node fan.js
    ```
The fan should now go quiet or start spinning, based on the current temperature and config.
It's recommended that you also run this as a service, so you don't have to start it up manually on every boot.

## Run as service
You can create a service for this Node application, so it automatically runs at startup in the background.

1. Make sure `service_start.sh` is executable
    ```console
    chmod +x service_start.sh
    ```
1. Creating the service
    ```console
    sudo nano /etc/systemd/system/argonone-fanjs.service
    ```
   
   Inside the file, add the following code. Please note that you might have to change paths depending on your setup.
    ```
    [Unit]
    Description=Argon ONE V2 FanJS Service
    
    [Service]
    WorkingDirectory=/home/pi/projects/ArgonONEV2-FanJS/
    ExecStart=/home/pi/projects/ArgonONEV2-FanJS/service_start.sh
    Restart=on-failure
    
    [Install]
    WantedBy=default.target
    ```
2. Enabling the service so it starts with the OS.
    ```console
    sudo systemctl enable argonone-fanjs
    ```
3. Reboot the Raspberry Pi and see if the service is running
    ```console
    sudo reboot
    ```
   After the reboot, run this to see if the service is running
    ```console
    systemctl status argonone-fanjs
    ```
   
You should now have a service that automatically runs `service_start.sh` on boot with NodeJS 12.

It runs the script with the `--quiet` parameter, so it only logs errors. If you don't want this, remove the `--quiet` parameter from `service_start.sh`
