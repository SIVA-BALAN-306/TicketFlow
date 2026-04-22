import cv2
import re
import serial
import time
from pymongo import MongoClient
from pyzbar.pyzbar import decode

# MongoDB connection
connection_string = "mongodb+srv://bravinlc00123:0000@barvin.cnjhott.mongodb.net/"
client = MongoClient(connection_string)
db = client['registration-details']
collection = db['registration_details']

# Initialize serial communication with Arduino
arduino = serial.Serial('COM4', 9600, timeout=1)  # Replace 'COM4' with your Arduino's port
time.sleep(2)  # Wait for the connection to establish

def decode_qr_from_frame(frame):
    decoded_objects = decode(frame)
    for obj in decoded_objects:
        return obj.data.decode('utf-8')
    return None

def parse_qr_data(qr_data):
    match = re.match(r"Name: (\w+), Age: (\d+)", qr_data)
    if match:
        return match.group(1), int(match.group(2))
    return None, None

def check_and_delete_details_in_db(name, age, collection):
    query = {
        'peopleDetails': {
            '$elemMatch': {

                
                'name': name,
                'age': str(age)
            }
        }
    }
    update = {
        '$pull': {
            'peopleDetails': {
                'name': name,
                'age': str(age)
            }
        }
    }
    
    result = collection.find_one(query)
    if result:
        # Remove the specific object from the peopleDetails array
        collection.update_one(query, update)
        
        # Check if the peopleDetails array is empty after the deletion
        updated_result = collection.find_one({'_id': result['_id']})
        if not updated_result or len(updated_result.get('peopleDetails', [])) == 0:
            collection.delete_one({'_id': result['_id']})
            print("Entire document deleted as peopleDetails was empty.")
        
        return True, result
    else:
        return False, None

def main():
    # Open webcam
    cap = cv2.VideoCapture(1)

    print("Starting QR code scan. Please show a QR code to the webcam.")

    while True:
        # Capture frame-by-frame
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame")
            break
        
        # Decode QR code
        decoded_data = decode_qr_from_frame(frame)
        if decoded_data:
            print(f"Decoded data from QR code: {decoded_data}")
            
            # Parse name and age from decoded data
            name, age = parse_qr_data(decoded_data)
            
            if name and age is not None:
                # Check if the decoded data exists in MongoDB and delete it if found
                found, details = check_and_delete_details_in_db(name, age, collection)
                if found:
                    print("Details found and processed:", details)
                    arduino.write(b'1')  # Send '1' to Arduino to open the door
                else:
                    print("No matching details found.")
                    arduino.write(b'0')  # Send '0' to Arduino to keep the door closed
            else:
                print("Invalid QR code data format")
        
        # Display the frame (optional)
        cv2.imshow('Webcam', frame)

        # Break the loop when 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    # Release the webcam and close windows
    cap.release()
    cv2.destroyAllWindows()
    arduino.close()  # Close the serial connection with Arduino

if __name__ == "__main__":
    main()
