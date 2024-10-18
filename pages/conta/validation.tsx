import dynamic from "next/dynamic";
import axios from 'axios';
import Layout from "../../components/Layout";
import { builderHeader } from "../../helpers/header";

interface HomeProps {
  user: any;
  menus: any[];
}

const ValidationPage = dynamic(() => import("../../components/Pages/Validation"), {
  ssr: false,
});

export default function LoginPage({ user, menus }: HomeProps) {
  return (
    <Layout menus={menus} user={user}>
      <ValidationPage />
    </Layout>
  );
}



export async function getServerProps(context: any) {
  let user = null;
  try {
    let headers = builderHeader(context);
    if (headers) {
      try {
        const response = await axios.get(`${process.env.URL}/platform/me`, headers)
        console.log('res', response)
        user = response.data
      } catch (err) {
        context.res.setHeader('Set-Cookie', `authToken=; HttpOnly; Path=/;`);
        headers = {}
        console.log(err)
      }
    } 
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
