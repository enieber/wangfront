"use client";

import {
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Text,
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
  HStack,
  CardBody,
  Highlight,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
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

const Schema = Yup.object({
  street: Yup.string()
    .min(2, "Seu enderçeo é inválido")
    .max(50, "Seu enderçeo é inválido")
    .required("Digite um endereço"),
  zipCode: Yup.string()
    .min(8, "Seu CEP é inválido")
    .max(9, "seu CEP é inválido")
    .required("Digite um CEP"),
  number: Yup.number()
    .positive("Seu número precisa ser positivo")
    .integer("Seu número precisa ser válido")
    .required("Digite um número"),
  additionalInfo: Yup.string(),
  city: Yup.string().required("Cidade obrigatoria"),
  country: Yup.string().required("Pais obrigatoria"),
  neighborhood: Yup.string().required("Bairro obrigatorio"),
  state: Yup.string().required("Selecione um estado"),
  isMain: Yup.boolean(),
});

export default function Endereco() {
  const [mobile] = useMediaQuery("(max-width: 400px)");
  const { user } = useAuth();
  const [addressList, setAddressList] = useState([]);
  const [states, setStates] = useState([]);
  const [isAdding, changeAdding] = useState(false);

  async function searchAddressInfo(cep: any, setField: any) {
    try {
      const res = await axios.get("/api/cep", {
        params: { cep },
      });
      const address = res.data;
      console.log(address);
      setField("street", address.street);
      setField("neighborhood", address.neighborhood);
      setField("city", address.city);
      const state: any = states.find(
        (item: any) => item.value === address.state
      );
      setField("state", state.value);
    } catch (err) {
      console.log(err);
      setField("street", "");
      setField("neighborhood", "");
      setField("city", "");
    }
  }

  function fetchAddress() {
    if (user) {
      axios
        .get("/api/address", {
          params: {
            user_id: user.id,
          },
        })
        .then((res) => {
          const adapterAddress = res.data.map((item) => {
            return {
              ...item.addresses,
              id: item.id,
            };
          });
          setAddressList(adapterAddress);
        })
        .catch((err) => {
          console.log("error", err);
        });
    }
  }

  async function loadStates() {
    axios
      .get("/api/states")
      .then((res) => {
        setStates(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        setStates([]);
      });
  }

  useEffect(() => {
    let mount = true;
    if (mount) {
      fetchAddress();
      loadStates();
    }

    return () => {
      mount = false;
    };
  }, [user]);

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
                  {isAdding && (
                    <Flex align={"center"} gap={5} direction={"column"}>
                      <Text
                        textTransform={"uppercase"}
                        color={"primary.600"}
                        fontWeight={"bold"}
                      >
                        Novo Endereço
                      </Text>
                      <Formik
                        initialValues={{
                          street: "",
                          zipCode: "",
                          number: "",
                          additionalInfo: "",
                          city: "",
                          neighborhood: "",
                          state: "",
                          country: "Brasil",
                          isMain: true,
                        }}
                        validationSchema={Schema}
                        onSubmit={(values) => {
                          const parseToSend = {
                            ...values,
                            number: parseInt(values.number),
                          };
                          axios
                            .post("/api/address", parseToSend)
                            .then((res) => {
                              console.log(res);
                              changeAdding(false);
                              fetchAddress();
                            })
                            .catch((err: any) => {
                              console.log(err);
                            });
                        }}
                      >
                        {({ values, errors, touched }) => (
                          <Center px={10}>
                            <Form>
                              <Box>
                                <Field name="zipCode">
                                  {({
                                    field,
                                    form,
                                  }: {
                                    field: any;
                                    form: any;
                                  }) => (
                                    <FormControl
                                      mt={4}
                                      isInvalid={
                                        form.errors.zipCode &&
                                        form.touched.zipCode
                                      }
                                    >
                                      <FormLabel>CEP</FormLabel>
                                      <InputGroup size="md">
                                        <Input
                                          w={mobile ? 350 : 500}
                                          {...field}
                                          placeholder="99999-999"
                                        />
                                        {field.value.length >= 1 && (
                                          <InputRightElement width="4.5rem">
                                            <Button
                                              size="md"
                                              disabled={
                                                field.value.length !== 8
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
                                      <FormErrorMessage>
                                        {form.errors.zipCode}
                                      </FormErrorMessage>
                                    </FormControl>
                                  )}
                                </Field>
                                <Field name="number">
                                  {({
                                    field,
                                    form,
                                  }: {
                                    field: any;
                                    form: any;
                                  }) => (
                                    <FormControl
                                      mt={4}
                                      isInvalid={
                                        form.errors.number &&
                                        form.touched.number
                                      }
                                    >
                                      <FormLabel>Número</FormLabel>
                                      <Input
                                        w={mobile ? 350 : 500}
                                        {...field}
                                        placeholder="Digite seu número"
                                      />
                                      <FormErrorMessage>
                                        {form.errors.number}
                                      </FormErrorMessage>
                                    </FormControl>
                                  )}
                                </Field>
                                <Field name="street">
                                  {({
                                    field,
                                    form,
                                  }: {
                                    field: any;
                                    form: any;
                                  }) => (
                                    <FormControl
                                      mt={4}
                                      isInvalid={
                                        form.errors.street &&
                                        form.touched.street
                                      }
                                    >
                                      <FormLabel>Endereço</FormLabel>
                                      <Input
                                        w={mobile ? 350 : 500}
                                        {...field}
                                        placeholder="Digite seu endereço"
                                      />
                                      <FormErrorMessage>
                                        {form.errors.street}
                                      </FormErrorMessage>
                                    </FormControl>
                                  )}
                                </Field>
                                <Field name="additionalInfo">
                                  {({
                                    field,
                                    form,
                                  }: {
                                    field: any;
                                    form: any;
                                  }) => (
                                    <FormControl
                                      mt={4}
                                      isInvalid={
                                        form.errors.additionalInfo &&
                                        form.touched.additionalInfo
                                      }
                                    >
                                      <FormLabel>Complemento</FormLabel>
                                      <Input
                                        w={mobile ? 350 : 500}
                                        {...field}
                                        placeholder="Digite seu Complemento"
                                      />
                                      <FormErrorMessage>
                                        {form.errors.additionalInfo}
                                      </FormErrorMessage>
                                    </FormControl>
                                  )}
                                </Field>
                                <Field name="neighborhood">
                                  {({
                                    field,
                                    form,
                                  }: {
                                    field: any;
                                    form: any;
                                  }) => (
                                    <FormControl
                                      mt={4}
                                      isInvalid={
                                        form.errors.neighborhood &&
                                        form.touched.neighborhood
                                      }
                                    >
                                      <FormLabel>Bairo</FormLabel>
                                      <Input
                                        w={mobile ? 350 : 500}
                                        {...field}
                                        placeholder="Digite seu Bairo"
                                      />
                                      <FormErrorMessage>
                                        {form.errors.neighborhood}
                                      </FormErrorMessage>
                                    </FormControl>
                                  )}
                                </Field>
                                <Field name="city">
                                  {({
                                    field,
                                    form,
                                  }: {
                                    field: any;
                                    form: any;
                                  }) => (
                                    <FormControl
                                      mt={4}
                                      isInvalid={
                                        form.errors.city && form.touched.city
                                      }
                                    >
                                      <FormLabel>Cidade</FormLabel>
                                      <Input
                                        w={mobile ? 350 : 500}
                                        {...field}
                                        placeholder="Digite sua cidade"
                                      />
                                      <FormErrorMessage>
                                        {form.errors.city}
                                      </FormErrorMessage>
                                    </FormControl>
                                  )}
                                </Field>
                                <Field name="state">
                                  {({
                                    field,
                                    form,
                                  }: {
                                    field: any;
                                    form: any;
                                  }) => (
                                    <FormControl
                                      mt={4}
                                      isInvalid={
                                        form.errors.state && form.touched.state
                                      }
                                    >
                                      <FormLabel>state</FormLabel>
                                      <Select
                                        name={field.state}
                                        placeholder="Selecione um state"
                                        options={states}
                                        value={states.find(
                                          (option: any) =>
                                            option.value === values.state
                                        )}
                                        onChange={(option: any) =>
                                          form.setFieldValue(
                                            field.state,
                                            option.value
                                          )
                                        }
                                      />
                                      <FormErrorMessage>
                                        {form.errors.state}
                                      </FormErrorMessage>
                                    </FormControl>
                                  )}
                                </Field>
                                <Field name="country">
                                  {({
                                    field,
                                    form,
                                  }: {
                                    field: any;
                                    form: any;
                                  }) => (
                                    <FormControl
                                      mt={4}
                                      isInvalid={
                                        form.errors.country &&
                                        form.touched.country
                                      }
                                    >
                                      <FormLabel>País</FormLabel>
                                      <Input
                                        w={mobile ? 350 : 500}
                                        {...field}
                                        placeholder="Digite sua país"
                                        disabled
                                      />
                                      <FormErrorMessage>
                                        {form.errors.country}
                                      </FormErrorMessage>
                                    </FormControl>
                                  )}
                                </Field>
                                <Field name="isMain">
                                  {({
                                    field,
                                    form,
                                  }: {
                                    field: any;
                                    form: any;
                                  }) => (
                                    <FormControl
                                      mt={4}
                                      isInvalid={
                                        form.errors.isMain &&
                                        form.touched.isMain
                                      }
                                    >
                                      <FormLabel>Endereço Principal</FormLabel>
                                      <RadioGroup
                                        defaultValue={values.isMain.toString()}
                                        onChange={(value) => {
                                          if (value === "true") {
                                            form.setFieldValue("isMain", true);
                                          } else {
                                            form.setFieldValue("isMain", false);
                                          }
                                        }}
                                      >
                                        <HStack gap="6">
                                          <Radio value={"true"}>Sim</Radio>
                                          <Radio value={"false"}>Não</Radio>
                                        </HStack>
                                      </RadioGroup>

                                      <FormErrorMessage>
                                        {form.errors.isMain}
                                      </FormErrorMessage>
                                    </FormControl>
                                  )}
                                </Field>
                                <Flex
                                  align={"center"}
                                  m={10}
                                  direction={"column"}
                                >
                                  <Button
                                    color={"white"}
                                    bg={"#00a0e3"}
                                    type="submit"
                                  >
                                    Salvar
                                  </Button>
                                </Flex>
                              </Box>
                            </Form>
                          </Center>
                        )}
                      </Formik>
                    </Flex>
                  )}
                  <Flex direction={"column"} mx={4} gap={10} my={4}>
                    <Flex
                      justify={"center"}
                      align={"start"}
                      direction={"column"}
                      gap={2}
                    >
                      <Text
                        textTransform={"uppercase"}
                        color={"primary.600"}
                        fontWeight={"bold"}
                      >
                        Lista de Endereços
                      </Text>
                      <Button
                        onClick={() => {
                          if (isAdding) {
                            changeAdding(false);
                          } else {
                            changeAdding(true);
                          }
                        }}
                      >
                        {isAdding ? "Cancelar" : "Novo Enderço"}
                      </Button>
                    </Flex>
                    <SimpleGrid columns={2} gap={5}>
                      {addressList.map((address: any) => (
                        <Card gap={5} p={10} key={address.id}>
                          <Highlight
                            query="spotlight"
                            styles={{ px: "1", py: "1", bg: "orange.100" }}
                          >
                            {`${address.street} - Nº: ${address.number}`}
                          </Highlight>
                          <Text>{`Bairro: ${address.neighborhood}`}</Text>
                          <Text>{`${address.city} - ${address.state}`}</Text>
                          <Button
                            onClick={() => {
                              axios
                                .delete("/api/address", {
                                  params: { address_id: address.id },
                                })
                                .then(() => {
                                  fetchAddress();
                                })
                                .catch((err: any) => {
                                  console.log(err);
                                });
                            }}
                          >
                            Remover
                          </Button>
                        </Card>
                      ))}
                    </SimpleGrid>
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
