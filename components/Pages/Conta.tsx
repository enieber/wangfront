"use client";

import {
  CircularProgress,
  Container,
  Card,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Highlight,
  Text,
  Button,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Link,
  useMediaQuery,
  Input,
  Heading,
  RadioGroup,
  Stack,
  Radio,
  FormLabel,
  Center,
  Box,
  FormControl,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { FaRegUserCircle, FaRegStar } from "react-icons/fa";
import { FaFileCircleCheck } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import InputMask from "react-input-mask";
import Favoritos from "./Favorito";
import * as Yup from "yup";
import { validateCNPJ, validateCPF } from "validations-br";

enum Pessoa {
  fisica = "Fisica",
  juridica = "Juridica",
}

const AcccountSchema = Yup.object({
  name: Yup.string()
    .min(2, "Seu nome é muito curto")
    .max(70, "Seu nome é muito longo")
    .required("Digite um nome"),
  birth_date: Yup.string().required(),
  pessoa: Yup.string().required("Selecione o tipo de pessoa"),
  phone_number: Yup.string().required("Digite um celular"),
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

export default function Conta({ userServer }: any) {
  const toast = useToast();
  const [mobile] = useMediaQuery("(max-width: 400px)");
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [isNotEdit, enableNotEdit] = useState(true);

  if (!user) {
    return null;
  }

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
          <Heading size="md">{user.name ? user.name : ""}</Heading>
          <Link href="/conta">Minha Conta</Link>
          <Link href="/conta/endereco">Meu Endereço</Link>
          <Link href="/conta/senha">Alterar Senha</Link>
        </Card>
        <Card>
          <Tabs variant="soft-rounded">
            <Flex as={"section"} direction={"column"} py={4}>
              <Container maxW={"container.xl"}>
                <TabList>
                  <Tab gap={2}>
                    <FaRegUserCircle />
                    Conta
                  </Tab>
                  <Tab gap={2}>
                    <FaFileCircleCheck />
                    Pedidos
                  </Tab>
                  <Tab gap={2}>
                    <FaRegStar />
                    Favoritos
                  </Tab>
                </TabList>
              </Container>
            </Flex>
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
                        name: user.name,
                        gender: user.gender,
                        birth_date: user.birth_date,
                        email: user.email,
                        phone_number: user.phone_number,
                        pessoa: user.pessoa,
                        cpf_cnpj: user.cpf_cnpj,
                      }}
                      onSubmit={(values) => {
                        updateUser(values)
                        .then((res: any) => {
                          toast({
                            title: "Dados Alterados com sucesso",
                            status: "success",
                            duration: 9000,
                            isClosable: true,
                          });
                        })
                        .catch((err: any) => {
                          let message = err.message
                          if (err.response) {
                            if (err.response.data.message) {
                              message = err.response.data.message
                            }
                          }
                          toast({
                            title: "Falha ao alterar dados",
                            description: message,
                            status: "warning",
                            duration: 9000,
                            isClosable: true,
                          });
                        })   
                      }}
                      validationSchema={AcccountSchema}
                    >
                      {({ handleChange, handleSubmit, values }) => (
                        <Form onSubmit={handleSubmit}>
                          <Flex direction="column" gap={10}>
                            <Flex w={"full"} direction={"column"}>
                              <Text fontSize={"sm"} fontWeight={"600"}>
                                Nome:
                              </Text>
                              <Field name="name">
                                {({ field, form }) => (
                                  <FormControl
                                    mt={4}
                                    isInvalid={
                                      form.errors.name && form.touched.name
                                    }
                                  >
                                    <Input
                                      {...field}
                                      value={field.value}
                                      onChange={handleChange}
                                      disabled={isNotEdit}
                                      placeholder="Digite seu nome"
                                    />
                                    <FormErrorMessage>
                                      {form.errors.phone_number}
                                    </FormErrorMessage>
                                  </FormControl>
                                )}
                              </Field>
                            </Flex>

                            <Flex w={"full"} direction={"column"}>
                              <Text fontSize={"sm"} fontWeight={"600"}>
                                Email:
                              </Text>
                              <Field name="email">
                                {({ field }) => (
                                  <Input
                                    {...field}
                                    disabled={true}
                                    value={field.value}
                                    onChange={handleChange}
                                    placeholder="Digite seu email"
                                  />
                                )}
                              </Field>
                            </Flex>
                            <Flex w={"full"} direction={"column"}>
                              <Text fontSize={"sm"} fontWeight={"600"}>
                                Celular:
                              </Text>
                              <Field name="phone_number">
                                {({ field, form }) => (
                                  <FormControl
                                    mt={4}
                                    isInvalid={
                                      form.errors.phone_number &&
                                      form.touched.phone_number
                                    }
                                  >
                                    <InputMask
                                      disabled={isNotEdit}
                                      mask="(99) 99999-9999"
                                      value={field.value}
                                      onChange={(e: any) =>
                                        form.setFieldValue("phone_number", e.target.value)
                                      }
                                    >
                                      {(inputProps: any) => (
                                        <Input
                                          {...inputProps}
                                          disabled={isNotEdit}
                                          type="text"
                                          placeholder="(XX) XXXXX-XXXX"
                                        />
                                      )}
                                    </InputMask>

                                    <FormErrorMessage>
                                      {form.errors.phone_number}
                                    </FormErrorMessage>
                                  </FormControl>
                                )}
                              </Field>
                            </Flex>
                            <Flex w={"full"} direction={"column"}>
                              <Field name="pessoa">
                                {({ field, form }: any) => (
                                  <RadioGroup
                                    adioGroup
                                    {...field}
                                    onChange={(newPessoa) => {
                                      form.setFieldValue("pessoa", newPessoa);
                                    }}
                                    value={field.value}
                                    isDisabled={isNotEdit}
                                  >
                                    <Stack direction="row" gap={10}>
                                      <Radio value="fisica">
                                        Pessoa Física
                                      </Radio>
                                      <Radio value="juridica">
                                        Pessoa Jurídica
                                      </Radio>
                                    </Stack>
                                  </RadioGroup>
                                )}
                              </Field>
                            </Flex>
                            <Flex w={"full"} direction={"column"}>
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
                                          disabled={isNotEdit}
                                        >
                                          {(inputProps: any) => (
                                            <Input
                                              {...field}
                                              {...inputProps}
                                              disabled={isNotEdit}
                                              w={mobile ? 350 : 500}
                                              placeholder="000.000.000-00"
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
                                          disabled={isNotEdit}
                                        >
                                          {(inputProps: any) => (
                                            <Input
                                              {...field}
                                              w={mobile ? 350 : 500}
                                              disabled={isNotEdit}
                                              placeholder="00.000.000/0000-00"
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

                              <>
                                <Flex w={"full"} direction={"column"}>
                                  <Text
                                    fontSize={"sm"}
                                    fontWeight={"600"}
                                    py={5}
                                  >
                                    Sexo:
                                  </Text>
                                  <Field
                                    as="select"
                                    name="gender"
                                    disabled={isNotEdit}
                                    value={values.gender}
                                    onChange={handleChange}
                                  >
                                    <option value="">Selecione o sexo</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                  </Field>
                                </Flex>
                                <Flex w={"full"} direction={"column"}>
                                  <Field name="birth_date">
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
                                          form.errors.birth_date &&
                                          form.touched.birth_date
                                        }
                                      >
                                        <FormLabel>Data Nascimento</FormLabel>
                                        <InputMask
                                          mask="99/99/9999"
                                          value={field.value}
                                          onChange={(e: any) =>
                                            form.setFieldValue(
                                              "birth_date",
                                              e.target.value
                                            )
                                          }
                                          onBlur={field.onBlur}
                                          disabled={isNotEdit}
                                        >
                                          {(inputProps: any) => (
                                            <Input
                                              {...inputProps}
                                              type="text"
                                              disabled={isNotEdit}
                                              w={mobile ? 350 : 500}
                                              placeholder="00/00/0000"
                                            />
                                          )}
                                        </InputMask>
                                        <FormErrorMessage>
                                          {form.errors.birth_date}
                                        </FormErrorMessage>
                                      </FormControl>
                                    )}
                                  </Field>
                                </Flex>
                              </>
                            </Flex>
                          </Flex>
                          <Flex gap={10}>
                            <Button type="submit" colorScheme="blue" mt={4}>
                              Salvar
                            </Button>
                            <Button
                              type="submit"
                              colorScheme="blue"
                              mt={4}
                              onClick={() => {
                                isNotEdit
                                  ? enableNotEdit(false)
                                  : enableNotEdit(true);
                              }}
                            >
                              {isNotEdit ? "Editar" : "Cancelar"}
                            </Button>
                          </Flex>
                        </Form>
                      )}
                    </Formik>
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex
                    direction={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Text fontSize={"sm"} fontWeight={"400"}>
                      Nenhum pedido encontrado
                    </Text>
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex
                    direction={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Favoritos />
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
