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
  Input,
  Link,
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
import ShippingList from "../../components/ShippingList";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
// @ts-ignore
import ReactStars from "react-rating-stars-component";

export default function ProductContent({ products, product }: any) {
  const [mobile] = useMediaQuery("(max-width: 400px)");
  const { addToCart } = useCart();
  const [cupom, setCupom] = useState("");
  const [showCupomField, setShowCupomField] = useState(false);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [showZipCodeField, setShowZipCodeField] = useState(false);

  const sortByPrice = 2;
  const currentTumbnailUrl = null;
  const total = parseFloat(product?.price) + parseFloat(product.discount);

  function calculateDelivery(code: string) {
    setShippingLoading(true);
    axios
      .get(`/api/delivery/`, {
        params: {
          cep: code,
        },
      })
      .then((res) => {
        setShippingLoading(false);
        setShippingOptions(res.data);
      })
      .catch((err) => {
        setShippingLoading(false);
        setShippingOptions([]);
        console.log(err);
      });
  }

  return (
    <>
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
                flexDir={"column"}
                mb={2}
                gap={2}
                borderBottom={"1px solid"}
                borderBottomColor={"gray.200"}
                pb={2}
              >
                <Flex justify="space-between">
                  <Text
                    fontSize="sm"
                    color={"gray.600"}
                    display="flex"
                    alignItems="center"
                  >
                    Frete
                  </Text>
                  <Link
                    fontSize="sm"
                    color="blue.500"
                    onClick={() => setShowZipCodeField(!showZipCodeField)}
                  >
                    {showZipCodeField ? "Fechar" : "Calcular"}
                  </Link>
                </Flex>

                {showZipCodeField && (
                  <Flex gap={2} w={"full"}>
                    <Input
                      type="text"
                      placeholder="Digite seu CEP"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                    <Button
                      onClick={() => {
                        calculateDelivery(zipCode);
                      }}
                    >
                      Calcular
                    </Button>
                  </Flex>
                )}

                <ShippingList
                  shippingLoading={shippingLoading}
                  shippingOptions={shippingOptions}
                />
              </Flex>
              <Flex
                flexDir={"column"}
                mb={2}
                gap={2}
                borderBottom={"1px solid"}
                borderBottomColor={"gray.200"}
                pb={2}
              >
                <Button
                  aria-label={"Adicionar ao carrinho"}
                  onClick={() => addToCart(product)}
                  px={20}
                >
                  Adicionar ao Carrinho
                </Button>
                <Button
                  aria-label={"Adicionar ao favorito"}
                  onClick={() => {
                    axios
                      .post(`/api/favorites?id_product=${product.id}`)
                      .then((res) => {
                        console.log(res);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                  px={20}
                >
                  Adicionar ao favorito
                </Button>
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
              <Formik
                initialValues={{ mensagem: "", grade: 0 }}
                onSubmit={(values, actions) => {
                  console.log(values)
                  axios
                    .post("/api/comment", {
                      mensagem: values.mensagem,
                      grade: values.grade,
                      id_product: product.id,
                    })
                    .then((res: any) => {
                      window.location.reload();
                    })
                    .catch((err: any) => {
                      console.log(err);
                    });
                }}
              >
                {({ values, isSubmitting }) => (
                  <Form style={{ width: "100%" }}>
                    <Flex direction={"column"} alignItems={'center'}>
                      <Field name="grade">
                        {({ field, form }: any) => (
                          <>
                            <Text
                              fontSize={mobile ? "sm" : "md"}
                              fontWeight={"800"}
                              color={"gray.800"}
                              textTransform={"uppercase"}
                            >
                              Nota do produto
                            </Text>
                            <ReactStars
                              count={5}
                              isHalf
                              onChange={(newValue) => {
                                form.setFieldValue("grade", newValue)
                              }}
                              size={24}
                              activeColor='#ffd700'
                              color={'#f0f0f0'}
                            />                            
                          </>
                        )}
                      </Field>
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
                    </Flex>
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
              <ProductsSection
                products={products}
                title="Produtos relacionados"
              />
            </Flex>
          </Flex>
        </Container>
      </Flex>
    </>
  );
}
