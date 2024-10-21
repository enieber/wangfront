import Layout from "../components/Layout";
import dynamic from "next/dynamic";
import axios from "axios";
import { builderHeader } from "../helpers/header";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Container, Flex, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import ProductItem from "../components/Products/ProductItem";

const ProductContent = dynamic(() => import("../components/Pages/Product"), {
  ssr: false,
});

export default function ProductSearchPage({ user, categories }: any) {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const {
          productName,
          categories,
          brand,
          sortBy,
          sortOrder,
          page,
          pageSize,
        } = router.query;
        const response = await axios.post("/api/search", {
          productName,
          categories,
          brand,
          sortBy,
          sortOrder,
          page: page || 1,
          pageSize: pageSize || 10,
        });

        setProducts(response.data);
      } catch (error) {
        console.log("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      fetchProducts();
    }
  }, [router.query]);

  console.log(products);

  if (loading) {
    return (
      <Layout user={user} menus={categories}>
        <Box textAlign="center" mt="50px">
          <Spinner size="xl" />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout user={user} menus={categories}>
      
      <Flex as={"main"} direction={"column"} w={"full"} p={10}>
      <Container maxW={"container.xl"}>
                <Text
                  textTransform={"uppercase"}
                  color={"primary.600"}
                  fontWeight={"bold"}
                >
                  Busca de produtos
                </Text>
       <Flex direction={"column"} gap={4} >
      <SimpleGrid columns={3} gap={10} w={"100%"}>
        {products.map((product: any) => (
          <ProductItem key={product.id} {...product} />
        ))}
      </SimpleGrid>
      </Flex>

      </Container>
    </Flex>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  let user = null;
  try {
    const headers = builderHeader(context);
    if (headers) {
      try {
        const response = await axios.get(
          `${process.env.URL}/platform/me`,
          headers
        );
        user = response.data;
      } catch (err) {
        context.res.setHeader("Set-Cookie", `authToken=; HttpOnly; Path=/;`);
        console.log(err);
      }
    }
    const categoriesResponse = await axios.get(
      `${process.env.URL}/platform/get-categories`,
      headers
    );

    return {
      props: {
        categories: categoriesResponse.data,
        user,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        categories: [],
        user: null,
      },
    };
  }
}
