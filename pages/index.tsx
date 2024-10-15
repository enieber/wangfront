import FeatureImagesSection from "../components/FeatureImagesSection";
import ProductsSection from "../components/Products/ProductsSections";
import Carousel from "../components/UI/Carousel";
import Banner from "../components/Banner";
import Header from "../components/Header";
import Layout from "../components/Layout";
import axios from "axios";
import { builderHeader } from '../helpers/header';

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
      <Carousel full items={banners} Render={Banner} />
      <FeatureImagesSection items={featuresFooter} columns={1} />
      <ProductsSection
        products={productsWeeklyHighlight}
        title="Destaques da semana"
      />
      <FeatureImagesSection items={featuresFooter} columns={1} />
      <ProductsSection
        products={productsWeeklyHighlight}
        title="Destaques da semana"
      />
      <Header user={user} menus={menus} />
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
    const [menus, bannersRes, mostSoldRes, weeklyHighlightRes] =
      await Promise.all([
        axios.get(`${process.env.URL}/platform/get-categories`, headers),
        axios.get(`${process.env.URL}/platform/list-promotions`, headers),
        axios.get(`${process.env.URL}/platform/list-most-sold`, headers),
        axios.get(`${process.env.URL}/platform/list-weekly-product-highlight`, headers),
      ]);    
      
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
