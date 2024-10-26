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
      const values = req.body;
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
    } else {
      res.status(405).json({ name: "method not allow" });
    }
  } catch (err ) {
    console.log(err)
    res.status(500).json({ name: "Error load cep" });
  }
}
