import axios from "axios";
import { Box, Flex } from "@chakra-ui/react";
import Layout from "../../components/Layout";
import dynamic from "next/dynamic";
import { builderHeader } from "../../helpers/header";

const Favoritos = dynamic(() => import("../../components/Pages/Favorito"), {
  ssr: false,
});

interface FavoritosProps {
  user: any;
  menus: any[];
}

export default function FavoritoPage({ user, menus }: FavoritosProps) {
  return (
    <Layout menus={menus} user={user}>
      <Box w={"full"} bg={"#F5F5F5"} p={10}>
        <Box m={5}>
          <Favoritos />
        </Box>
      </Box>
    </Layout>
  );
}

export async function getStaticProps(context: any) {
  let user = null;
  try {
    let headers = builderHeader(context);
    if (headers) {
      try {
        const response = await axios.get(`${process.env.URL}/platform/me`, headers)
        user = response.data
      } catch (err) {
        context.res.setHeader('Set-Cookie', `authToken=; HttpOnly; Path=/;`);
        headers = {}
        console.log(err)
      }
    } 
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
