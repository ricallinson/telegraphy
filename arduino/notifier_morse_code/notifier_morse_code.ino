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
    The time in ms for a single morse code UNIT.
*/

const int UNIT = 200;

/*
    Mapping of chars to international morse code
*/

const int CODES[26][4] = {
    {1, 3, 0, 0}, // A .-
    {3, 1, 1, 1}, // B -...
    {3, 1, 3, 1}, // C -.-.
    {3, 1, 1, 0}, // D -..
    {1, 0, 0, 0}, // E .
    {1, 1, 3, 1}, // F ..-.
    {3, 3, 1, 0}, // G --.
    {1, 1, 1, 1}, // H ....
    {1, 1, 0, 0}, // I ..
    {1, 3, 3, 3}, // J .---
    {2, 1, 3, 0}, // K -.-
    {1, 3, 1, 1}, // L .-..
    {3, 3, 0, 0}, // M --
    {3, 1, 0, 0}, // N -.
    {3, 3, 3, 0}, // O ---
    {1, 3, 3, 1}, // P .--.
    {3, 3, 1, 3}, // Q --.-
    {1, 3, 1, 0}, // R .-.
    {1, 1, 1, 0}, // S ...
    {3, 0, 0, 0}, // T -
    {1, 1, 3, 0}, // U ..-
    {1, 1, 1, 3}, // V ...-
    {1, 3, 3, 0}, // W .--
    {3, 1, 1, 3}, // X -..-
    {3, 1, 3, 3}, // Y -.--
    {3, 3, 1, 1}  // Z --..
};

/*
    The master pin to use for sending dots and dashes.
    We use PIN 13's a LED on the board to make it easy to test.
    All other pins are a negative offset from this one.
*/

const int MASTERPIN = 13;

/*
    Set the LED pins to use for morse code output.
*/

void pins() {
    pinMode(MASTERPIN, OUTPUT);
    pinMode(MASTERPIN - 1, OUTPUT);
    pinMode(MASTERPIN - 2, OUTPUT);
}

/*
    Words
*/

void on() {
    digitalWrite(MASTERPIN, HIGH);
    digitalWrite(MASTERPIN - 1, HIGH);
    tone(MASTERPIN - 2, 780);
}

/*
    Words
*/

void off() {
    digitalWrite(MASTERPIN, LOW);
    digitalWrite(MASTERPIN - 1, LOW);
    noTone(MASTERPIN - 2);
}

/*
    Takes the given "message" and passes it char-by-char to the "morse()" function.
*/

void toMorse(char *message, int length) {
    for (int i = 0; i < length; i++) {
        morse(message[i]);
    }
}

/*
  Takes the given ASCII code and converts it to international morse code
  output by setting the given pin to HIGH and LOW accordingly.
*/

void morse(int letter) {

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

        for (int i = 0; i < 4; i++) {

            /*
                As each morse code is a max of 4 units we can simply
                loop over them to see if we need to do anything.
            */

            if (CODES[pos][i] > 0) {

                /*
                    If the index code is greater than 0 then we activate the pin.
                    How long the pin is active for is the UNIT * the index value.

                    dot = 1 unit
                    dash = 3 units
                    spaces between the parts of the same letter = 1 unit
                */

                on();
                delay(UNIT * CODES[pos][i]);
                off();
                delay(UNIT);
            }
        }

        /*
            The gap between letters of the same word is 3 units.
            As we already waited for 1 unit above we only have to wait 2 units here.
        */

        delay(UNIT * 2);
    }
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

    toMorse(message, sizeof(message) / sizeof(char) - 1);
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

        morse(incomingByte);
    }
}
