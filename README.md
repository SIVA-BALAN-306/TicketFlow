# TicketFlow

TicketFlow is a full-stack ticket registration and visitor assistance project. It includes a React frontend, Node/Express APIs, a Python NLP chatbot called TicketFlow AI, and an optional hardware verification flow that scans QR codes and controls an Arduino-connected gate.

## Features

- Ticket registration form with visitor details
- QR code generation for registered visitors
- Payment flow integration using PhonePe sandbox values
- Ticket success and cancellation screens
- TicketFlow AI chatbot powered by PyTorch and NLTK
- Searchable location/spots list from MongoDB
- Optional QR scanner hardware flow using webcam, MongoDB, serial communication, and Arduino
- Vite-based React development workflow

## Tech Stack

- Frontend: React 18, Vite, React Router, React Bootstrap, Material UI, React Icons
- Backend: Node.js, Express, MongoDB, Mongoose
- Chatbot API: Flask, PyTorch, NLTK, NumPy
- Hardware: Python, OpenCV, pyzbar, PySerial, Arduino
- Database: MongoDB / MongoDB Atlas

## Project Structure

```text
TicketFlow/
├── AI-Assistent-main/
│   ├── src/
│   │   ├── components/       # Navigation, login, preloader, search cards, translate widget
│   │   ├── pages/            # Home, registration, payment, success, map, chatbot UI
│   │   ├── App.jsx           # Main React routes and popup
│   │   └── main.jsx          # React entry point
│   ├── app.py                # Flask TicketFlow AI chatbot API
│   ├── chat.py               # CLI chatbot runner
│   ├── train.py              # Chatbot training script
│   ├── intents.json          # Chatbot training intents and responses
│   ├── auth.js               # Registration/payment Express API
│   ├── server.js             # Spots/list Express API
│   ├── package.json          # Frontend and Node dependencies/scripts
│   └── vite.config.js
├── Hardware-File/
│   ├── main.py               # QR scanner + MongoDB + Arduino serial control
│   └── Ardiuno.ino           # Arduino sketch
├── requirements.txt          # Python dependencies
└── README.md
```

## Prerequisites

- Node.js 18 or newer
- npm
- Python 3.10 or newer
- Git
- MongoDB Atlas connection string or local MongoDB instance
- Optional hardware workflow:
  - Webcam
  - Arduino board
  - ZBar installed for `pyzbar`
  - Correct serial port, such as `COM4` on Windows

## Installation

Clone the repository and install the frontend/Node dependencies:

```bash
cd TicketFlow/AI-Assistent-main
npm install
```

Create and activate a Python virtual environment from the repository root:

```bash
cd TicketFlow
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Environment Variables

Create a `.env` file inside `AI-Assistent-main/`:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

`auth.js` and `server.js` both read `MONGODB_URI`. If it is missing, the server will throw an error.

Important: some files currently contain hardcoded credentials or test values, including:

- `Hardware-File/main.py`: MongoDB connection string
- `AI-Assistent-main/src/pages/payment.jsx`: PhonePe sandbox merchant details
- `AI-Assistent-main/chatbot2.py`: RapidAPI key

Move these values into environment variables before using the project outside local development.

## Running the Frontend

Start the Vite development server:

```bash
cd TicketFlow/AI-Assistent-main
npm run dev
```

The app usually runs at:

```text
http://localhost:5173
```

Build the frontend for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Running the Node APIs

There are two Express API entry points:

| File | Purpose | Main Routes |
| --- | --- | --- |
| `auth.js` | Registration/payment records | `POST /payment`, `GET /payment/:phoneNumber` |
| `server.js` | Spots/search data | `GET /natural-medicines` |

Run the registration/payment API:

```bash
cd TicketFlow/AI-Assistent-main
node auth.js
```

Run the spots/search API:

```bash
cd TicketFlow/AI-Assistent-main
node server.js
```

By default, both use port `5000`. Run only one at a time, or set different ports:

```bash
$env:PORT=5001
node server.js
```

## Running TicketFlow AI

Train the chatbot model first. This reads `intents.json` and creates `data.pth`:

```bash
cd TicketFlow/AI-Assistent-main
python train.py
```

Start the Flask chatbot API:

```bash
python app.py
```

The chatbot API exposes:

```text
POST http://127.0.0.1:5000/bot
```

Example request body:

```json
{
  "message": "How much are tickets?"
}
```

You can also test the chatbot in the terminal:

```bash
python chat.py
```

Note: the Flask chatbot API also uses port `5000` by default. If the Node API is already running on port `5000`, change one of the services to another port and update the frontend fetch URLs.

## Main User Flow

1. Open the React app.
2. Register visitor details on the registration page.
3. The app posts the details to the Express payment API.
4. The app calculates the ticket amount at Rs. 50 per person.
5. The payment page starts a PhonePe sandbox payment request.
6. After payment, the success page displays QR codes for visitors.
7. The optional hardware module scans QR codes and checks visitor details in MongoDB.
8. If a matching visitor is found, the record is processed and the Arduino receives a signal.

## Hardware Workflow

Before running the hardware module:

- Update the MongoDB connection string in `Hardware-File/main.py`
- Update the database and collection names if needed
- Update the Arduino serial port:

```python
arduino = serial.Serial('COM4', 9600, timeout=1)
```

- Update the webcam index if needed:

```python
cap = cv2.VideoCapture(1)
```

Run the scanner:

```bash
cd TicketFlow
python Hardware-File/main.py
```

The QR code format expected by the scanner is:

```text
Name: VisitorName, Age: 25
```

When a match is found in MongoDB, the script sends `1` to Arduino. If no match is found, it sends `0`.

## Available npm Scripts

Run these from `AI-Assistent-main/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Troubleshooting

### `MONGODB_URI is not set`

Create `AI-Assistent-main/.env` and add:

```env
MONGODB_URI=your_mongodb_connection_string
```

### Port `5000` is already in use

The Node APIs and Flask chatbot all default to port `5000`. Stop the service currently using the port, or run one service on a different port and update the frontend API URLs.

### `pyzbar` cannot find ZBar

Install the ZBar shared library for your operating system. The Python package `pyzbar` needs the native ZBar dependency to decode QR codes.

### PhonePe payment request fails

The payment page currently uses sandbox constants in `src/pages/payment.jsx`. Verify the merchant ID, salt key, salt index, host URL, and redirect settings before testing.

### Vite build warning about `os`

The project may show a warning that Node's `os` module was externalized for browser compatibility because of `uniqid`. The build can still complete, but replacing `uniqid` with a browser-native ID generator can remove the warning.

## Security Notes

- Do not commit real API keys, database passwords, payment secrets, or production merchant credentials.
- Move hardcoded secrets into `.env` files.
- Add `.env` to `.gitignore` if it is not already ignored.
- Rotate any credentials that were previously committed.
- Validate and sanitize user input before using this application in production.

## Future Improvements

- Combine the Express endpoints into one backend service
- Move all API base URLs into environment variables
- Add backend validation for registration data
- Add authentication for admin or staff workflows
- Replace hardcoded payment credentials with environment variables
- Add automated tests for frontend forms and backend APIs
- Improve hardware configuration through `.env` instead of editing Python source