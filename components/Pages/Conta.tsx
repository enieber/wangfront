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
                                  Nome:
                                </Text>
                                <Field name="name">
                                {({ field }) => (
                                 <Input
                                     { ...field}
                                      value={field.value}
                                      onChange={handleChange}
                                      disabled={isNotEdit}                                      
                                      placeholder="Digite seu nome"
                                    />
                                )}
                                </Field>
                              </Container>

                              <Container>
                                <Text fontSize={"sm"} fontWeight={"600"}>
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
                              </Container>
                            </Flex>

                            <Flex
                              direction={"column"}
                              alignItems={"center"}
                              justifyContent={"center"}
                              gap={10}
                            >
                              <Container>
                                <Text fontSize={"sm"} fontWeight={"600"}>
                                  Data de nascimento:
                                </Text>
                                <Field name="birth_date">
                                  {({ field }) => (
                                    <InputMask
                                      disabled={isNotEdit}
                                      mask="99/99/9999"
                                      value={field.value}
                                      onChange={handleChange}
                                    >
                                      {(inputProps: any) => (
                                        <Input
                                          {...inputProps}
                                          type="text"
                                          placeholder="DD/MM/AAAA"
                                        />
                                      )}
                                    </InputMask>
                                  )}
                                </Field>
                              </Container>

                              <Container>
                                <Text fontSize={"sm"} fontWeight={"600"}>
                                  Email:
                                </Text>
                                <Field name="email">
                                {({ field }) => (
                                 <Input
                                 
                                     { ...field}
                                     disabled={isNotEdit}
                                      value={field.value}
                                      onChange={handleChange}
                                      placeholder="Digite seu email"
                                    />
                                )}
                                
                                </Field>
                              </Container>

                              <Container>
                                <Text fontSize={"sm"} fontWeight={"600"}>
                                  Celular:
                                </Text>
                                <Field name="phone_number">
                                  {({ field }) => (
                                    <InputMask
                                    disabled={isNotEdit}                                      
                                      mask="(99) 99999-9999"
                                      value={field.value}
                                      onChange={handleChange}
                                    >
                                      {(inputProps: any) => (
                                        <Input
                                        
                                          {...inputProps}
                                          type="text"
                                          placeholder="(XX) XXXXX-XXXX"
                                        />
                                      )}
                                    </InputMask>
                                  )}
                                </Field>
                              </Container>
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
                                enableNotEdit(isNotEdit!);
                              }}
                            >
                              {isNotEdit ? 'Editar' :  'Cancelar'}
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
                    <Text fontSize={"sm"} fontWeight={"400"}>
                      Nenhum item salvo como favorito
                    </Text>
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
