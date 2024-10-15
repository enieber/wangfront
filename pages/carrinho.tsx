import {
  Box,
} from "@chakra-ui/react";
import Layout from "../components/Layout";

import dynamic from "next/dynamic";
import axios from "axios";
import { builderHeader } from "../helpers/header";

const CarrinhoContent = dynamic(() => import("../components/Pages/Carrinho"), {
  ssr: false,
});

interface CarrinhoProps {
  user: any;
  menus: any[];
}

export default function Carrinho({ user, menus }: CarrinhoProps) {
  return (
    <Layout menus={menus} user={user}>
      <Box w={"full"} bg={"#F5F5F5"} p={10}>
        <Box m={5}>
          <CarrinhoContent />
        </Box>
      </Box>
    </Layout>
  );
}

export async function getStaticProps() {
  try {    
    const [menus] = await Promise.all([
      axios.get(`${process.env.URL}/platform/get-categories`),
    ]);

    return {
      props: {
        menus: menus.data,
      },
    };
  } catch (error) {
    return {
      props: {
        menus: [],
      },
    };
  }
}
