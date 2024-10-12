import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method === "GET") {
      const { cep } = req.query;
      const response = await axios.get(
        `https://brasilapi.com.br/api/cep/v1/${cep}`
      );
      const data = response.data;
      res.status(200).json(data);
    } else {
      res.status(405).json({ name: "method not allow" });
    }
  } catch (err: any) {
    res.status(500).json({ name: "Error load cep" });
  }
}
