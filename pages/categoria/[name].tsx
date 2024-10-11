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
  useMediaQuery
} from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import FeatureImagesSection from '../../components/FeatureImagesSection';
import ProductsSection from '../../components/Products/ProductsSections';
import Carousel from '../../components/UI/Carousel';
import Banner from '../../components/Banner';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductItem from '../../components/Products/ProductItem';

interface CategoriaProps {
  categories: any[];
  products: any[];
  user: any;
}

export default function Categoria({
  categories,
  products,
  user,
}: CategoriaProps) {
  const [mobile] = useMediaQuery('(max-width: 400px)');
  const sortByPrice = 2;

  return (
    <>
      <Header user={user} menus={categories}/>
      <Flex as={'main'} direction={'column'} w={'full'} py={10}>
        <Container maxW={'container.xl'}>
        <Flex direction={mobile ? 'column' : 'row'} w="full">
          <Flex w={mobile ? '100%' : '20%'} flexDir={mobile ? 'row' : 'column'} gap={10}>
            <Flex flexDir={'column'} gap={4}>
              <Text textTransform={'uppercase'} color={'primary.600'} fontWeight={'bold'}>
                Categorias
              </Text>
              <Flex flexDir={'column'} gap={2}>
                {categories ? (
                  categories.map((item: IMenu, index: number) => (
                    <Container key={index}>
                      <Link
                        key={index}
                        href={`/categoria/${item.name.toLowerCase()}`}
                        fontSize={'sm'}
                        color={'gray.800'}
                        _hover={{ textDecoration: 'underline' }}
                      >
                        <Text>{item.name}</Text>
                      </Link>
                      {item.children &&
                        item.children.map((subItem: IMenuItem, subIndex: number) => (
                          <Link
                            key={subIndex}
                            href={`/categoria/${subItem.name.toLowerCase()}`}
                            fontSize={'sm'}
                            color={'gray.800'}
                            _hover={{ textDecoration: 'underline' }}
                          >
                            <Text>{subItem.name}</Text>
                          </Link>
                        ))}
                    </Container>
                  ))
                ) : (
                  <Skeleton height={10} width={10}></Skeleton>
                )}
              </Flex>
            </Flex>
          </Flex>
          <Flex direction={'column'}>
            <Flex alignSelf={'flex-start'}>
              <Stack align="center" direction="row">
                <Select
                  icon={sortByPrice === 1 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                  value={sortByPrice}
                  onChange={() => {}}
                  size="md"
                >
                  <option value={1}>Maior valor</option>
                  <option value={2} selected>
                    Menor valor
                  </option>
                </Select>
              </Stack>
            </Flex>
            {products.length === 0 ? (
              <SimpleGrid columns={mobile ? 1 : 3} gap={6} w={mobile ? '100%' : '80%'}>
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
              <SimpleGrid columns={mobile ? 1 : 3} gap={0} w={mobile ? '100%' : '80%'}>
                {products.slice(0, 9).map(product => (
                  <ProductItem key={product.id} {...product} />
                ))}
              </SimpleGrid>
            )}
          </Flex>
        </Flex>
      </Container>
      </Flex>
      <Footer categories={categories}/>
    </>
  );
}

export async function getServerSideProps(context: any) {
  try {
    const product_categories =context.params.name
    const [categories, products] =
      await Promise.all([
        axios.get(`${process.env.URL}/platform/get-categories`),
        axios.post(`${process.env.URL}/platform/list-products`, { product_categories }),
      ]);
  
    return {
      props: {
        categories: categories.data,
        products: products.data,
        user: null,
      },
    };
  } catch (error) {
    console.log(error)
    return {
      props: {
        categories: [],
        products: [],
        use: null
      },
    };
  }
}
