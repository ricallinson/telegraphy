# Telegraphy

Telegraphy is a project that uses an [Arduino](http://www.arduino.cc/) microcontroller and [Node](http://nodejs.org/) to provide physical notifications for the arrival of emails.

## Install

    git clone git@github.com:ricallinson/telegraphy.git
    cd ./telegraphy

### 1. Arduino

From within the Arduino IDE open the __./arduino/notifier_morse_code/notifier_morse_code.ino__ sketch. Make sure your Arduino board is connected and __Upload__ the sketch.

### 2. Node

You must have [Node](http://nodejs.org/) and [npm](https://npmjs.org/) installed to follow these steps.

    cd ./node
    npm install
    npm start

Once running open [http://127.0.0.1:8080/](http://127.0.0.1:8080/) in a browser.

## Setup Raspberry PI

If you want to run _Telegraphy_ on a Raspberry PI this is the quickest way to get going.

### 1. SSH

    ssh <ip_address> -l pi
    password: raspberry

### 2. Update and install required packages

5/30/2013: This installs node 0.6.19 which seems to have a problem with SSL after running _apt-get upgrade_.

    sudo apt-get update
    sudo apt-get install npm
    sudo ln -s /usr/bin/nodejs /usr/bin/node
    sudo apt-get install git

### 3. Clone the git project

    git clone https://github.com/ricallinson/telegraphy.git
    cd telegraphy/node
    npm i

### 4. Fix serialport package

    sudo npm install serialport@1.0.6
    cd node_modules/serialport
    node_modules/node-gyp/bin/node-gyp.js configure binding.gyp
    node_modules/node-gyp/bin/node-gyp.js build
    node_modules/node-gyp/bin/node-gyp.js install

### 5. Start the server

    npm start

### 6. Run at boot time

To run _Telegraphy_ at boot time you need to copy the startup script to the correct location and then restart the Raspberry PI.

    sudo cp ~/telegraphy/raspberrypi/telegraphy /etc/init.d/telegraphy
    sudo update-rc.d telegraphy defaults
    sudo init 6

You can undo this by running...

    update-rc.d -f telegraphy remove

## Links

* For some Arduino clones you may be required to install [FTDI Drivers](http://www.ftdichip.com/Drivers/VCP.htm).

## Setting up WiFi on Debain

> sudo nano /etc/network/interfaces

    auto lo

    iface lo inet loopback
    iface eth0 inet dhcp

    allow-hotplug wlan0
    auto wlan0
    iface wlan0 inet manual
    wpa-roam /etc/wpa_supplicant/wpa_supplicant.conf

    iface default inet dhcp

> sudo nano /etc/wpa_supplicant/wpa_supplicant.conf

    ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
    update_config=1

    network={
    ssid="SSID-GOES-HERE"
    proto=RSN
    key_mgmt=WPA-PSK
    pairwise=CCMP TKIP
    group=CCMP TKIP
    psk="WIFI-PASSWORD-GOES-HERE"
    }

> sudo ifdown wlan0

> sudo ifup wlan0

> iwconfig
