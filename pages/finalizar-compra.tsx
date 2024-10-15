import axios from "axios";
import Layout from "../components/Layout";
import {
  Box,
} from "@chakra-ui/react";
import dynamic from 'next/dynamic';

const FinalizarCompra = dynamic(() => import('../components/Pages/FinalizarCompra'), { ssr: false });

interface CarrinhoProps {
  user: any;
  menus: any[];
}

export default function FinalizarCompraPage({ user, menus }: CarrinhoProps) {
  return (
    <Layout menus={menus} user={user}>
      <Box w={"full"} bg={"#F5F5F5"} p={10}>
        <Box m={5}>
          <FinalizarCompra />
        </Box>
      </Box>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  let user = null;
  try {
    const [menus] = await Promise.all([
      axios.get(`${process.env.URL}/platform/get-categories`),
    ]);
 
    return {
      props: {
        menus: menus.data,
        user,
      },
    };
  } catch (error) {
    return {
      props: {
        menus: [],
        user,
      },
    };
  }
}
