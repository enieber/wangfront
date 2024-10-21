import axios from "axios";
import { adapterUser } from "../../helpers/adapter";


export default async function handler(request, res) {
  try {
    if (request.method === "POST") {
      const values = await request.body;
      console.log("values", values)
      const response = await axios.post(
        `${process.env.URL}/platform/create-user`,
        values
      );
      res.status(201).json({ message: "User created" });
    } else {
      res.status(405).json({ message: "method not allow" });
    }
  } catch (err) {
    console.log(err.response.data);
    if (err.status !== 500) {
      if (err.response) {
        res.status(err.status).json({ message: err.response.data.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    } else {
      res.status(500).json({ message: err.message });
    }
  }
}
