//    (The MIT License)
//
//    Copyright (c) 2012 Richard S Allinson <rsa@mountainmansoftware.com>
//
//    Permission is hereby granted, free of charge, to any person obtaining
//    a copy of this software and associated documentation files (the
//    "Software"), to deal in the Software without restriction, including
//    without limitation the rights to use, copy, modify, merge, publish,
//    distribute, sublicense, and/or sell copies of the Software, and to
//    permit persons to whom the Software is furnished to do so, subject to
//    the following conditions:
//
//    The above copyright notice and this permission notice shall be
//    included in all copies or substantial portions of the Software.
//
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
//    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
//    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
//    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
//    CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
//    TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
//    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/*
    Words.
*/

#include <Rainbowduino.h>

/*
    Set the pins to use for output.
*/

void pins() {

    /*
        More words.
    */

    Rb.init();
}

/*
    Takes the given "message" and passes it char-by-char to the "screen()" function.
*/

void toScreen(char *message, int length) {
    for (int i = 0; i < length; i++) {
        screen(message[i]);
    }
}

/*
    Words.
*/

void screen(int letter) {

    /*
        More words.
    */

    Rb.drawChar(letter, 0, 1, 100); 
    delay(1000);
    Rb.blankDisplay();
}

/*
    Standard setup function.
*/

void setup() {

    /*
        Setup the pins to use for morse code output.
    */

    pins();

    /*
        Listen for incoming data on the serial port.
    */

    Serial.begin(9600);

    /*
        Create a message to use in the sent alert once the setup is complete.
    */

    char message[] = "A";

    /*
        Send the message to announce that the setup is complete.
    */

    toScreen(message, sizeof(message) / sizeof(char) - 1);
}

/*
    Standard loop function.
*/

void loop() {

    if (Serial.available() > 0) {

        /*
            If there is data available on the serial port read the first byte.
        */

        int incomingByte = Serial.read();

        /*
            Output byte we just read as morse code.
        */

        screen(incomingByte);
    }
}
