#include <Servo.h>

Servo myservo;  // Create a servo object

void setup() {
  Serial.begin(9600);  // Start serial communication
  myservo.attach(9);   // Attach the servo to pin 9
  myservo.write(90);    // Initial position of the servo
}

void loop() {
  if (Serial.available() > 0) {
    char command = Serial.read();
    if (command == '1') {
      myservo.write(0);  // Open the door (90 degrees)
      delay(2000);        // Keep the door open for 5 seconds
      myservo.write(90);   // Close the door (0 degrees)
    } 
    else if (command == '0')
     {
      myservo.write(90);   // Keep the door closed
    }
  }
}
