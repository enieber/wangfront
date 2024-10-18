import axios from "axios";
import { adapterToClient, adapterUpdateUser } from "../../helpers/adapter";

function getToken(request) {
  const cookies = request.headers.cookie;
  const match = cookies.match(/authToken=([^;]+)/);
  const token = match ? match[1] : null;
  return token
}

export default async function handler(request, res) {
  try {
    if (request.method === "GET") {      
      const token = getToken(request)
      if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }

      // Faz a requisição para o endpoint de usuário com o token
      const response = await axios.get(`${process.env.URL}/platform/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      // Retorna as informações do usuário
      res.status(200).json(adapterToClient(response.data));
    } else if (request.method === "PUT") {     
      const token = getToken(request)
      const data = adapterUpdateUser(request.body)
      console.log('data', data)
      const response = await axios.put(`${process.env.URL}/platform/update-user`, data,
        {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      res.status(200).json(response.data);
    } else if (request.method === "POST") {
      const token = getToken(request)       
      const code = request.body.code;
      const response = await axios.put(`${process.env.URL}/platform/verify-user/${code}`, {},
        {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      res.status(200).json(response.data);
    } else {
      res.status(405).json({ message: "method not allow" });      
    }
  } catch (err) {
    console.log(err)
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
