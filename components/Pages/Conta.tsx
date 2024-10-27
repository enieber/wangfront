"use client";

import {
  Container,
  Card,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Text,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Link,
  Heading,
} from "@chakra-ui/react";
import { FaRegUserCircle, FaRegStar } from "react-icons/fa";
import { FaFileCircleCheck } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Favoritos from "./Favorito";
import AccountForm from "../AccountForm";
import Pedidos from "./Pedidos";


export default function Conta({ userServer }: any) {
  const { user, updateUser } = useAuth();
  const router = useRouter();

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
                  <AccountForm
                    user={user}
                    updateUser={updateUser}
                  />
                </TabPanel>
                <TabPanel>
                  <Flex
                    direction={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Pedidos />
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
