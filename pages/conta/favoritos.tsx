import axios from "axios";
import { Box, Flex } from "@chakra-ui/react";
import Layout from "../../components/Layout";
import Api, { aboutMe } from "../../services/api";

interface FavoritosProps {
  user: any;
  menus: any[];
}

export default function Favoritos({ user, menus }: FavoritosProps) {
  return (
    <Layout menus={menus} user={user}>
      <Box w={"full"} bg={"#F5F5F5"} p={10}>
        <Box m={5}>
          <h1>Favoritos</h1>
        </Box>
      </Box>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  let user = null;
  try {    
    const [menus] = await Promise.all([
      Api.get(`${process.env.URL}/platform/get-categories`),
    ]);
    try {   
      const res = await aboutMe(context);
      user = res.data;
    } catch (err) {
      console.log(err);
      user = null;
    }

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
