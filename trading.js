import "dotenv/config.js";
import fetch from "node-fetch";

// post - /v2/orders
const baseUrl = process.env.PAPER_API_URL;

const seeCurrentOrders = async () => {
  const response = await fetch(`${baseUrl}/orders`, {
    method: "get",
    headers: {
      "APCA-API-KEY-ID": process.env.APCA_API_KEY_ID,
      "APCA-API-SECRET-KEY": process.env.APCA_API_SECRET_KEY,
    },
  });

  const data = await response.json();
  console.log(data);
  return response.status === 200;
};

const placeOrder = async ({
  symbol,
  qty,
  side,
  type = "market",
  time_in_force = "gtc",
}) => {
  const response = await fetch(`${baseUrl}/orders`, {
    method: "post",
    headers: {
      "APCA-API-KEY-ID": process.env.APCA_API_KEY_ID,
      "APCA-API-SECRET-KEY": process.env.APCA_API_SECRET_KEY,
    },
    body: JSON.stringify({
      symbol,
      qty,
      side,
      type,
      time_in_force,
    }),
  });

  const data = await response.json();
  console.log(data);
  return response.status === 200;
};

placeOrder({ symbol: "GME", qty: "1", side: "buy" });
seeCurrentOrders();
