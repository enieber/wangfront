import { Box } from "@chakra-ui/react";
import axios from 'axios';
import { getData } from "../api/states";
import dynamic from "next/dynamic";
import Layout from "../../components/Layout";
import { builderHeader } from "../../helpers/header";

interface RegisterProps {
  user: any;
  menus: any[];
  states: any[];
}

const RegisterContent = dynamic(
  () => import("../../components/Pages/Register"),
  { ssr: false }
);

export default function Register({ user, menus, states }: RegisterProps) {
  return (
    <Layout menus={menus} user={user}>
      <Box w={"full"} bg={"#F5F5F5"} p={10}>
        <Box m={5}>
          <RegisterContent states={states} />
        </Box>
      </Box>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  let user = null;
  try {
    let headers = builderHeader(context); 
    const [menus] = await Promise.all([
      axios.get(`${process.env.URL}/platform/get-categories`, headers),
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