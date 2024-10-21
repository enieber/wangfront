import axios from "axios";
import { adapterToClient, adapterUpdateUser } from "../../helpers/adapter";
import { getToken, getUserFromToken } from "../../helpers/header";

export default async function handler(request, res) {
  try {
    const token = getToken(request);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    if (request.method === "POST") {
      const user = getUserFromToken(token)
      const {
        productName,
        categories,
        brand,
        sortBy,
        sortOrder,
        page: page,
        pageSize: pageSize,
      } = request.body;
    
      const response = await axios.post(`${process.env.URL}/platform/list-products`, {
        productName,
        categories,
        brand,
        sortBy,
        sortOrder,
        page: page || 1,
        pageSize: pageSize || 10,
      }, 
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
