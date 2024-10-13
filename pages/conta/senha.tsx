import axios from "axios";
import { Box, Flex } from "@chakra-ui/react";
import Layout from "../../components/Layout";
import Api, { aboutMe } from "../../services/api";
import dynamic from 'next/dynamic';

const Password = dynamic(() => import('../../components/Pages/Password'), { ssr: false });


interface HomeProps {
  user: any;
  menus: any[];
}

export default function Login({
  user,
  menus,
}: HomeProps) {
  return (
    <Layout menus={menus} user={user}>
      <Box w={"full"} bg={"#F5F5F5"} p={10}>
        <Box m={5}>
          <Password />
        </Box>
      </Box>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  let user = null
  try {
    const [menus] =
      await Promise.all([
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
