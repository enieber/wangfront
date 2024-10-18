import axios from "axios";

export default async function handler(request, res) {
  try {
    if (request.method === "POST") {
      const values = await request.body;
      
      const response = await axios.post(`${process.env.URL}/platform/login`, {
        email: values.email,
        password: values.password,
      });
      console.log('response.data', response.data)
      const restData = response.data;
      const token = response.data.token;
      res.setHeader("Set-Cookie", `authToken=${token}; HttpOnly; Path=/;`);
      res.status(200).json(restData);
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
