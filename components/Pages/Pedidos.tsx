"use client";

import {
  Container,
  Flex,
  IconButton,
  Image,
  Link,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";

import { BsCart3 } from "react-icons/bs";
import { IoStarSharp } from "react-icons/io5";
import React, { useEffect, useState } from "react";
import { TbTrash } from "react-icons/tb";
import { formatMoney } from "../../helpers/money";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import axios from "axios";

export default function Pedidos() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [listOrders, setOrders] = useState([]);
  if (!user) {
    return null;
  }

  function fetchFavorite() {
    axios
    .get("/api/orders")
    .then((res) => {
      setOrders(res.data);
    })
    .catch((err) => {
      console.log("error", err);
    });
  }

  useEffect(() => {
    let mount = true
    if (mount) {
      fetchFavorite()
    }

    return () => {
      mount = false
    }
  }, [user]);

  return (
    <Flex as={"main"} direction={"column"} w={"full"} py={10}>
      <Container maxW={"container.xl"}>
        <Flex w="full">
          <Flex w={"20%"} flexDir={"column"} gap={10}>
            <Flex flexDir={"column"} gap={4}>
              <Text
                textTransform={"uppercase"}
                color={"primary.600"}
                fontWeight={"bold"}
              >
                {user.name}
              </Text>
            </Flex>
          </Flex>
          <Flex flexDir={"column"} gap={4} w={"80%"}>
            <Flex align={"center"} gap={2}>
              <IoStarSharp color="#09f" />
              <Text
                textTransform={"uppercase"}
                color={"primary.600"}
                fontWeight={"bold"}
              >
                Lista Pedidos
              </Text>
            </Flex>

            <SimpleGrid columns={1} gap={2} w={"80%"}>
              {listOrders.length == 0 && (  <Text fontSize={"sm"}>Nenhum Pedido encontrado</Text>)}
              {listOrders.map((item: any) => (
                <Flex
                  key={item.products.id}
                  flexDir={"column"}
                  gap={2}
                  w={"100%"}
                  borderBottom={"1px solid"}
                  borderBottomColor={"gray.100"}
                  pb={2}
                >
                  <Flex w={"100%"} justify={"space-between"} align={"center"}>
                    <Flex
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      gap={2}
                      w="full"
                    >
                        <Text fontSize={"sm"}>Pedido ##</Text>                      
                    </Flex>
                  </Flex>
                </Flex>
              ))}
            </SimpleGrid>
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
}
