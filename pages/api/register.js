import axios from "axios";

function formatToISO(dateStr) {
  // Divide a string de data em dia, mês e ano
  const [day, month, year] = dateStr.split("/").map(Number);

  // Cria um objeto Date usando a data fornecida
  const date = new Date(year, month - 1, day);

  // Retorna a data no formato ISO-8601
  return date.toISOString();
}

function trasnformToSend(values) {
  const baseDate = formatToISO(values.birthDate);
  return {
    name: values.nome,
    email: values.email,
    password: values.password,
    documentType: values.pessoa == "fisica" ? "CPF" : "CNPJ",
    document: values.cpf_cnpj,
    zipCode: values.cep,
    number: values.numero,
    street: values.endereco,
    neighborhood: values.bairro,
    state: values.estado,
    city: values.cidade,
    country: "Brasil",
    birthDate: baseDate,
    cellphone: values.celular,
  };
}

export default async function handler(request, res) {
  try {
    if (request.method === "POST") {
      const values = await request.body;
      const objetSend = trasnformToSend(values);
      const response = await axios.post(
        `${process.env.URL}/platform/create-user`,
        objetSend
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
