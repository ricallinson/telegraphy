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

const int EMPTY = 0;
const int START = 7;
const int END = -6;

int color = 100;

/*
    Words.
*/

int buffer[2][2] = {
    {EMPTY, START}, // char, pos
    {EMPTY, START}
};

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
    Words.
*/

void tmp() {

    if (buffer[0][1] == END) {
        buffer[0][0] = EMPTY;
        buffer[0][1] = START;
    }

    if (buffer[0][0] > EMPTY) {
        Rb.drawChar(buffer[0][0], buffer[0][1], 0, color);
        buffer[0][1]--;
    }

    if (buffer[1][1] == END) {
        buffer[1][0] = EMPTY;
        buffer[1][1] = START;
    }

    if (buffer[1][0] > EMPTY) {
        Rb.drawChar(buffer[1][0], buffer[1][1], 0, color);
        buffer[1][1]--;
    }

    delay(100);

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
    
    buffer[0][0] = 65; // A
}

/*
    Standard loop function.
*/

void loop() {

    if (Serial.available() > 0) {
        
        if (buffer[0][0] == EMPTY) {
            buffer[0][0] = Serial.read();
        } else if (buffer[1][0] == EMPTY && buffer[0][1] == 0) {
            buffer[1][0] = Serial.read();
        }
    }

    tmp();
}
