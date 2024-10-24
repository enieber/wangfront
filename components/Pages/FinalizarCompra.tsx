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

enum PaymentMethod {
  creditCard = "creditCard",
  pix = "pix",
  boleto = "boleto",
}

const steps = [
  { title: "Dados Pessoais", description: "Adicione dados de acesso" },
  { title: "Endereço", description: "Adicione dados de endereço" },
  { title: "Resumo", description: "Confirme seus dados" },
];

export default function FinalizarCompra() {
  const [cupom, setCupom] = useState("");
  const [selectedFreight, setSelectedFreight] = useState<number>(1);
  const [showCupomField, setShowCupomField] = useState(false);
  const [tipoCadastro, setTipoCadastro] = useState("pessoa_fisica");
  const { user, updateUser } = useAuth();
  const { cartItems, subTotal } = useCart();
  const [mobile] = useMediaQuery("(max-width: 400px)");
  const [addressList, setAddressList] = useState([]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.creditCard
  );
  const { activeStep, setActiveStep, goToNext } = useSteps({
    index: 1,
    count: steps.length,
  });

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
    <Flex as={"main"} direction={"column"} w={"full"} p={10}>
      <Flex as={"section"} direction={"column"} py={4}>
        <Heading
          as={"h2"}
          size={"lg"}
          mb={10}
          borderBottom={"1px solid"}
          borderColor={"gray.200"}
          pb={4}
        >
          Finalizar Compra
        </Heading>
        <Container maxW={"container.xl"}>
          <Stepper size={mobile ? "sm" : "md"} index={activeStep}>
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

      <Flex as={"section"} direction={"column"} w={"full"} py={10}>
        <Flex
          as="form"
          flex="1"
          direction={{ base: "column" }}
          alignItems={"flex-start"}
        >
          {activeStep == 1 && (
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
            </Flex>
          )}
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
                  Endereço
                </Heading>
              </Flex>

              <AddressListComponent
                addressList={addressList}
                selectValue={() => {}}
              />
            </Flex>
          )}
          {activeStep == 3 && (
            <Flex>
              
              <h1>Dados</h1>
              </Flex>
           
          )}
        </Flex>
        <Flex
          w="full"
          mt={10}
          justifyContent={"center"}
          alignItems={"center"}
          justifyItems={"center"}
        >
          {/* <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  w={mobile ? "90%" : "50%"}
                  textAlign={"center"}
                >
                  Finalizar compra
                </Button> */}
        </Flex>
      </Flex>
    </Flex>
  );
}
