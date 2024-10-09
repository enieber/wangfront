import axios from "axios";
import { Box, Flex } from "@chakra-ui/react";

import FeatureImagesSection from '../components/FeatureImagesSection';
import ProductsSection from '../components/Products/ProductsSections';
import Carousel from '../components/UI/Carousel';
import Banner from '../components/Banner';

interface HomeProps {
  banners: any[];
  videoBanner: { url: string };
  features: any[];
  featuresFooter: any[];
  productsMostSold: Array<IProduct>;
  productsWeeklyHighlight: Array<IProduct>;
}

export default function Home({
  banners,
  videoBanner,
  features,
  featuresFooter,
  productsMostSold,
  productsWeeklyHighlight,
}: HomeProps) {
  console.log(banners)
  return (
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
  );
}

export async function getServerSideProps() {
  try {
    const [bannersRes, mostSoldRes, weeklyHighlightRes, videoBannerRes] =
      await Promise.all([
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
      },
    };
  }
}
