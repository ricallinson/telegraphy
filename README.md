# Telegraphy

Telegraphy is a project that uses an [Arduino](http://www.arduino.cc/) microcontroller and [Node](http://nodejs.org/) to provide physical notifications for the arrival of emails.

## Install

    git clone git@github.com:ricallinson/telegraphy.git
    cd ./telegraphy

### Arduino

From within the Arduino IDE open the __./arduino/notifier/notifier.ino__ sketch. Make sure your Arduino board is connected and __Upload__ the sketch.

### Node

You must have [Node](http://nodejs.org/) and [npm](https://npmjs.org/) installed to follow these steps.

    cd ./node
    npm install
    node server.js -s <serial-port>

Once running open [http://127.0.0.1:8080/](http://127.0.0.1:8080/) in a browser.

## Links

* [FTDI Drivers](http://www.ftdichip.com/Drivers/VCP.htm)

## Setup Raspberry PI

If you want to run _Telegraphy_ on a Raspberry PI this is the quickest way to get going.

### SSH

    ssh <ip_address> -l pi
    password: raspberry

### Update and install

    sudo apt-get update
    sudo apt-get install npm
    sudo apt-get install git
    git clone https://github.com/ricallinson/telegraphy.git
    cd telegraphy/node
    npm i
    mkdir cfg

### Fix serialport package

	sudo npm install serialport@1.0.6
    cd node_modules/serialport
	node_modules/node-gyp/bin/node-gyp.js configure binding.gyp 
	node_modules/node-gyp/bin/node-gyp.js build 
	node_modules/node-gyp/bin/node-gyp.js install

### Start the server

    /usr/bin/nodejs server.js
    <serialport>
    /usr/bin/nodejs server.js -s <serialport>

### Run at boot time

To run _Telegraphy_ at boot time you need to copy the startup script to the correct location and then restart the Raspberry PI.

    sudo cp ~/telegraphy/raspberrypi/telegraphy /etc/init.d/telegraphy
    sudo update-rc.d telegraphy defaults
    sudo init 6

You can undo this by running...

    update-rc.d -f telegraphy remove

