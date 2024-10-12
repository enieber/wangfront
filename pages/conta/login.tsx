import axios from "axios";
import {
  Center,
  Container,
  Flex,
  Box,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import Api from "../../services/api";

interface HomeProps {
  user: any;
  menus: any[];
}
const show = true;

function LoginContent() {
  const toast = useToast();
  const { login, isLoading, user } = useAuth();
  const router = useRouter();
  const handleGoToRegistrar = () => {
    router.push("/conta/registrar");
  };
  const handleClick = () => {
    // setShow(!show);
  };

  const handleValidateEmail = (value: string) => {
    let error;
    if (!value) {
      error = "Digite um email";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      error = "Endereço de email inválido.";
    }

    return error;
  };

  const handleValidatePassword = (value: string) => {
    let error;
    if (!value) {
      error = "Digite uma senha";
    }
    return error;
  };

  function redictAccount() {
    router.push("/conta");
  }

  function submit(values: any) {
    login(values.email, values.password)
      .then((res: any) => {
        toast({
          title: "Login feito com sucesso",
          description: "você será redirecionado para seu perfil",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        redictAccount();
      })
      .catch((err: any) => {
        toast({
          title: "Tente novamente",
          description: "Email ou senha inválidos",
          status: "warning",
          duration: 9000,
          isClosable: true,
        });
      });
  }

  useEffect(() => {
    if (user) {
      redictAccount();
    }

    return () => {};
  });

  return (
    <Box w={"full"} bg={"#F5F5F5"} p={10}>
      <Box m={5}>
        <Flex direction={"column"} as={"main"} w={"full"}>
          <Flex as={"section"} direction={"column"} w={"full"} pt={10} pb={20}>
            <Container alignItems={"center"} maxW={"container.xl"}>
              <Center>
                <Heading
                  as={"h2"}
                  size={"lg"}
                  mb={10}
                  borderBottom={"1px solid"}
                  borderColor={"gray.200"}
                  pb={4}
                >
                  Entre em sua conta
                </Heading>
              </Center>
              <Formik
                onSubmit={(values) => submit(values)}
                initialValues={{ email: "", password: "", showPassowrd: false }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <Center>
                    <Form>
                      <Field name="email" validate={handleValidateEmail}>
                        {({ field, form }: { field: any; form: any }) => (
                          <FormControl
                            isInvalid={form.errors.email && form.touched.email}
                          >
                            <FormLabel>Email</FormLabel>
                            <Input w={"100%"} {...field} placeholder="email" />
                            <FormErrorMessage>
                              {form.errors.email}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="password" validate={handleValidatePassword}>
                        {({ field, form }: { field: any; form: any }) => (
                          <FormControl
                            mt={4}
                            isInvalid={
                              form.errors.password && form.touched.password
                            }
                          >
                            <FormLabel>Senha</FormLabel>
                            <InputGroup>
                              <Input
                                key={1}
                                {...field}
                                type={values.showPassowrd ? "text" : "password"}
                                placeholder="Senha"
                                w={"100%"}
                              />
                              <InputRightElement width="4.5rem">
                                <Button
                                  h="1.75rem"
                                  size="md"
                                  onClick={() => {
                                    form.setFieldValue(
                                      "showPassowrd",
                                      !values.showPassowrd
                                    );
                                  }}
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
                      <Button
                        isLoading={isLoading}
                        mt={4}
                        w={"100%"}
                        color={"white"}
                        bg={"#00a0e3"}
                        onClick={() => submit(values)}
                        _hover={{
                          bg: "primary.600",
                        }}
                      >
                        Entrar
                      </Button>
                    </Form>
                  </Center>
                )}
              </Formik>
              <Center>
                <Button onClick={handleGoToRegistrar} mt={4}>
                  Ainda não possuo conta.
                </Button>
              </Center>
            </Container>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}

export default function LoginPage({ user, menus }: HomeProps) {
  return (
    <Layout menus={menus} user={user}>
      <LoginContent />
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const [menus] = await Promise.all([
      Api.get(`${process.env.URL}/platform/get-categories`),
    ]);

    return {
      props: {
        menus: menus.data,
        user: null,
      },
    };
  } catch (error) {
    return {
      props: {
        menus: [],
        user: null,
      },
    };
  }
}
