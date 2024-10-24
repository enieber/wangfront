import dynamic from "next/dynamic";
import axios from 'axios';
import Layout from "../../components/Layout";
import { builderHeader } from "../../helpers/header";

interface HomeProps {
  user: any;
  menus: any[];
}

const LoginContent = dynamic(() => import("../../components/Pages/Login"), {
  ssr: false,
});

export default function LoginPage({ user, menus }: HomeProps) {
  return (
    <Layout menus={menus} user={user}>
      <LoginContent />
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
