import axios from "axios";
import {
  Alert,
  AlertIcon,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  Heading,
  Image,
  Text,
  Textarea,
  useMediaQuery,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { Zoom } from "reactjs-image-zoom";
import Carousel from "../../components/UI/Carousel";
import Layout from "../../components/Layout";
import ProductsSection from "../../components/Products/ProductsSections";
import { formatMoney } from "../../helpers/money";
import ReviewStars from "../../components/UI/ReviewStart";
import QuickCart from "../../components/Cart/QuickCart";
import ReviewCard from "../../components/ReviewCard";
import Api, { aboutMe } from "../../services/api";

interface CategoriaProps {
  categories: any[];
  products: any[];
  product: any;
  user: any;
}

export default function Categoria({
  categories,
  products,
  product,
  user,
}: CategoriaProps) {
  const [mobile] = useMediaQuery("(max-width: 400px)");
  const sortByPrice = 2;
  const currentTumbnailUrl = null;

  const total = parseFloat(product?.price) + parseFloat(product.discount);

  return (
    <Layout user={user} menus={categories}>
      <Flex as={"main"} direction={"column"} w={"full"} py={10}>
        <Container maxW={"container.xl"}>
          <Flex direction={mobile ? "column" : "row"} w="full" gap={20}>
            <Flex w={mobile ? "100%" : "50%"} flexDir={"column"} gap={10}>
              {currentTumbnailUrl && (
                <Zoom
                  imagesrc={currentTumbnailUrl}
                  maxwidth={1000}
                  height={500}
                  size={150}
                  cursor="zoom-in"
                />
              )}
              <Carousel
                full
                items={product.product_image.map((item: any) => {
                  return { src: item.url };
                })}
                Render={Image}
              />
            </Flex>
            <Flex w={mobile ? "100%" : "50%"} flexDir={"column"} gap={4}>
              <Heading
                as={"h1"}
                fontSize={mobile ? "md" : "lg"}
                fontWeight={"bold"}
                color={"gray.800"}
                textTransform={"uppercase"}
              >
                {product.title}
              </Heading>
              <Flex
                w="full"
                justify={"space-between"}
                borderBottomWidth={1}
                borderColor={"gray.200"}
                pb={4}
              >
                <Flex flexDir={"column"}>
                  <Flex fontSize={"xs"} gap={1} color={"gray.500"}>
                    <Text as={"span"}>Código:</Text>
                    <Text as={"span"} fontWeight={"600"}>
                      {product.id}
                    </Text>
                  </Flex>

                  {mobile && (
                    <Flex fontSize={"xs"} gap={1} color={"gray.500"}>
                      <Text as={"span"}>Marca:</Text>
                      <Text as={"span"} fontWeight={"600"}>
                        {product.product_brands?.name}
                      </Text>
                    </Flex>
                  )}

                  <Flex w={"full"}>
                    <ReviewStars value={product.average_rating} />
                  </Flex>
                </Flex>

                {!mobile && (
                  <Flex flexDir={"column"}>
                    <Flex fontSize={"xs"} gap={1} color={"gray.500"}>
                      <Text as={"span"}>Marca:</Text>
                      <Text as={"span"} fontWeight={"600"}>
                        {product.product_brands?.name}
                      </Text>
                    </Flex>
                  </Flex>
                )}
              </Flex>
              <Flex
                w={"full"}
                justifyContent={mobile ? "center" : "flex-start"}
                flexDir={"column"}
                alignItems={mobile ? "center" : "flex-start"}
              >
                {parseInt(product.discount) > 0 && (
                  <Text
                    fontSize={"lg"}
                    as="del"
                    textDecoration={
                      parseInt(product.discount) > 0 ? "line-through" : "none"
                    }
                  >
                    R$ {total}
                  </Text>
                )}
                <Text fontSize={"3xl"} fontWeight={"bold"} color="primary.500">
                  {formatMoney(parseInt(product.price))}
                </Text>
                <Text fontSize={"xs"}>
                  até{" "}
                  <Text as="span" fontWeight={"bold"}>
                    03x
                  </Text>{" "}
                  de{" "}
                  <Text as="span" fontWeight={"bold"}>
                    {formatMoney(parseFloat(product.price) / 3)}
                  </Text>{" "}
                  sem juros
                </Text>
                <Text fontSize={"xs"}>
                  ou{" "}
                  <Text as="span" fontWeight={"bold"} color="primary.500">
                    {formatMoney(product.price)}
                  </Text>{" "}
                  via Pix
                </Text>
              </Flex>
              <Flex
                w={"full"}
                justifyContent={mobile ? "center" : "flex-start"}
              >
                <QuickCart is_button={true} product={product} />
              </Flex>
              <Flex
                w={"full"}
                justifyContent={mobile ? "center" : "flex-start"}
                flexDir={"column"}
                alignItems={mobile ? "center" : "flex-start"}
              >
                <Text fontSize={"xs"}>
                  Quantidade disponível:{" "}
                  <Text as="span" fontWeight={"bold"} color="primary.500">
                    {3} unidades
                  </Text>
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex
            w="full"
            borderTopWidth={1}
            borderColor={"gray.200"}
            pt={10}
            justifyContent={"center"}
            flexDir={"column"}
            alignItems={"center"}
            gap={2}
          >
            <Text
              fontSize={mobile ? "sm" : "md"}
              fontWeight={"800"}
              mb={2}
              color={"gray.800"}
              textTransform={"uppercase"}
            >
              Descrição do produto
            </Text>
            <div
              dangerouslySetInnerHTML={{ __html: product.description }}
            ></div>
          </Flex>

          <Flex
            w="full"
            borderTopWidth={1}
            borderColor={"gray.200"}
            pt={10}
            justifyContent={"center"}
            flexDir={"column"}
            alignItems={"center"}
            gap={2}
          >
            <Text
              fontSize={mobile ? "sm" : "md"}
              fontWeight={"800"}
              color={"gray.800"}
              textTransform={"uppercase"}
            >
              Nota do produto
            </Text>
            <Flex
              w={"full"}
              direction={"column"}
              justifyItems={"center"}
              alignItems={"center"}
            >
              <Heading
                as={"h2"}
                size={mobile ? "md" : "lg"}
                textAlign={"center"}
                fontWeight={"400"}
                color={"black"}
                textTransform={"uppercase"}
              >
                <Text fontWeight={"900"} fontSize={58} as="span">
                  {product?.average_rating?.toString().split("/")[0] ?? "0"}
                </Text>
                {"/5"}
              </Heading>
              <ReviewStars value={product.average_rating} count={5} size={40} />
              <Text
                fontSize={mobile ? "sm" : "md"}
                fontWeight={"800"}
                mb={2}
                color={"gray.800"}
                textTransform={"uppercase"}
                mt={6}
              >
                Avaliações do produto
              </Text>
              {product.reviews.length && (
                <Flex
                  w={"full"}
                  direction={"column"}
                  justifyItems={"center"}
                  alignItems={"center"}
                  borderBottom={"1px solid #ccc"}
                >
                  {product.reviews.map((item: any) => {
                    return (
                      <ReviewCard
                        key={item.id}
                        name={item.users.name}
                        date={item.created_date}
                        rating={item.grade}
                        comment={item.comment}
                      />
                    );
                  })}
                </Flex>
              )}
              <Text
                fontSize={mobile ? "sm" : "md"}
                fontWeight={"800"}
                color={"gray.800"}
                mt={4}
                textTransform={"uppercase"}
              >
                Comente você também
              </Text>
              {false ? (
                <Flex mt={4}>
                  <Alert status="success">
                    <AlertIcon />
                    Comentário enviado com sucesso!
                  </Alert>
                </Flex>
              ) : (
                <Formik
                  initialValues={{ mensagem: "" }}
                  onSubmit={(values, actions) => {
                    console.log("values: ", values);
                    console.log(actions);
                    setTimeout(() => {
                      actions.setSubmitting(false);
                      //   setCommented(true);
                      //   setTimeout(() => {
                      //     setCommented(false);
                      //   }, 3000);
                    }, 1000);
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                  }) => (
                    <Form style={{ width: "100%" }}>
                      <Field name="mensagem">
                        {({ field, form }: { field: any; form: any }) => (
                          <FormControl w={"full"}>
                            <Textarea
                              mt={5}
                              rows={6}
                              {...field}
                              placeholder="Escreva seu comentário"
                            />
                          </FormControl>
                        )}
                      </Field>
                      <Center>
                        <Button
                          mt={4}
                          w={mobile ? "100%" : "40%"}
                          color={"white"}
                          bg={"primary.500"}
                          isLoading={isSubmitting}
                          type="submit"
                          _hover={{
                            bg: "primary.600",
                          }}
                        >
                          Avaliar
                        </Button>
                      </Center>
                    </Form>
                  )}
                </Formik>
              )}

              <ProductsSection
                products={products}
                title="Produtos relacionados"
              />
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
    const product_categories = "masculino";
    const id = context.params.id;

    const [categories, products, product] = await Promise.all([
      Api.get(`${process.env.URL}/platform/get-categories`),
      Api.post(`${process.env.URL}/platform/list-products`, {
        product_categories,
      }),
      Api.get(`${process.env.URL}/platform/product-by-id/${id}`),
    ]);
    try {
      const res = await aboutMe(context);
      user = res.data;
    } catch (err) {
      console.log(err);
      user = null;
    }
    return {
      props: {
        categories: categories.data,
        products: products.data,
        product: product.data,
        user,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        categories: [],
        products: [],
        product: null,
        user,
      },
    };
  }
}
