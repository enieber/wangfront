import dynamic from "next/dynamic";
import axios from 'axios';
import Layout from "../../components/Layout";

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
  try {
    const [menus] = await Promise.all([
      axios.get(`/api/categories`),
    ]);

    context.res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=59'
    );
    
    return {
      props: {
        menus: menus.data,
        user: null,
      },
    };
  } catch (error) {
    return {
      props: {
        menus: [],
        user: null,
      },
    };
  }
}
