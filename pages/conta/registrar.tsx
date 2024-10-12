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
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import InputMask from "react-input-mask";
import { useEffect, useState, useContext } from "react";
import { BsCart3, BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import * as Yup from "yup";
import { validateCNPJ, validateCPF } from "validations-br";
import axios from "axios";
import Select from "react-select";

import { getData } from '../api//states'

import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import Api from "../../services/api";

interface RegisterProps {
  user: any;
  menus: any[];
  states: any[];
}

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

function RegisterContent(props: any) {
  const { states } = props;
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [mobile] = useMediaQuery("(max-width: 400px)");

  const { activeStep, setActiveStep, goToNext, goToPrevious } = useSteps({
    index: 1,
    count: steps.length,
  });
  const toast = useToast();

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

  return (
    <Flex direction={"column"} as={"main"} w={"full"}>
      <Flex as={"section"} direction={"column"} py={4}>
        <Container maxW={"container.xl"}>
          <Stepper size={mobile ? "sm" : "md"} index={activeStep} p={10}>
            {steps.map((step, index) => (
              <Step key={index} onClick={() => setActiveStep(index + 1)}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>

                <Box flexShrink="0">
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>

                <StepSeparator />
              </Step>
            ))}
          </Stepper>
        </Container>
      </Flex>
      <Flex as={"section"} direction={"column"} py={4}>
        <Container maxW={"container.xl"}>
          <Center>
            <Heading
              as={"h2"}
              size={"lg"}
              borderBottom={"1px solid"}
              borderColor={"gray.200"}
              pb={4}
            >
              {steps[activeStep - 1].title}
            </Heading>
          </Center>
          <Formik
            initialValues={{
              nome: "",
              email: "",
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
            validationSchema={RegisterSchema}
          >
            {({ values, errors, touched }) => (
              <Center px={10}>
                <Form>
                  {activeStep === 1 && (
                    <Box>
                      <Field name="email">
                        {({ field, form }: { field: any; form: any }) => (
                          <FormControl
                            isInvalid={form.errors.email && form.touched.email}
                          >
                            <FormLabel>Email</FormLabel>
                            <Input
                              w={mobile ? "100%" : 500}
                              {...field}
                              placeholder="contato@toycity.com.br"
                            />
                            <FormErrorMessage>
                              {form.errors.email}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="password">
                        {({ field, form }: { field: any; form: any }) => (
                          <FormControl
                            mt={4}
                            isInvalid={
                              form.errors.password && form.touched.password
                            }
                          >
                            <FormLabel>Senha</FormLabel>
                            <InputGroup w={mobile ? "100%" : 500}>
                              <Input
                                key={1}
                                {...field}
                                type={show ? "text" : "password"}
                                placeholder="Insira sua senha"
                                w={mobile ? 350 : 500}
                              />
                              <InputRightElement width="4.5rem">
                                <Button
                                  h="1.75rem"
                                  size="md"
                                  onClick={() => setShow(!show)}
                                >
                                  {show ? <BsEyeSlashFill /> : <BsEyeFill />}
                                </Button>
                              </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>
                              {form.errors.password}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Box>
                  )}
                  {activeStep === 2 && (
                    <Center>
                      <Flex
                        direction={"column"}
                        justify={"center"}
                        alignItems={"center"}
                      >
                        <Field name="pessoa">
                          {({ field, form }: any) => (
                            <RadioGroup
                              adioGroup
                              {...field}
                              onChange={(newPessoa) => {
                                form.setFieldValue("pessoa", newPessoa);
                              }}
                              value={field.value}
                            >
                              <Stack direction="row" gap={10}>
                                <Radio value="fisica">Pessoa Física</Radio>
                                <Radio value="juridica">Pessoa Jurídica</Radio>
                              </Stack>
                            </RadioGroup>
                          )}
                        </Field>
                        <Field name="nome">
                          {({ field, form }: { field: any; form: any }) => (
                            <FormControl
                              isInvalid={form.errors.nome && form.touched.nome}
                            >
                              <FormLabel>Nome</FormLabel>
                              <Input
                                w={mobile ? 350 : 500}
                                {...field}
                                placeholder="joão da silva"
                              />
                              <FormErrorMessage>
                                {form.errors.nome}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Flex w={"full"} direction={"column"}>
                          <Center>
                            <Box>
                              <Field name="cpf_cnpj">
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
                                      form.errors.cpf_cnpj &&
                                      form.touched.cpf_cnpj
                                    }
                                  >
                                    {form.values.pessoa === "fisica" ? (
                                      <>
                                        <FormLabel>CPF</FormLabel>
                                        <InputMask
                                          mask="999.999.999-99"
                                          value={field.value}
                                          onChange={field.onChange}
                                          onBlur={field.onBlur}
                                        >
                                          {(inputProps: any) => (
                                            <Input
                                              w={mobile ? 350 : 500}
                                              {...field}
                                              placeholder="060.408.690-38"
                                            />
                                          )}
                                        </InputMask>
                                      </>
                                    ) : (
                                      <>
                                        <FormLabel>CNPJ</FormLabel>
                                        <InputMask
                                          mask="99.999.999/9999-99"
                                          value={field.value}
                                          onChange={field.onChange}
                                          onBlur={field.onBlur}
                                        >
                                          {(inputProps: any) => (
                                            <Input
                                              w={mobile ? 350 : 500}
                                              {...field}
                                              placeholder="50.137.591/0001-11"
                                            />
                                          )}
                                        </InputMask>
                                      </>
                                    )}
                                    <FormErrorMessage>
                                      {form.errors.cpf_cnpj}
                                    </FormErrorMessage>
                                  </FormControl>
                                )}
                              </Field>
                            </Box>
                          </Center>
                        </Flex>
                        {values.pessoa === "fisica" ? (
                          <>
                            <Flex w={"full"} direction={"column"}>
                              <Center>
                                <Box>
                                  <Field name="birthDate">
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
                                          form.errors.birthDate && form.touched.birthDate
                                        }
                                      >
                                        <FormLabel>Data Nascimento</FormLabel>
                                        <InputMask
                                          mask="99/99/9999"
                                          value={field.value}
                                          onChange={(e: any) =>
                                            form.setFieldValue("birthDate", e.target.value)
                                          }
                                          onBlur={field.onBlur}
                                        >
                                          {(inputProps: any) => (
                                            <Input
                                              {...inputProps}
                                              type="text"
                                              w={mobile ? 350 : 500}
                                              placeholder="01/06/1776"
                                            />
                                          )}
                                        </InputMask>
                                        <FormErrorMessage>
                                          {form.errors.birthDate}
                                        </FormErrorMessage>
                                      </FormControl>
                                    )}
                                  </Field>
                                </Box>
                              </Center>
                            </Flex>
                          </>
                        ) : (
                          <Flex w={"full"} direction={"column"}>
                            <Center>
                              <Box>
                                <Field name="razao_social">
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
                                        form.errors.razao_social &&
                                        form.touched.razao_social
                                      }
                                    >
                                      <FormLabel>Razão Social</FormLabel>
                                      <Input
                                        w={mobile ? 350 : 500}
                                        {...field}
                                        placeholder="Razão Social"
                                      />
                                      <FormErrorMessage>
                                        {form.errors.nome}
                                      </FormErrorMessage>
                                    </FormControl>
                                  )}
                                </Field>
                                <Field name="inscricao_estadual">
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
                                        form.errors.inscricao_estadual &&
                                        form.touched.inscricao_estadual
                                      }
                                    >
                                      <FormLabel>Inscrição Estadual</FormLabel>
                                      <Input
                                        w={mobile ? 350 : 500}
                                        {...field}
                                        placeholder="Inscrição Estadual"
                                      />
                                      <FormErrorMessage>
                                        {form.errors.inscricao_estadual}
                                      </FormErrorMessage>
                                    </FormControl>
                                  )}
                                </Field>
                              </Box>
                            </Center>
                          </Flex>
                        )}
                        <Field name="celular">
                          {({ field, form }: any) => (
                            <FormControl
                              mt={4}
                              isInvalid={
                                form.errors.celular && form.touched.celular
                              }
                            >
                              <FormLabel>Celular</FormLabel>
                              <InputMask
                                mask="(99) 99999-9999"
                                value={field.value}
                                onChange={(e: any) =>
                                  form.setFieldValue("celular", e.target.value)
                                }
                                onBlur={field.onBlur}
                              >
                                {(inputProps: any) => (
                                  <Input
                                    {...inputProps}
                                    type="text"
                                    w={mobile ? 350 : 500}
                                    placeholder="(11) 91262-4039"
                                  />
                                )}
                              </InputMask>
                              <FormErrorMessage>
                                {form.errors.celular}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="telefone">
                          {({ field, form }: { field: any; form: any }) => (
                            <FormControl
                              mt={4}
                              isInvalid={
                                form.errors.telefone && form.touched.telefone
                              }
                            >
                              <FormLabel>Telefone</FormLabel>
                              <InputMask
                                mask="(99) 9999-9999"
                                value={field.value}
                                onChange={(e: any) =>
                                  form.setFieldValue("telefone", e.target.value)
                                }
                                onBlur={field.onBlur}
                              >
                                {(inputProps: any) => (
                                  <Input
                                    {...inputProps}
                                    type="tel"
                                    placeholder="(11) 91262-4039"
                                  />
                                )}
                              </InputMask>
                              <FormErrorMessage>
                                {form.errors.telefone}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </Flex>
                    </Center>
                  )}
                  {activeStep === 3 && (
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
                                        disabled={field.value.replace("_", "").replace("-", "").length < 8}
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
                              form.errors.referencia && form.touched.referencia
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
                                (option: any) => option.value === values.estado
                              )}
                              onChange={(option: any) =>
                                form.setFieldValue(field.estado, option.value)
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
                  <Flex direction={"column"} my={10}>
                    {activeStep === 3 ? (
                      <Button
                        mt={4}
                        w={mobile ? "100%" : 500}
                        color={"white"}
                        bg={"#00a0e3"}
                        isLoading={isLoading}
                        type="submit"
                        onClick={() => {
                          register(values)
                          .then((res: any) => {
                            toast({
                              title: "Conta Criada",
                              description: "faça login e continue a usar",
                              status: "success",
                            });
                            router.push("/conta/login");
                          })
                          .catch((err: any) => {
                            toast({
                              title: "Tente novamente",
                              description: err.message,
                              status: "error",
                              duration: 9000,
                              isClosable: true,
                            });
                          });
                        }}
                        _hover={{
                          bg: "primary.600",
                        }}
                      >
                        Criar conta
                      </Button>
                    ) : (
                      <Button
                        mt={4}
                        w={mobile ? "100%" : 500}
                        color={"white"}
                        bg={"#00a0e3"}
                        onClick={goToNext}
                        _hover={{
                          bg: "primary.600",
                        }}
                      >
                        Prosseguir
                      </Button>
                    )}
                    {activeStep != 1 && (
                      <Button
                        mt={4}
                        w={mobile ? "100%" : 500}
                        onClick={goToPrevious}
                        type="button"
                      >
                        Voltar
                      </Button>
                    )}
                  </Flex>
                </Form>
              </Center>
            )}
          </Formik>
          <Center>
            <Button
              onClick={() => router.push("/conta/login")}
              mt={4}
              mb={20}
              color={"white"}
              bg={"#00a0e3"}
            >
              Entrar com minha conta.
            </Button>
          </Center>
        </Container>
      </Flex>
    </Flex>
  );
}

export default function Register({ user, menus, states }: RegisterProps) {
  return (
    <Layout menus={menus} user={user}>
      <Box w={"full"} bg={"#F5F5F5"} p={10}>
        <Box m={5}>
          <RegisterContent states={states} />
        </Box>
      </Box>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const [menus, states] = await Promise.all([
      Api.get(`${process.env.URL}/platform/get-categories`),
      getData(),
    ]);

    return {
      props: {
        menus: menus.data,
        user: null,
        states: states.data,
      },
    };
  } catch (error) {
    return {
      props: {
        menus: [],
        user: null,
        states: [],
      },
    };
  }
}
