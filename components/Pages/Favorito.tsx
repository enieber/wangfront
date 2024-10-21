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

export default function Favoritos() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [listProducts, setProducs] = useState([]);
  if (!user) {
    return null;
  }

  function fetchFavorite() {
    axios
    .get("/api/favorites")
    .then((res) => {
      setProducs(res.data);
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
                Lista de Favoritos
              </Text>
            </Flex>

            <Text color={"gray.500"}>
              Produtos adicionados a sua lista{" "}
              <Text as="span" color="primary.600" fontWeight={"bold"}>
                Lista de Desejos
              </Text>
            </Text>

            <SimpleGrid columns={1} gap={2} w={"80%"}>
              {listProducts.map((item: any) => (
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
                      <Flex align={"center"} gap={2}>
                        <Flex flexDir={"column"} gap={0}>
                          <Text fontSize={"xs"}>{item.products.title}</Text>                          
                          <Text fontSize={"sm"}>
                            {formatMoney(item.products.price)}
                          </Text>
                        </Flex>
                      </Flex>
                      <Flex align={"center"} gap={2}>
                        <IconButton
                          onClick={() => addToCart(product)}
                          aria-label="Adicionar ao Carrinho"
                          icon={<BsCart3 />}
                        />

                        <IconButton
                          onClick={() => {
                            axios
                              .delete(`/api/favorites?id_product=${item.products.id}`)
                              .then((res) => {
                                fetchFavorite()
                              })
                              .catch((err) => {
                                console.log(err);
                              });
                          }}
                          aria-label="Remover"
                          icon={<TbTrash />}
                        />
                      </Flex>
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
