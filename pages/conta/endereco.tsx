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
    const [menus, states] = await Promise.all([
      axios.get(`${process.env.URL}/platform/get-categories`, headers),
      getData(),
    ]);

    return {
      props: {
        menus: menus.data,
        states: states.data,
        user,
      },
    };
  } catch (error) {
    return {
      props: {
        menus: [],
        states: [],
        user,
      },
    };
  }
}
