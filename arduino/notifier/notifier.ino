
const int LED0 = 13;
const int LED1 = 12;
const int LED2 = 11;

const int UNIT = 300;

void toMorse(char *message, int length) {
  for (int i = 0; i < length; i++) {
    morse(message[i]);
  }
}

void morse(int letter) {

  int code[4];

  Serial.println(letter);

  switch (letter) {
    case 65: // A .-
      code[0] = 1;
      code[1] = 2;
      code[2] = 0;
      code[3] = 0;
      break;
    case 66: // B -...
      code[0] = 2;
      code[1] = 1;
      code[2] = 1;
      code[3] = 1;
      break;
    case 67: // C -.-.
      code[0] = 2;
      code[1] = 1;
      code[2] = 2;
      code[3] = 1;
      break;
    case 68: // D -..
      code[0] = 2;
      code[1] = 1;
      code[2] = 1;
      code[3] = 0;
      break;
    case 69: // E .
      code[0] = 1;
      code[1] = 0;
      code[2] = 0;
      code[3] = 0;
      break;
    case 70: // F ..-.
      code[0] = 1;
      code[1] = 1;
      code[2] = 2;
      code[3] = 1;
      break;
    case 71: // G --.
      code[0] = 2;
      code[1] = 2;
      code[2] = 1;
      code[3] = 0;
      break;
    case 72: // H ....
      code[0] = 1;
      code[1] = 1;
      code[2] = 1;
      code[3] = 1;
      break;
    case 73: // I ..
      code[0] = 1;
      code[1] = 1;
      code[2] = 0;
      code[3] = 0;
      break;
    case 74: // J .---
      code[0] = 1;
      code[1] = 2;
      code[2] = 2;
      code[3] = 2;
      break;
    case 75: // K -.-
      code[0] = 2;
      code[1] = 1;
      code[2] = 2;
      code[3] = 0;
      break;
    case 76: // L .-..
      code[0] = 1;
      code[1] = 2;
      code[2] = 1;
      code[3] = 1;
      break;
    case 77: // M --
      code[0] = 2;
      code[1] = 2;
      code[2] = 0;
      code[3] = 0;
      break;
    case 78: // N -.
      code[0] = 2;
      code[1] = 1;
      code[2] = 0;
      code[3] = 0;
      break;
    case 79: // O ---
      code[0] = 2;
      code[1] = 2;
      code[2] = 2;
      code[3] = 0;
      break;
    case 80: // P .--.
      code[0] = 1;
      code[1] = 2;
      code[2] = 2;
      code[3] = 1;
      break;
    case 81: // Q --.-
      code[0] = 2;
      code[1] = 2;
      code[2] = 1;
      code[3] = 2;
      break;
    case 82: // R .-.
      code[0] = 1;
      code[1] = 2;
      code[2] = 1;
      code[3] = 0;
      break;
    case 83: // S ...
      code[0] = 1;
      code[1] = 1;
      code[2] = 1;
      code[3] = 0;
      break;
    case 84: // T -
      code[0] = 2;
      code[1] = 0;
      code[2] = 0;
      code[3] = 0;
      break;
    case 85: // U ..-
      code[0] = 1;
      code[1] = 1;
      code[2] = 2;
      code[3] = 0;
      break;
    case 86: // V ...-
      code[0] = 1;
      code[1] = 1;
      code[2] = 1;
      code[3] = 2;
      break;
    case 87: // W .--
      code[0] = 1;
      code[1] = 2;
      code[2] = 2;
      code[3] = 0;
      break;
    case 88: // X -..-
      code[0] = 0;
      code[1] = 0;
      code[2] = 0;
      code[3] = 0;
      break;
    case 89: // Y -.--
      code[0] = 2;
      code[1] = 1;
      code[2] = 2;
      code[3] = 2;
      break;
    case 90: // Z --..
      code[0] = 2;
      code[1] = 2;
      code[2] = 1;
      code[3] = 1;
      break;
    default:
      code[0] = 0;
      code[1] = 0;
      code[2] = 0;
      code[3] = 0;
  }
  
  if (letter == 32) { // space 7 units
    delay(UNIT * 5); // gap between letters (2) + space between words (5) = 7
  } else {
    // It must be a letter
    for (int i = 0; i < 4; i++) {
      if (code[i] > 0) {
        digitalWrite(LED0, HIGH);
        if (code[i] == 1) {
          delay(UNIT); // dot 1 unit
        } else {
          delay(UNIT * 3); // dash 3 units
        }
        digitalWrite(LED0, LOW);
        delay(UNIT); // space between parts of the same leter 1 unit
      }
    }
    delay(UNIT * 2); // gap between letters (1) + space between parts of the same leter (2) = 3 units
  }
}

void setup() {
  // Set the LED pins for output
  pinMode(LED0, OUTPUT);
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  // Listen for incoming data
  Serial.begin(9600);
  // Run the test sequence of all supported chars
  // char message[] = "ABCDEFGHIGKLMNOPQRSTUVWXYZ ";
  char message[] = "A";
  toMorse(message, sizeof(message) / sizeof(char) - 1);
}

void loop() {
  if (Serial.available() > 0) {
    // Read a byte from the available data
    int incomingByte = Serial.read();
    // Output byte as morsecode
    morse(incomingByte);
  }
}

