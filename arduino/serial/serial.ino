const int outputPin = 13;

void setup() {
    pinMode(outputPin, OUTPUT);
    Serial.begin(9600);
}

void loop() {
    if (Serial.available() > 0) {
        int incomingByte = Serial.read();
        // Need to return a value so the other end can close the port.
        Serial.println();
        if (incomingByte == 0x01) {
            digitalWrite(outputPin, HIGH);
            delay(5000);
            digitalWrite(outputPin, LOW);
        }
    }
}
