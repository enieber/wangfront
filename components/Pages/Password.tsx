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
  FormErrorMessage,
  FormControl,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { FaRegUserCircle, FaRegStar } from "react-icons/fa";
import { FaFileCircleCheck } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";

const trocarSenhaSchema = yup.object().shape({
  old_password: yup.string().required("A senha antiga é obrigatória."),
  password: yup
    .string()
    .required("A nova senha é obrigatória.")
    .notOneOf(
      [yup.ref("old_password")],
      "A nova senha deve ser diferente da senha antiga."
    ),
  re_password: yup
    .string()
    .oneOf(
      [yup.ref("password")],
      "A confirmação da senha deve ser igual à nova senha."
    )
    .required("A confirmação da nova senha é obrigatória."),
});

export default function Conta() {
  const toast = useToast();
  const [mobile] = useMediaQuery("(max-width: 400px)");
  const { user, newPassword } = useAuth();
  const router = useRouter();
  const [isNotEdit, enableNotEdit] = useState(true);

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
                    <Formik
                      initialValues={{
                        old_password: "",
                        password: "",
                        re_password: "",
                      }}
                      onSubmit={(values) => {
                        console.log(values)
                        newPassword(values)
                          .then((res: any) => {
                            toast({
                              title: "Senha alterada com sucesso",
                              status: "success",
                              duration: 9000,
                              isClosable: true,
                            });
                            setTimeout(() => {
                              router.push("/conta");
                            }, 3000);
                          })
                          .catch((err: any) => {
                            let message = err.message
                            if (err.response) {
                              if (err.response.data.message) {
                                message = err.response.data.message
                              }
                            }
                            toast({
                              title: "Falha ao tentar alterar senha",
                              description: message,
                              status: "warning",
                              duration: 9000,
                              isClosable: true,
                            });
                          })                      
                      }}
                      validationSchema={trocarSenhaSchema}
                    >
                      {({ handleChange, handleSubmit, values }) => (
                        <Form onSubmit={handleSubmit}>
                          <Flex
                            direction={mobile ? "column" : "row"}
                            mx={4}
                            gap={10}
                            my={4}
                          >
                            <Flex
                              direction={"column"}
                              alignItems={"center"}
                              justifyContent={"flex-start"}
                              gap={10}
                            >
                              <Container>
                                <Text fontSize={"sm"} fontWeight={"600"}>
                                  Senha Antiga:
                                </Text>
                                <Field name="old_password">
                                  {({ field, form }) => (
                                    <FormControl
                                      mt={4}
                                      isInvalid={
                                        form.errors.old_password &&
                                        form.touched.old_password
                                      }
                                    >
                                      <Input
                                        {...field}
                                        type="password"
                                        value={field.value}
                                        onChange={handleChange}
                                        placeholder="Digite sua senha"
                                      />
                                      <FormErrorMessage>
                                        {form.errors.old_password}
                                        {console.log(form.errors)}
                                      </FormErrorMessage>
                                    </FormControl>
                                  )}
                                </Field>
                              </Container>
                              <Container>
                                <Text fontSize={"sm"} fontWeight={"600"}>
                                  Nova Senha:
                                </Text>
                                <Field name="password">
                                  {({ field, form }) => (
                                    <FormControl
                                      mt={4}
                                      isInvalid={
                                        form.errors.password &&
                                        form.touched.password
                                      }
                                    >
                                      <Input
                                        {...field}
                                        type="password"
                                        value={field.value}
                                        onChange={handleChange}
                                        placeholder="Digite sua senha"
                                      />
                                      <FormErrorMessage>
                                        {form.errors.password}
                                      </FormErrorMessage>
                                    </FormControl>
                                  )}
                                </Field>
                              </Container>
                              <Container>
                                <Text fontSize={"sm"} fontWeight={"600"}>
                                  Repita a Senha:
                                </Text>
                                <Field name="re_password">
                                  {({ field, form }) => (
                                    <FormControl
                                      mt={4}
                                      isInvalid={
                                        form.errors.re_password &&
                                        form.touched.re_password
                                      }
                                    >
                                      <Input
                                        {...field}
                                        type="password"
                                        value={field.value}
                                        onChange={handleChange}
                                        placeholder="Digite sua senha"
                                      />
                                      <FormErrorMessage>
                                        {form.errors.re_password}
                                      </FormErrorMessage>
                                    </FormControl>
                                  )}
                                </Field>
                              </Container>
                            </Flex>
                          </Flex>
                          <Flex gap={10}>
                            <Button type="submit" colorScheme="blue" mt={4}>
                              Salvar
                            </Button>
                          </Flex>
                        </Form>
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
