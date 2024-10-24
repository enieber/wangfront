"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Radio,
  RadioGroup,
  SimpleGrid,
  Text,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  useMediaQuery,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import InputMask from "react-input-mask";
import Cards from "react-credit-cards-2";
import { useForm } from "react-hook-form";
import { formatMoney } from "../../helpers/money";
import ResumeCartItem from "../ResumeCartItem";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import AddressListComponent from "../AddressList";
import AccountForm from "../AccountForm";
import CartItem from "../Cart/CartItem";
import ShippingList from "../ShippingList";

enum PaymentMethod {
  creditCard = "creditCard",
  pix = "pix",
  boleto = "boleto",
}

const steps = [
  { title: "Produtos", description: "Lista de produtos" },
  { title: "Dados Pessoais", description: "Adicione dados de acesso" },
  { title: "Pagamento", description: "Selecione forma de pagamento" },
];

export default function FinalizarCompra() {
  const [cupom, setCupom] = useState("");
  const [selectedFreight, setSelectedFreight] = useState<number>(1);
  const [showCupomField, setShowCupomField] = useState(false);
  const [tipoCadastro, setTipoCadastro] = useState("pessoa_fisica");
  const { user, updateUser } = useAuth();
  const [mobile] = useMediaQuery("(max-width: 400px)");
  const [showZipCodeField, setShowZipCodeField] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [zipCode, setZipCode] = useState("");
  const [shippingLoading, setShippingLoading] = useState(false);
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

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.creditCard
  );

  const { activeStep, setActiveStep, goToNext, goToPrevious } = useSteps({
    index: 1,
    count: steps.length,
  });

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

  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(values: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
      }, 3000);
    });
  }

  function fetchAddress() {
    if (user) {
      axios
        .get("/api/address", {
          params: {
            user_id: user.id,
          },
        })
        .then((res) => {
          const adapterAddress = res.data.map((item) => {
            return {
              ...item.addresses,
              id: item.address_id,
            };
          });
          setAddressList(adapterAddress);
        })
        .catch((err) => {
          console.log("error", err);
        });
    }
  }

  useEffect(() => {
    let mount = true;
    if (mount) {
      fetchAddress();
    }

    return () => {
      mount = false;
    };
  }, [user]);

  return (
    <Flex
      as={"main"}
      direction={"column"}
    >
      <Flex as={"section"} direction={"column"} py={5} 
      background={"#fafafa"}>
        <Heading
          as={"h2"}
          size={"lg"}
          mb={10}
          borderBottom={"1px solid"}
          borderColor={"gray.200"}
          p={4}
        >
          Finalizar Compra
        </Heading>
        <Container maxW={"container.xl"}>
          
          <Stepper size={"sm"} index={activeStep}>
            {steps.map((step, index) => (
              <Step key={index} onClick={() => setActiveStep(index + 1)}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>

                <Box flexShrink="0">
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>

                <StepSeparator />
              </Step>
            ))}
          </Stepper>
        </Container>
      </Flex>

      
        <Flex
          flex="1"
          direction={{ base: "column" }}
          alignItems={"flex-start"}
          background={"#fafafa"}
        >
          {activeStep == 2 && (
            <Flex
              w={{ base: "100%" }}
              p={4}
              border="1px solid"
              borderColor="gray.200"
              rounded="md"
              flexDir="column"
              gap={4}
            >
              <Flex w="full" justify="space-between">
                <Heading as={"h3"} size={"sm"}>
                  Dados pessoais
                </Heading>
              </Flex>
              <AccountForm user={user} updateUser={updateUser} />
              <Flex w="full" justify="space-between">
                <Heading as={"h3"} size={"sm"}>
                  Endereço
                </Heading>
              </Flex>

              <AddressListComponent
                addressList={addressList}
                selectValue={(data) => {
                  calculateDelivery(data.zip_code);
                }}
              />
              <ShippingList
                shippingLoading={shippingLoading}
                shippingOptions={shippingOptions}
                selectValue={(value: any) => addShipping(value)}
              />
            </Flex>
          )}
          {activeStep == 3 && (
            <Flex
              w={{ base: "100%" }}
              p={4}
              border="1px solid"
              borderColor="gray.200"
              rounded="md"
              flexDir="column"
              gap={4}
            >
              
            </Flex>
          )}
          {activeStep == 1 && (
            <Flex>
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
            </Flex>
          )}
          {activeStep == 3 && (
            <Flex>
              {cartItems.length > 0 ? (
                <Flex gap={10} wrap={"wrap"}>
                  <Flex direction={mobile ? "column" : "row"}>
                    
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
            </Flex>
          )}
        
      </Flex>
      <Flex
          m={10}
          justifyContent={"center"}
          alignItems={"center"}
          justifyItems={"center"}
          gap={10}
        >
          <Button
            colorScheme="blue"
            onClick={goToPrevious}
            disabled={activeStep === 1}
            w={mobile ? "90%" : "50%"}
            textAlign={"center"}
          >
            Voltar
          </Button>
          <Button
            colorScheme="blue"
            disabled={activeStep === 3}
            onClick={goToNext}
            w={mobile ? "90%" : "50%"}
            textAlign={"center"}
          >
            Proximo
          </Button>
        </Flex>
        <Flex
          p={4}
          border="1px solid"
          borderColor="gray.200"
          rounded="md"
          flexDir="column"

          background={"#fafafa"}
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
          {activeStep === 3 ? (
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              textAlign={"center"}
            >
              Finalizar compra
            </Button>
          ) : (
            <Link
              display="block"
              textAlign="center"
              mt={2}
              color="blue.500"
              href="/"
            >
              Continuar Comprando →
            </Link>
          )}
        </Flex>
    </Flex>
  );
}
