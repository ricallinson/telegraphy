const int LED0 = 3;
const int LED1 = 4;
const int LED2 = 5;

void alert() {
  sequence();
  delay(800);
  sequence();
}

void sequence() {

  int val[] = {1, 2, 3, 1, 0, 1, 2, 1, 0, 1, 2, 3, 2, 1, 0};
  int length = sizeof(val) / sizeof(int);

  for (int i = 0; i < length; i++) {
    if (val[i] >= 1) {
      digitalWrite(LED0, HIGH);
    } else {
      digitalWrite(LED0, LOW);
    }

    if (val[i] >= 2) {
      digitalWrite(LED1, HIGH);
    } else {
      digitalWrite(LED1, LOW);
    }

    if (val[i] >= 3) {
      digitalWrite(LED2, HIGH);
    } else {
      digitalWrite(LED2, LOW);
    }
    delay(100);
  }
}

void setup() {
  // Set the LED pins for output
  pinMode(LED0, OUTPUT);
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  // Listen for incoming data
  Serial.begin(9600);
  // Run the test sequence
  alert();
}

void loop() {
  if (Serial.available() > 0) {
    // Read a byte from the available data
    int incomingByte = Serial.read();
    // Need to return a value so the other end can close the port.
    Serial.println(incomingByte);
    // If the incoming byte equals "200" then shine.
    if (incomingByte == 200) {
      alert();
    }
  }
}

