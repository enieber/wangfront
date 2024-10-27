import axios from "axios";
import { getToken } from "../../helpers/header";

export default async function handler(
  req,
  res
) {
  try {
    const token = getToken(req);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    if (req.method === "POST") {
      const { retry } = req.query;
      const values = req.body;
      if (retry==1) {
        const response = await axios.get(
          `${process.env.URL}/platform/get-sales-status/${values.orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        res.status(200).json(response.data);
      } else {
        const response = await axios.post(
          `${process.env.URL}/platform/payment`,
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        res.status(200).json(response.data);
      }
    } else {
      res.status(405).json({ name: "method not allow" });
    }
  } catch (err ) {
    console.log(err);
    if (err.status !== 500) {
      if (err.response) {
        res.status(err.status).json({ message: err.response.data.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    } else {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  }
}
