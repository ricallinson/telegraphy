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

#include <Servo.h>

/*
    Flag 1
*/

Servo flagA;

/*
    Flag 1 trim
*/

int trimFlagA = 12;

/*
    Flag 2
*/

Servo flagB;

/*
    Flag 1 trim
*/

int trimFlagB = -20;

/*
    Servo position MIN value
*/

const int MIN = 0;

/*
    Servo position MAX value
*/

const int MAX = 180;

/*
    The time in ms for a single morse code UNIT.
*/

const int UNIT = 500;

/*
    Mapping of chars to international morse code
*/

const int CODES[26][2] = {
    {45, 0}, // A
    {90, 0}, // B
    {135, 0}, // C
    {180, 0}, // D
    {0, 135}, // E
    {0, 90}, // F
    {0, 45}, // G
    {90, 315}, // H
    {45, 225}, // I
    {180, 45}, // J
    {45, 180}, // K
    {45, 135}, // L
    {45, 90}, // M
    {45, 45}, // N
    {90, 225}, // O
    {90, 0}, // P
    {90, 135}, // Q
    {90, 90}, // R
    {90, 45}, // S
    {135, 180}, // T
    {135, 135}, // U
    {180, 45}, // V
    {225, 90}, // W
    {225, 45}, // X
    {135, 90}, // Y
    {315, 90}  // Z
};

/*
    The master pin to use for sending semaphores.
    We use PIN 13's a LED on the board to make it easy to test.
    All other pins are a negative offset from this one.
*/

const int MASTERPIN = 13;

/*
    Set the LED pins to use for morse code output.
*/

void pins() {
    pinMode(MASTERPIN, OUTPUT);
    flagA.attach(MASTERPIN - 1);
    flagB.attach(MASTERPIN - 2);
}

/*
    Takes the given "message" and passes it char-by-char to the "semaphore()" function.
*/

void toSemaphore(char *message, int length) {
    for (int i = 0; i < length; i++) {
        semaphore(message[i]);
    }
}

/*
  Takes the given ASCII code and converts it to international flag semaphore
  output by setting the appropriate servo positions.
*/

void semaphore(int letter) {

    /*
        Send the letter code we just got to the serial port for debugging.
    */

    Serial.println(letter);

    /*
        Create a variable to hold the index position.
    */

    int pos = -1;
    
    /*
        Convert the ASCII code to the "codes" array indexing.
    */
   
    if (letter >= 97 && letter <= 122) {
      
        /*
            The letter is lowercase.
        */

        pos = letter - 97;

    } else if (letter >= 65 && letter <= 90) {
        
        /*
            The letter is uppercase.
        */

        pos = letter - 65;
    }

    /*
        Work out what we need to do.
    */

    if (letter == 32) {

        /*
            If the letter is a space we need to wait 7 units.
            The gap between the letters is 3 (we have this already from the last letter), plus the missing 
            space between words (4) gives us a total of 7. So here we only have to wait 4 units.
        */

        delay(UNIT * 4);

    } else if (pos >= 0 && pos < 26) {

        /*
            If the value of "pos" is within the array index we have a letter.
        */

        /*
            Turn on power to the master pin (could use a light).
        */

        digitalWrite(MASTERPIN, HIGH);

        /*
            Convert the input char to a semaphore
        */

        flagA.write(map(CODES[pos][0], 0, 180, MIN + trimFlagA, MAX + trimFlagA));
        flagB.write(map(180 - CODES[pos][1], 0, 180, MIN + trimFlagB, MAX + trimFlagB));

        delay(UNIT * 3);

        /*
            Turn off power to the master pin (could use a light).
        */

        digitalWrite(MASTERPIN, LOW);
    }

    /*
        Always reast after a char.
    */

    flagA.write(map(0, 0, 180, MIN + trimFlagA, MAX + trimFlagA));
    flagB.write(map(360, 0, 180, MIN + trimFlagB, MAX + trimFlagB));

    delay(UNIT * 1);
}

/*
    Standard setup function.
*/

void setup() {

    /*
        Setup the pins to use for semaphore code output.
    */

    pins();

    /*
        Listen for incoming data on the serial port.
    */

    Serial.begin(9600);

    /*
        Create a message to use in the sent alert once the setup is complete.
    */

    char message[] = "U";

    /*
        Send the message to announce that the setup is complete.
    */

    toSemaphore(message, sizeof(message) / sizeof(char) - 1);
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
            Output byte we just read a semaphore code.
        */

        semaphore(incomingByte);
    }
}
