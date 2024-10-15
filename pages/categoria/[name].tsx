import axios from "axios";
import {
  Container,
  Flex,
  Link,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";

import ProductItem from "../../components/Products/ProductItem";
import Layout from "../../components/Layout";
import { builderHeader } from "../../helpers/header";

interface CategoriaProps {
  categories: any[];
  products: any[];
  user: any;
  sort: string,
}

export default function Categoria({
  categories,
  products,
  user,
  sort,
}: CategoriaProps) {
  const [mobile] = useMediaQuery("(max-width: 400px)");
  const sortByPrice = 2;
  
  return (
    <Layout user={user} menus={categories}>
      <Flex as={"main"} direction={"column"} w={"full"} py={10}>
        <Container maxW={"container.xl"}>
          <Flex direction={mobile ? "column" : "row"} w="full">
            <Flex
              w={mobile ? "100%" : "20%"}
              flexDir={mobile ? "row" : "column"}
              gap={10}
            >
              <Flex flexDir={"column"} gap={4}>
                <Text
                  textTransform={"uppercase"}
                  color={"primary.600"}
                  fontWeight={"bold"}
                >
                  Categorias
                </Text>
                <Flex flexDir={"column"} gap={2}>
                  {categories ? (
                    categories.map((item: any, index: number) => (
                      <Container key={index}>
                        <Link
                          key={index}
                          href={`/categoria/${item.name.toLowerCase()}`}
                          fontSize={"sm"}
                          color={"gray.800"}
                          _hover={{ textDecoration: "underline" }}
                        >
                          <Text>{item.name}</Text>
                        </Link>
                        {item.children &&
                          item.children.map(
                            (subItem: any, subIndex: number) => (
                              <Link
                                key={subIndex}
                                href={`/categoria/${subItem.name.toLowerCase()}`}
                                fontSize={"sm"}
                                color={"gray.800"}
                                _hover={{ textDecoration: "underline" }}
                              >
                                <Text>{subItem.name}</Text>
                              </Link>
                            )
                          )}
                      </Container>
                    ))
                  ) : (
                    <Skeleton height={10} width={10}></Skeleton>
                  )}
                </Flex>
              </Flex>
            </Flex>
            <Flex direction={"column"}>
              <Flex alignSelf={"flex-start"}>
                <Stack align="center" direction="row">
                  <Select
                    icon={
                      sort === 'up' ? <ArrowUpIcon /> : <ArrowDownIcon />
                    }
                    value={sort}
                    onChange={() => {}}
                    size="md"
                  >
                    <option value={1}>Maior valor</option>
                    <option value={2}>
                      Menor valor
                    </option>
                  </Select>
                </Stack>
              </Flex>
              {products.length === 0 ? (
                <SimpleGrid
                  columns={mobile ? 1 : 3}
                  gap={6}
                  w={mobile ? "100%" : "80%"}
                >
                  <Skeleton height={100} width={200}></Skeleton>
                  <Skeleton height={100} width={200}></Skeleton>
                  <Skeleton height={100} width={200}></Skeleton>
                  <Skeleton height={100} width={200}></Skeleton>
                  <Skeleton height={100} width={200}></Skeleton>
                  <Skeleton height={100} width={200}></Skeleton>
                  <Skeleton height={100} width={200}></Skeleton>
                  <Skeleton height={100} width={200}></Skeleton>
                  <Skeleton height={100} width={200}></Skeleton>
                </SimpleGrid>
              ) : (
                <SimpleGrid
                  columns={mobile ? 1 : 3}
                  gap={0}
                  w={mobile ? "100%" : "80%"}
                >
                  {products.slice(0, 9).map((product) => (
                    <ProductItem key={product.id} {...product} />
                  ))}
                </SimpleGrid>
              )}
            </Flex>
          </Flex>
        </Container>
      </Flex>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  let user = null;
  try {
    const product_categories = context.params.name;
    const sort = context.query.sort;
    const headers = builderHeader(context);
    if (headers) {
      const response = await axios.get(`${process.env.URL_LOCAL}/platform/me`, headers)
      user = response.data
    } 
    const [categories, productsRes] = await Promise.all([
      axios.get(`${process.env.URL}/platform/get-categories`, headers),
      axios.post(`${process.env.URL}/platform/list-products`, {
        product_categories,
      }, headers),
    ]);

    const products = productsRes.data.sort((a:any, b: any) => {
      if (sort === 'up') {
        if (parseFloat(a.price) < parseFloat(b.price)) {
          return 1;
        }
        
        if (parseFloat(a.price) > parseFloat(b.price)) {
          return -1
        }
        return 0
      }
      if (parseFloat(a.price) > parseFloat(b.price)) {
        return 1;
      }
      
      if (parseFloat(a.price) < parseFloat(b.price)) {
        return -1
      }
      return 0
    })
  
    context.res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=59'
    );

    return {
      props: {
        categories: categories.data,
        products,
        sort,
        user,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        sort:'up',
        categories: [],
        products: [],
        user,
      },
    };
  }
}
