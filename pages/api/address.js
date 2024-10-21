//
import axios from "axios";
import { adapterToClient, adapterUpdateUser } from "../../helpers/adapter";
import { getToken } from "../../helpers/header";

export default async function handler(request, res) {
  try {
    const token = getToken(request);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    if (request.method === "GET") {
      const { user_id } = request.query;
      const response = await axios.get(
        `${process.env.URL}/platform/get-user-address/${user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Retorna as informações do usuário
      res.status(200).json(response.data);  
    } else if (request.method === "POST") {
      const { id_product } = request.query;
      const response = await axios.delete(
        `${process.env.URL}/platform/remove-favorite/${id_product}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      res.status(200).json(response.data);
    } else {
      res.status(405).json({ message: "method not allow" });
    }
  } catch (err) {
    console.log(err);
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
