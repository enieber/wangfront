import axios from "axios";
import { Box, Flex } from "@chakra-ui/react";

import FeatureImagesSection from '../components/FeatureImagesSection';
import ProductsSection from '../components/Products/ProductsSections';
import Carousel from '../components/UI/Carousel';
import Banner from '../components/Banner';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface HomeProps {
  banners: any[];
  videoBanner: { url: string };
  features: any[];
  featuresFooter: any[];
  productsMostSold: Array<IProduct>;
  productsWeeklyHighlight: Array<IProduct>;
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
    <>
      <Header user={user} menus={menus}/>
      <Flex as={"main"} direction={"column"} w={"full"}>
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
        <Box w={"full"} bg={"#F5F5F5"} px={6}></Box>
      </Flex>
      <Footer categories={menus}/>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const [menus, bannersRes, mostSoldRes, weeklyHighlightRes, videoBannerRes] =
      await Promise.all([
        axios.get(`${process.env.URL}/platform/get-categories`),
        axios.get(`${process.env.URL}/platform/list-promotions`),
        axios.get(`${process.env.URL}/platform/list-most-sold`),
        axios.get(`${process.env.URL}/platform/list-weekly-product-highlight`),
      ]);

    // Implementação de cache no lado do servidor
    const headers = {
      "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
    };

    return {
      props: {
        banners: bannersRes.data.main,
        features: bannersRes.data.sub,
        featuresFooter: bannersRes.data.third,
        productsMostSold: mostSoldRes.data,
        productsWeeklyHighlight: weeklyHighlightRes.data,
        menus: menus.data,
        user: null,
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
        user: null,
      },
    };
  }
}
