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
    npm start

Once running open [http://127.0.0.1:8080/](http://127.0.0.1:8080/) in a browser.

Using the magic of morse code new emails announce themselves with a flurry dot and dashes.