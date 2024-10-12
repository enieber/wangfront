import axios from "axios";
import FeatureImagesSection from '../components/FeatureImagesSection';
import ProductsSection from '../components/Products/ProductsSections';
import Carousel from '../components/UI/Carousel';
import Banner from '../components/Banner';
import Header from '../components/Header';
import Layout from "../components/Layout";
import Api, { aboutMe } from "../services/api";

interface HomeProps {
  banners: any[];
  videoBanner: { url: string };
  features: any[];
  featuresFooter: any[];
  productsMostSold: Array<any>;
  productsWeeklyHighlight: Array<any>;
  user: any;
  menus: any[];
}

export default function Home({
  banners,
  videoBanner,
  features,
  featuresFooter,
  productsMostSold,
  productsWeeklyHighlight,
  user,
  menus,

}: HomeProps) {
  return (
    <Layout menus={menus} user={user}>
      <Carousel
          full
          items={banners}
          Render={Banner}
        />
        <FeatureImagesSection items={featuresFooter} columns={1} />
        <ProductsSection
          products={productsWeeklyHighlight}
          title="Destaques da semana" />
        <FeatureImagesSection items={featuresFooter} columns={1} />
        <ProductsSection products={productsWeeklyHighlight} title="Destaques da semana" />
      <Header user={user} menus={menus}/>      
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  let user= null;
  try {
    const [menus, bannersRes, mostSoldRes, weeklyHighlightRes] =
      await Promise.all([
        Api.get(`${process.env.URL}/platform/get-categories`),
        Api.get(`${process.env.URL}/platform/list-promotions`),
        Api.get(`${process.env.URL}/platform/list-most-sold`),
        Api.get(`${process.env.URL}/platform/list-weekly-product-highlight`),
      ]);

    try {
      const res = await aboutMe(context);
      user = res.data
    } catch (err) {
      console.log(err)
      user = null;
    }

    return {
      props: {
        banners: bannersRes.data.main,
        features: bannersRes.data.sub,
        featuresFooter: bannersRes.data.third,
        productsMostSold: mostSoldRes.data,
        productsWeeklyHighlight: weeklyHighlightRes.data,
        menus: menus.data,
        user,
      },
    };
  } catch (error) {
    return {
      props: {
        banners: [],
        features: [],
        featuresFooter: [],
        productsMostSold: [],
        productsWeeklyHighlight: [],
        menus: [],
        user,
      },
    };
  }
}
