# Telegraphy

Telegraphy is a project that uses an [Arduino](http://www.arduino.cc/) microcontroller and [Node](http://nodejs.org/) to provide physical notifications for the arrival of emails.

## Install

    git clone git@github.com:ricallinson/telegraphy.git
    cd ./telegraphy

### 1. Arduino

From within the Arduino IDE open the __./arduino/notifier_morse_code/notifier_morse_code.ino__ sketch. Make sure your Arduino board is connected and __Upload__ the sketch.

### 2. Node

You must have [Node](http://nodejs.org/) and [npm](https://npmjs.org/) installed to follow these steps. Should you get an install error check the [node-serialport install guide](https://github.com/voodootikigod/node-serialport#to-install) to make sure you have the prerequisites to compile ANY native module for Node.js.

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

Update Debain, install git and nodejs.

    sudo apt-get update
    sudo apt-get upgrade
    sudo apt-get install git
    sudo apt-get install npm
<!--
Install the latest version of Nodejs (https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#debian-lmde). Note: this takes over 2 hours on the Raspberry PI!

    sudo apt-get install python g++ make checkinstall
    mkdir ~/src && cd $_
    wget -N http://nodejs.org/dist/node-latest.tar.gz
    tar xzvf node-latest.tar.gz && cd node-v*
    ./configure
    checkinstall #(remove the "v" in front of the version number in the dialog)
    sudo dpkg -i node_*
-->

Finally symlink _nodejs_ to _node_.

    sudo ln -s /usr/bin/nodejs /usr/bin/node

### 3. Clone the git project and install it

    git clone https://github.com/ricallinson/telegraphy.git
    cd telegraphy/node
    npm i
    sudo npm i forever -g

### 4. Fix serialport package

    sudo npm install serialport@1.0.6
    cd node_modules/serialport
    node_modules/node-gyp/bin/node-gyp.js configure binding.gyp
    node_modules/node-gyp/bin/node-gyp.js build
    node_modules/node-gyp/bin/node-gyp.js install

### 5. Start the server

    forever start server.js

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
