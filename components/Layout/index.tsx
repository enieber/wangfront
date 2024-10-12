import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import { Box, Flex } from "@chakra-ui/react";
import { CartProvider } from "../../context/CartContext";
import { AuthProvider } from "../../context/AuthContext";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./theme";

export default function Layout(props: any) {
  const { menus, user, children } = props;
  return (
    <ChakraProvider theme={theme}>
    <AuthProvider>
      <CartProvider>
        <Header user={user} menus={menus} />
        <Flex as={"main"} direction={"column"} w={"full"}>
          {children}
        </Flex>
        <Footer categories={menus} />
      </CartProvider>
    </AuthProvider>
    </ChakraProvider>
  );
}
