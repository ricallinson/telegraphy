# Telegraphy

[![Build Status](https://secure.travis-ci.org/ricallinson/telegraphy.png?branch=master)](http://travis-ci.org/ricallinson/telegraphy)

Telegraphy is a project that uses an [Arduino](http://www.arduino.cc/) microcontroller and [NodeJS](http://nodejs.org/) to provide physical notifications for the arrival of messages such as emails.

## Checkout & Install

You'll need [git](http://git-scm.com/) installed to follow this guide.

    git clone git@github.com:ricallinson/telegraphy.git
    cd ./telegraphy

### 1. Arduino

From within the [Arduino IDE](http://arduino.cc/en/main/software) open the __./arduino/notifier_morse_code/notifier_morse_code.ino__ sketch. Make sure your Arduino board is connected and __Upload__ the sketch.

### 2. Node

You must have [NodeJS](http://nodejs.org/) and [npm](https://npmjs.org/) installed to follow these steps. Should you get an install error check the [node-serialport install guide](https://github.com/voodootikigod/node-serialport#to-install) to make sure you have the prerequisites to compile ANY native module for Node.js.

    cd ./node
    npm install
    npm start

Once running open [http://127.0.0.1:8080/](http://127.0.0.1:8080/) in a browser.

### 3. Test

From the Telegraphy web-page you can push the blue button that says __send__. This will immediately make the LED on the Arduino board start flashing a message in Morse Code.

## Links

* For more information about using this project see the [Telegraphy Wiki](https://github.com/ricallinson/telegraphy/wiki/_pages)
* For some Arduino clones you may be required to install [FTDI Drivers](http://www.ftdichip.com/Drivers/VCP.htm)
