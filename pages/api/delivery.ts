import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    if (req.method === "GET") {
      console.log('query', req.query.cep)
      const { cep } = req.query;
      const response = await axios.post(
        `${process.env.URL_API}/platform/get-delivery-value/${cep}`);
      const data = response.data;
      res.status(200).json(data);
    } else {
      res.status(405).json({ name: "method not allow" });
    }
  } catch (err: any) {
    console.log(err)
    res.status(500).json({ name: "Error load cep" });
  }
}
