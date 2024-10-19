import axios from "axios";

function getToken(request) {
  const cookies = request.headers.cookie;
  const match = cookies.match(/authToken=([^;]+)/);
  const token = match ? match[1] : null;
  return token
}

export default async function handler(request, res) {
  try {
    if (request.method === "PUT") {      
      const values = await request.body;
      const token = getToken(request);                    
      const response = await axios.put(`${process.env.URL}/platform/update-password`, {
        old_password: values.old_password,
        new_password: values.password,
      },{
        headers: {                  
          Authorization: `Bearer ${token}`,
        }
      });      
      const restData = response.data;
      res.status(200).json(restData);
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
