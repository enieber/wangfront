import { Box } from "@chakra-ui/react";
import axios from 'axios';
import { getData } from "../api/states";
import dynamic from "next/dynamic";
import Layout from "../../components/Layout";

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

export async function getServerSideProps() {
  try {
    const [menus, states] = await Promise.all([
      axios.get(`/api/categories`),
      getData(),
    ]);

    return {
      props: {
        menus: menus.data,
        user: null,
        states: states.data,
      },
    };
  } catch (error) {
    return {
      props: {
        menus: [],
        user: null,
        states: [],
      },
    };
  }
}
