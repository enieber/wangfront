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
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { FaRegUserCircle, FaRegStar } from "react-icons/fa";
import { FaFileCircleCheck } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import InputMask from "react-input-mask";
import Favoritos from "./Favorito";

export default function Conta() {
  const [mobile] = useMediaQuery("(max-width: 400px)");
  const { user } = useAuth();
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
          <Highlight
            query="spotlight"
            styles={{ px: "1", py: "1", bg: "orange.100" }}
          >
            {user?.name ? user.name : ""}
          </Highlight>
          <Button>
            <Link href="/conta">Minha Conta</Link>
          </Button>
          <Button>
            <Link href="/conta/senha">Alterar Senha</Link>
          </Button>
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
                        name: user?.name || "",
                        gender: user?.gender || "",
                        birth_date: user?.birth_date || "",
                        email: user?.email || "",
                        phone_number: user?.phone_number || "",
                      }}
                      onSubmit={(values) => {
                        console.log(values);
                      }}
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
                                  Senha:
                                </Text>
                                <Field name="password">
                                  {({ field }) => (
                                    <Input
                                      {...field}
                                      type="password"
                                      value={field.value}
                                      onChange={handleChange}
                                      placeholder="Digite sua senha"
                                    />
                                  )}
                                </Field>
                              </Container>
                              <Container>
                                <Text fontSize={"sm"} fontWeight={"600"}>
                                  Repita a Senha:
                                </Text>
                                <Field name="re_password">
                                  {({ field }) => (
                                    <Input
                                      {...field}
                                      type="password"
                                      value={field.value}
                                      onChange={handleChange}
                                      placeholder="Digite sua senha"
                                    />
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
