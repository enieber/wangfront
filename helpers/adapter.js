function formatToISO(dateStr) {
  const [day, month, year] = dateStr.split("/").map(Number);

  const date = new Date(year, month - 1, day);

  // Retorna a data no formato ISO-8601
  return date.toISOString();
}

// yyyy-mm-dd to dd/mm/yyyy
function formatDate(dateStr) {  
  const rawDate = dateStr.split("T")[0]
  const [year, month, day] = rawDate.split("-");
  return `${day}/${month}/${year}`;
}

export function adapterToClient(data) {
  if (data.birth_date) {
    return {
      ...data,
      birth_date: formatDate(data.birth_date),
      pessoa: data.documentType == 'CNPJ' ? 'juridica' : 'fisica',
      cpf_cnpj: data.document,
      
    };
  }
  return data;
}

export function adapterUpdateUser(values) {
  console.log('date updated', values.birth_date)
  const baseDate = formatToISO(values.birth_date);
  
  return {
    name: values.name,
    birth_date: baseDate,
    phone_number: values.phone_number,
    gender: values.gender,
    registration_type: values.pessoa == 'juridica' ? 'CNPJ' : 'CPF',
    document: values.cpf_cnpj,
  };
}

export function adapterUser(values) {
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
