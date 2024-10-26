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
        const response = await axios.put(
          `${process.env.URL}/platform/re-payment`,
          values,
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
    console.log(err)
    res.status(500).json({ name: "Error pagamento" });
  }
}
