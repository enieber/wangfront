import axios from "axios";
import { Box, Flex } from "@chakra-ui/react";
import Layout from "../../components/Layout";
import dynamic from "next/dynamic";
import { builderHeader } from "../../helpers/header";

const Conta = dynamic(() => import("../../components/Pages/Conta"), {
  ssr: false,
});

interface HomeProps {
  user: any;
  menus: any[];
}

export default function ContaPage({ user, menus }: HomeProps) {
  return (
    <Layout menus={menus} user={user}>
      <Box w={"full"} bg={"#F5F5F5"} p={10}>
        <Box m={5}>
          <Conta />
        </Box>
      </Box>
    </Layout>
  );
}

export async function getStaticProps(context: any) {
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
