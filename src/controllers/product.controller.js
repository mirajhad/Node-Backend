import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import client from "twilio";

const addProduct = asyncHandler(async (req, res) => {
  const { name, email, address, phone, quantity, price } = req.body;
  if (
    [name, email, address, phone, quantity, price].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  try {
    const order = await Order.create({
      name,
      email,
      address,
      phone,
      quantity,
      price,
    });
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const clientData = client(accountSid, authToken);
    clientData.messages.create({
      body: `Thank you ${name} for your purchase! Your order will be delivered to ${address}.
      Details:
      Phone: ${phone},
      Quantity: ${quantity},
      Price: ${price}
      `,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`,
    });

    res.status(200).json(
      new ApiResponse(200, "Product added successfully", {
        name,
        email,
        address,
        phone,
        quantity,
        price,
      })
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default addProduct;
