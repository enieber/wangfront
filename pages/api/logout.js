import axios from "axios";

export default async function handler(request, res) {
  try {
    if (request.method === "POST") {
      res.setHeader('Set-Cookie', `authToken=; HttpOnly; Path=/;`);
      res.status(200).json({ loggedIn: false });
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
