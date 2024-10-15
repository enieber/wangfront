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
  Box,
  useMediaQuery,
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
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Formik, Field } from "formik";
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
          <Link href="/conta/endereco">Minha endereço</Link>

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
                    <Formik
                      initialValues={{
                        nome: user?.name,
                        email: user.email,
                        razao_social: "",
                        inscricao_estadual: "",
                        password: "",
                        endereco: "",
                        cpf_cnpj: "",
                        celular: "",
                        telefone: "",
                        pessoa: "fisica",
                        cep: "",
                        numero: "",
                        complemento: "",
                        referencia: "",
                        bairro: "",
                        estado: "",
                        birthDate: "",
                      }}
                      onSubmit={(values: any) => saveAddress(values)}
                      validationSchema={RegisterSchema}
                    >
                      {({ values, errors, touched }) => (
                        <Box>
                          <Field name="cep">
                            {({ field, form }: { field: any; form: any }) => (
                              <FormControl
                                mt={4}
                                isInvalid={form.errors.cep && form.touched.cep}
                              >
                                <FormLabel>CEP</FormLabel>
                                <InputMask
                                  mask="99999-999"
                                  value={field.value}
                                  onChange={(e: any) =>
                                    form.setFieldValue("cep", e.target.value)
                                  }
                                  onBlur={field.onBlur}
                                >
                                  {(inputProps: any) => (
                                    <InputGroup size="md">
                                      <Input
                                        {...inputProps}
                                        placeholder="76806-210"
                                      />
                                      {field.value.length >= 1 && (
                                        <InputRightElement width="4.5rem">
                                          <Button
                                            size="md"
                                            disabled={
                                              field.value
                                                .replace("_", "")
                                                .replace("-", "").length < 8
                                            }
                                            onClick={() =>
                                              searchAddressInfo(
                                                field.value,
                                                form.setFieldValue
                                              )
                                            }
                                          >
                                            Buscar
                                          </Button>
                                        </InputRightElement>
                                      )}
                                    </InputGroup>
                                  )}
                                </InputMask>

                                <FormErrorMessage>
                                  {form.errors.cep}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="numero">
                            {({ field, form }: { field: any; form: any }) => (
                              <FormControl
                                mt={4}
                                isInvalid={
                                  form.errors.numero && form.touched.numero
                                }
                              >
                                <FormLabel>Número</FormLabel>
                                <Input
                                  w={mobile ? 350 : 500}
                                  {...field}
                                  placeholder="Digite seu número"
                                />
                                <FormErrorMessage>
                                  {form.errors.numero}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="endereco">
                            {({ field, form }: { field: any; form: any }) => (
                              <FormControl
                                mt={4}
                                isInvalid={
                                  form.errors.endereco && form.touched.endereco
                                }
                              >
                                <FormLabel>Endereço</FormLabel>
                                <Input
                                  w={mobile ? 350 : 500}
                                  {...field}
                                  placeholder="Digite seu endereço"
                                />
                                <FormErrorMessage>
                                  {form.errors.endereco}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="complemento">
                            {({ field, form }: { field: any; form: any }) => (
                              <FormControl
                                mt={4}
                                isInvalid={
                                  form.errors.complemento &&
                                  form.touched.complemento
                                }
                              >
                                <FormLabel>Complemento</FormLabel>
                                <Input
                                  w={mobile ? 350 : 500}
                                  {...field}
                                  placeholder="Digite seu complemento"
                                />
                                <FormErrorMessage>
                                  {form.errors.complemento}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="referencia">
                            {({ field, form }: { field: any; form: any }) => (
                              <FormControl
                                mt={4}
                                isInvalid={
                                  form.errors.referencia &&
                                  form.touched.referencia
                                }
                              >
                                <FormLabel>Referência</FormLabel>
                                <Input
                                  w={mobile ? 350 : 500}
                                  {...field}
                                  placeholder="Referência"
                                />
                                <FormErrorMessage>
                                  {form.errors.referencia}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="bairro">
                            {({ field, form }: { field: any; form: any }) => (
                              <FormControl
                                mt={4}
                                isInvalid={
                                  form.errors.bairro && form.touched.bairro
                                }
                              >
                                <FormLabel>Bairro</FormLabel>
                                <Input
                                  w={mobile ? 350 : 500}
                                  {...field}
                                  placeholder="Digite seu bairro"
                                />
                                <FormErrorMessage>
                                  {form.errors.bairro}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="cidade">
                            {({ field, form }: { field: any; form: any }) => (
                              <FormControl
                                mt={4}
                                isInvalid={
                                  form.errors.cidade && form.touched.cidade
                                }
                              >
                                <FormLabel>Cidade</FormLabel>
                                <Input
                                  w={mobile ? 350 : 500}
                                  {...field}
                                  placeholder="Digite sua cidade"
                                />
                                <FormErrorMessage>
                                  {form.errors.cidade}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="estado">
                            {({ field, form }: { field: any; form: any }) => (
                              <FormControl
                                mt={4}
                                isInvalid={
                                  form.errors.estado && form.touched.estado
                                }
                              >
                                <FormLabel>Estado</FormLabel>
                                <Select
                                  name={field.estado}
                                  placeholder="Selecione um estado"
                                  options={states}
                                  value={states.find(
                                    (option: any) =>
                                      option.value === values.estado
                                  )}
                                  onChange={(option: any) =>
                                    form.setFieldValue(
                                      field.estado,
                                      option.value
                                    )
                                  }
                                />
                                <FormErrorMessage>
                                  {form.errors.estado}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        </Box>
                      )}
                    </Formik>
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
