import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB connection
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not set");
}

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

// Define Mongoose schema and model for Payment
const paymentSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  peopleCount: {
    type: Number,
    required: true,
  },
  peopleDetails: [
    {
      name: String,
      age: String,
    },
  ],
});

const PaymentModel = mongoose.model("Registration_details", paymentSchema);

// Payment submission endpoint
app.post("/payment", async (req, res) => {
  const { address, phoneNumber, peopleCount, peopleDetails } = req.body;

  try {
    const existingPayment = await PaymentModel.findOne({ phoneNumber });

    if (existingPayment) {
      res.json("exist");
    } else {
      const newPayment = new PaymentModel({
        address,
        phoneNumber,
        peopleCount,
        peopleDetails,
      });
      await newPayment.save();
      res.json("notexist");
    }
  } catch (error) {
    console.error("Error during Payment submission:", error);
    res.json("fail");
  }
});

// Get payment details endpoint
app.get("/payment/:phoneNumber", async (req, res) => {
  const { phoneNumber } = req.params;

  try {
    const payment = await PaymentModel.findOne({ phoneNumber });
    if (payment) {
      res.json(payment);
    } else {
      res.status(404).json({ message: "Payment not found" });
    }
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
