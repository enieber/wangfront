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
      <FeatureImagesSection items={features} columns={1} />
      <ProductsSection
        products={productsWeeklyHighlight}
        title="Destaques da semana"
      />
      <FeatureImagesSection items={featuresFooter} columns={1} />
      <ProductsSection
        products={productsMostSold}
        title="Mais vendidos"
      />
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const [menus, bannersRes, mostSoldRes, weeklyHighlightRes] =
      await Promise.all([
        axios.get(`${process.env.URL}/platform/get-categories`),
        axios.get(`${process.env.URL}/platform/list-promotions`),
        axios.get(`${process.env.URL}/platform/list-most-sold`),
        axios.get(`${process.env.URL}/platform/list-weekly-product-highlight`),
      ]);
    
    return {
      props: {
        banners: bannersRes.data.main,
        features: bannersRes.data.sub,
        featuresFooter: bannersRes.data.third,
        productsMostSold: mostSoldRes.data,
        productsWeeklyHighlight: weeklyHighlightRes.data,
        menus: menus.data,
      },
      revalidate: 3600, // revalida após uma hora
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
      },
      revalidate: 3600, // revalida após uma hora
    };
  }
}
