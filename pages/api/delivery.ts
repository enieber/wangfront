import type { NextApiRequest, NextApiResponse } from "next";
import Api from "../../services/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    if (req.method === "GET") {
      console.log('query', req.query.cep)
      const { cep } = req.query;
      const response = await Api.post(
        `/platform/get-delivery-value/${cep}`);
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
