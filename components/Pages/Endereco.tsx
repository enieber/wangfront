"use client";

import {
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  FormErrorMessage,
  Radio,
  RadioGroup,
  Stack,
  Box,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  useMediaQuery,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  SimpleGrid,
  Card,
  Link,
  Tabs,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import InputMask from "react-input-mask";
import * as Yup from "yup";
import Select from "react-select";
import { validateCNPJ, validateCPF } from "validations-br";
import axios from "axios";

enum Pessoa {
  fisica = "Fisica",
  juridica = "Juridica",
}

const RegisterSchema = Yup.object({
  nome: Yup.string()
    .min(2, "Seu nome é muito curto")
    .max(70, "Seu nome é muito longo")
    .required("Digite um nome"),
  birthDate: Yup.date().required(),
  password: Yup.string()
    .min(8, "Sua senha é muito curta")
    .required("Digite sua senha"),
  email: Yup.string().email("Seu email é inválido").required("Digite um email"),
  endereco: Yup.string()
    .min(2, "Seu enderçeo é inválido")
    .max(50, "Seu enderçeo é inválido")
    .required("Digite um endereço"),
  pessoa: Yup.string().required("Selecione o tipo de pessoa"),
  celular: Yup.string().required("Digite um celular"),
  telefone: Yup.string(),
  cep: Yup.string()
    .min(8, "Seu CEP é inválido")
    .max(9, "seu CEP é inválido")
    .required("Digite um CEP"),
  numero: Yup.number()
    .positive("Seu número precisa ser positivo")
    .integer("Seu número precisa ser válido")
    .required("Digite um número"),
  complemento: Yup.string(),
  referencia: Yup.string(),
  bairro: Yup.string(),
  estado: Yup.string().required("Selecione um estado"),
  cpf_cnpj: Yup.string().test(
    "cpf_cnpj",
    "Documento inválido",
    function (value?: string) {
      const { pessoa } = this.parent; // Acessa o valor de 'pessoa'
      if (!value) {
        return false;
      }
      if (pessoa === "fisica") {
        return validateCPF(value);
      } else if (pessoa === "juridica") {
        return validateCNPJ(value);
      }
      return false; // Retorna false para marcar como inválido
    }
  ),
});

const steps = [
  { title: "Conta", description: "Adicione dados de acesso" },
  { title: "Pessoal", description: "Adicione dados pessoais" },
  { title: "Endereço", description: "Adicione dados de endereço" },
];

export default function Endereco({ states }: any) {
  const [mobile] = useMediaQuery("(max-width: 400px)");
  const { user } = useAuth();
  const router = useRouter();
  const [isNotEdit, enableNotEdit] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  function saveAddress(valus: any) {}

  async function searchAddressInfo(cep: any, setField: any) {
    setLoading(true);
    try {
      const res = await axios.get("/api/cep", {
        params: { cep },
      });
      const address = res.data;
      setField("endereco", address.street);
      setField("bairro", address.neighborhood);
      setField("cidade", address.city);
      const state: any = states.find(
        (item: any) => item.value === address.state
      );
      setField("estado", state.value);
    } catch (err) {
      console.log(err);
      setField("endereco", "");
      setField("bairro", "");
      setField("cidade", "");
    } finally {
      setLoading(false);
    }
  }
  console.log(user);
  return (
    <Flex direction={"column"} as={"main"} w={"full"}>
      <Flex p={10}>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="/conta">Conta</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Flex>
      <SimpleGrid spacing={10} templateColumns="1fr 4fr">
        <Card gap={5} p={10}>
          <Heading size="md">{user?.name ? user.name : ""}</Heading>

          <Link href="/conta">Minha Conta</Link>
          <Link href="/conta/endereco">Meu Endereço</Link>
          <Link href="/conta/senha">Alterar Senha</Link>
        </Card>
        <Card>
          <Tabs variant="soft-rounded">
            <Flex as={"section"} direction={"column"} py={4}>
              <TabPanels>
                <TabPanel>
                  <Flex
                    direction={mobile ? "column" : "row"}
                    mx={4}
                    gap={10}
                    my={4}
                  >
                   
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Flex>
          </Tabs>
        </Card>
      </SimpleGrid>
    </Flex>
  );
}
