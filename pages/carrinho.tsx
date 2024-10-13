import axios from "axios";
import {
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Link,
  SimpleGrid,
  Text,
  useMediaQuery,
  Box,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import Layout from "../components/Layout";
import Api, { aboutMe } from "../services/api";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import CartItem from "../components/Cart/CartItem";
import { formatMoney } from "../helpers/money";
import ShippingList from "../components/ShippingList";
import { useAuth } from "../context/AuthContext";

function CarrinhoContent() {
  const [mobile] = useMediaQuery("(max-width: 400px)");
  const { user } = useAuth();  
  const {
    cartItems,
    totalCart,
    removeFromCart,
    off,
    subTotal,
    increment,
    decrement,
    setQuantity,
    addShipping,
    delivery,
  } = useCart();

  const [cupom, setCupom] = useState("");
  const [showCupomField, setShowCupomField] = useState(false);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [showZipCodeField, setShowZipCodeField] = useState(false);

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
    <Flex as={"main"} direction={"column"} w={"full"}>
      <Flex as={"section"} direction={"column"} w={"full"} pt={10} pb={20}>
        <Container maxW={"container.xl"}>
          <Heading
            as={"h2"}
            size={"lg"}
            mb={10}
            borderBottom={"1px solid"}
            borderColor={"gray.200"}
            pb={4}
          >
            Carrinho de compras
          </Heading>
          {cartItems.length > 0 ? (
            <Flex gap={10} wrap={"wrap"}>
              <Flex direction={mobile ? "column" : "row"}>
                <SimpleGrid columns={1} gap={2}>
                  {cartItems.map((product: any) => (
                    <CartItem
                      key={product.id}
                      product={product}
                      remove={removeFromCart}
                      increment={increment}
                      decrement={decrement}
                      setQuantity={setQuantity}
                    />
                  ))}
                </SimpleGrid>
              </Flex>

              <Flex
                p={4}
                border="1px solid"
                borderColor="gray.200"
                rounded="md"
                flexDir="column"
                gap={2}
              >
                <Flex
                  justify="space-between"
                  borderBottom={"1px solid"}
                  borderBottomColor={"gray.200"}
                  pb={2}
                >
                  <Text fontSize="sm" color={"gray.600"}>
                    Subtotal
                  </Text>
                  <Text fontSize="sm">{formatMoney(subTotal)}</Text>
                </Flex>

                {cupom && (
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
                        Cupom
                      </Text>
                      <Link
                        fontSize="sm"
                        color="blue.500"
                        onClick={() => setShowCupomField(!showCupomField)}
                      >
                        {showCupomField ? "Fechar" : "Adicionar"}
                      </Link>
                    </Flex>

                    {showCupomField && (
                      <Flex gap={2} w={"full"}>
                        <Input
                          type="text"
                          placeholder="Digite seu cupom"
                          value={cupom}
                          onChange={(e) => setCupom(e.target.value)}
                        />
                        <Button>Aplicar</Button>
                      </Flex>
                    )}
                  </Flex>
                )}

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
                    selectValue={(value: any) => addShipping(value)}
                  />
                </Flex>
                {delivery.name && (
                  <Flex
                    justify="space-between"
                    borderBottom={"1px solid"}
                    borderBottomColor={"gray.200"}
                    pb={2}
                  >
                    <Flex direction="column">
                    <Text fontSize="sm" fontWeight={"bold"}>
                    Frete: {delivery.name}
                  </Text>
                  
                    {delivery.error ? (
                      <Text color="red.500">{delivery.error}</Text>
                    ) : (
                      <>
                        <Text>
                          Preço: {delivery.currency} {delivery.price}
                        </Text>
                        <Text>
                          Tempo de Entrega: {delivery.delivery_range.min} -{" "}
                          {delivery.delivery_range.max} dias
                        </Text>
                      </>
                    )}
                    </Flex>
                  </Flex>
                )}
                <Flex
                  justify="space-between"
                  borderBottom={"1px solid"}
                  borderBottomColor={"gray.200"}
                  pb={2}
                >
                  <Text fontSize="sm" fontWeight={"bold"}>
                    Total
                  </Text>
                  <Text fontSize="sm" fontWeight={"bold"}>
                    {formatMoney(totalCart)}
                  </Text>
                </Flex>

                <Link
                  size={"lg"}
                  w="full"
                  bg="primary.500"
                  color="white"
                  borderRadius="md"
                  textAlign={"center"}
                  py={2}
                  mt={4}
                  px={2}
                  _hover={{ bg: "primary.600" }}
                  _active={{ bg: "primary.700" }}
                  _focus={{ boxShadow: "none" }}
                  href="/finalizar-compra"
                >
                  Ir para o pagamento
                </Link>

                <Link
                  display="block"
                  textAlign="center"
                  mt={2}
                  color="blue.500"
                  href="/"
                >
                  Ou Continuar Comprando →
                </Link>
              </Flex>
            </Flex>
          ) : (
            <Flex gap={10} direction="column">
              <Text fontSize="sm" color={"gray.600"}>
                Nenhum produto no carrinho
              </Text>
              <Link color="primary.500" href="/">
                Continuar Comprando
              </Link>
            </Flex>
          )}
        </Container>
      </Flex>
    </Flex>
  );
}

interface CarrinhoProps {
  user: any;
  menus: any[];
}

export default function Carrinho({ user, menus }: CarrinhoProps) {
  return (
    <Layout menus={menus} user={user}>
      <Box w={"full"} bg={"#F5F5F5"} p={10}>
        <Box m={5}>
          <CarrinhoContent />
        </Box>
      </Box>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  let user = null;
  try {
    const [menus] = await Promise.all([
      Api.get(`${process.env.URL}/platform/get-categories`),
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
        menus: menus.data,
        user,
      },
    };
  } catch (error) {
    return {
      props: {
        menus: [],
        user,
      },
    };
  }
}
