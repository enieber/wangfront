import axios from "axios";
import { Box, Flex } from "@chakra-ui/react";
import Layout from "../../components/Layout";
import dynamic from "next/dynamic";
import { getData } from "../api/states";
import { builderHeader } from "../../helpers/header";

const Endereco = dynamic(() => import("../../components/Pages/Endereco"), {
  ssr: false,
});

interface HomeProps {
  user: any;
  menus: any[];
  states: any[];
}

export default function Login({ user, menus, states }: HomeProps) {
  return (
    <Layout menus={menus} user={user}>
      <Box w={"full"} bg={"#F5F5F5"} p={10}>
        <Box m={5}>
          <Endereco states={states} />
        </Box>
      </Box>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  let user = null;
  try {
    const headers = builderHeader(context);
    if (headers) {
      const response = await axios.get(`${process.env.URL_LOCAL}/platform/me`, headers)
      user = response.data
    } 
    const [menus, states] = await Promise.all([
      axios.get(`${process.env.URL}/platform/get-categories`, headers),
      getData(),
    ]);

    context.res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=59'
    );
    
    return {
      props: {
        menus: menus.data,
        user,
        states: states.data,
      },
    };
  } catch (error) {
    return {
      props: {
        menus: [],
        user,
        states: [],
      },
    };
  }
}
