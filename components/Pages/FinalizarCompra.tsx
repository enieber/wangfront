"use client";
import axios from "axios";
import { useState } from "react";
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
  const { user } = useAuth();
  const { cartItems, subTotal }  = useCart()
  const [mobile] = useMediaQuery("(max-width: 400px)");

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
        <Formik
          initialValues={{
            name: user.name,
            cpf: user.document,
            email: user.email,
            phone: user.phone_number,
            bussiness_name: "",
            company_name: "",
            registration: "",
            email_bussiness: "",
            cnpj: user.document,
            phone_bussiness: "",
            city: "",
            state: "",
            neighborhood: "",
            number: "",
            street: "",
            zipCode: "",
            card_holder_name: "",
            card_number: "",
            card_expiry: "",
            card_cvc: "",
          }}
          onSubmit={(values, actions) => {
            console.log("values: ", values);
            console.log(actions);
            setTimeout(() => {
              actions.setSubmitting(false);
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
            <Form>
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
                    <RadioGroup
                      onChange={setTipoCadastro}
                      value={tipoCadastro}
                      defaultValue="pessoa_fisica"
                    >
                      <Flex gap={4}>
                        <Radio value="pessoa_fisica">Pessoa Física</Radio>
                        <Radio value="pessoas_juridica">Pessoa Jurídica</Radio>
                      </Flex>
                    </RadioGroup>

                    {tipoCadastro === "pessoa_fisica" ? (
                      <SimpleGrid columns={2} gap={4}>
                        <Field name="name">
                          {({ field, form }: { field: any; form: any }) => (
                            <FormControl
                              isInvalid={form.errors.name && form.touched.name}
                            >
                              <FormLabel htmlFor="name">
                                Nome completo
                              </FormLabel>
                              <Input id="name" {...field} bgColor={"gray.50"} />
                              <FormErrorMessage>
                                {form.errors.name}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="cpf">
                          {({ field, form }: { field: any; form: any }) => (
                            <FormControl
                              isInvalid={form.errors.cpf && form.touched.cpf}
                            >
                              <FormLabel htmlFor="cpf">CPF</FormLabel>
                              <Input
                                as={InputMask}
                                mask="999.999.999-99"
                                masrkChar={null}
                                id="cpf"
                                {...field}
                                bgColor={"gray.50"}
                              />
                              <FormErrorMessage>
                                {form.errors.cpf}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="email">
                          {({ field, form }: { field: any; form: any }) => (
                            <FormControl
                              isInvalid={
                                form.errors.email && form.touched.email
                              }
                            >
                              <FormLabel htmlFor="email">Email</FormLabel>
                              <Input
                                id="email"
                                type="email"
                                {...field}
                                bgColor={"gray.50"}
                              />
                              <FormErrorMessage>
                                {form.errors.email}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="phone">
                          {({ field, form }: { field: any; form: any }) => (
                            <FormControl
                              isInvalid={
                                form.errors.phone && form.touched.phone
                              }
                            >
                              <FormLabel htmlFor="phone">Telefone</FormLabel>
                              <Input
                                id="phone"
                                type="tel"
                                as={InputMask}
                                mask="(99) 99999-9999"
                                maskChar={null}
                                {...field}
                                bgColor={"gray.50"}
                              />
                              <FormErrorMessage>
                                {form.errors.phone}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </SimpleGrid>
                    ) : (
                      <SimpleGrid columns={2} gap={4}>
                        <Field name="cnpj">
                          {({ field, form }: { field: any; form: any }) => (
                            <FormControl
                              isInvalid={form.errors.cnpj && form.touched.cnpj}
                            >
                              <FormLabel htmlFor="cnpj">CNPJ</FormLabel>
                              <Input
                                id="cnpj"
                                as={InputMask}
                                mask="99.999.999/9999-99"
                                maskChar={null}
                                {...field}
                                bgColor={"gray.50"}
                                onBlur={() => {
                                  const cnpj = field.value
                                    .replace("/", "")
                                    .replace(".", "")
                                    .replace("-", "")
                                    .replace(".", "");
                                  axios
                                    .get("/api/cnpj", { params: { cnpj } })
                                    .then((res) => {
                                      const {
                                        razao_social,
                                        email,
                                        ddd_telefone_1,
                                        nome_fantasia,
                                      } = res.data;
                                      form.setFieldValue(
                                        "bussiness_name",
                                        nome_fantasia
                                      );
                                      form.setFieldValue(
                                        "company_name",
                                        razao_social
                                      );
                                      form.setFieldValue(
                                        "email_bussiness",
                                        email
                                      );
                                      form.setFieldValue(
                                        "phone_bussiness",
                                        ddd_telefone_1
                                      );
                                    })
                                    .catch((err) => {});
                                }}
                              />
                              <FormErrorMessage>
                                {form.errors.cnpj}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="bussiness_name">
                          {({ field, form }: { field: any; form: any }) => (
                            <FormControl
                              isInvalid={
                                form.errors.bussiness_name &&
                                form.touched.bussiness_name
                              }
                            >
                              <FormLabel htmlFor="bussiness_name">
                                Nome Fantasia
                              </FormLabel>
                              <Input
                                id="bussiness_name"
                                {...field}
                                bgColor={"gray.50"}
                              />
                              <FormErrorMessage>
                                {form.errors.bussiness_name}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="company_name">
                          {({ field, form }: { field: any; form: any }) => (
                            <FormControl
                              isInvalid={
                                form.errors.company_name &&
                                form.touched.company_name
                              }
                            >
                              <FormLabel htmlFor="company_name">
                                Razão Social
                              </FormLabel>
                              <Input
                                id="company_name"
                                {...field}
                                bgColor={"gray.50"}
                              />
                              <FormErrorMessage>
                                {form.errors.company_name}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="registration">
                          {({ field, form }: { field: any; form: any }) => (
                            <FormControl
                              isInvalid={
                                form.errors.registration &&
                                form.touched.registration
                              }
                            >
                              <FormLabel htmlFor="registration">
                                Inscrição Social
                              </FormLabel>
                              <Input
                                id="registration"
                                {...field}
                                bgColor={"gray.50"}
                              />
                              <FormErrorMessage>
                                {form.errors.registration}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="email_bussiness">
                          {({ field, form }: { field: any; form: any }) => (
                            <FormControl
                              isInvalid={
                                form.errors.email_bussiness &&
                                form.touched.email_bussiness
                              }
                            >
                              <FormLabel htmlFor="email_bussiness">
                                Email
                              </FormLabel>
                              <Input
                                id="email_bussiness"
                                type="email"
                                {...field}
                                bgColor={"gray.50"}
                              />
                              <FormErrorMessage>
                                {form.errors.email_bussiness}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="phone_bussiness">
                          {({ field, form }: { field: any; form: any }) => (
                            <FormControl
                              isInvalid={
                                form.errors.phone_bussiness &&
                                form.touched.phone_bussiness
                              }
                            >
                              <FormLabel htmlFor="phone_bussiness">
                                Telefone
                              </FormLabel>
                              <Input
                                id="phone_bussiness"
                                type="phone"
                                as={InputMask}
                                mask="99 99999-9999"
                                maskChar={null}
                                {...field}
                                bgColor={"gray.50"}
                              />
                              <FormErrorMessage>
                                {form.errors.phone_bussiness}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </SimpleGrid>
                    )}
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

                    <SimpleGrid columns={2} gap={4}>
                      <Field name="zipCode">
                        {({ field, form }: { field: any; form: any }) => (
                          <FormControl
                            isInvalid={
                              form.errors.zipCode && form.touched.zipCode
                            }
                          >
                            <FormLabel htmlFor="zipCode">CEP</FormLabel>
                            <Input
                              {...field}
                              id="zipCode"
                              onBlur={() => {
                                const cep = field.value;
                                axios
                                  .get("/api/cep", { params: { cep } })
                                  .then((res) => {
                                    const {
                                      state,
                                      city,
                                      street,
                                      neighborhood,
                                    } = res.data;
                                    form.setFieldValue("state", state);
                                    form.setFieldValue("street", street);
                                    form.setFieldValue("city", city);
                                    form.setFieldValue(
                                      "neighborhood",
                                      neighborhood
                                    );
                                  })
                                  .catch((err) => {});
                              }}
                              bgColor={"gray.50"}
                            />
                            <FormErrorMessage>
                              {form.errors.zipCode}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="street">
                        {({ field, form }: { field: any; form: any }) => (
                          <FormControl
                            isInvalid={
                              form.errors.street && form.touched.street
                            }
                          >
                            <FormLabel htmlFor="street">Rua</FormLabel>
                            <Input id="street" {...field} bgColor={"gray.50"} />
                            <FormErrorMessage>
                              {form.errors.street}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="number">
                        {({ field, form }: { field: any; form: any }) => (
                          <FormControl
                            isInvalid={
                              form.errors.number && form.touched.number
                            }
                          >
                            <FormLabel htmlFor="number">Número</FormLabel>
                            <Input
                              id="number"
                              {...field}
                              type="number"
                              bgColor={"gray.50"}
                            />
                            <FormErrorMessage>
                              {form.errors.number}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="neighborhood">
                        {({ field, form }: { field: any; form: any }) => (
                          <FormControl
                            isInvalid={
                              form.errors.neighborhood &&
                              form.touched.neighborhood
                            }
                          >
                            <FormLabel htmlFor="neighborhood">Bairro</FormLabel>
                            <Input
                              id="neighborhood"
                              {...field}
                              bgColor={"gray.50"}
                            />
                            <FormErrorMessage>
                              {form.errors.neighborhood}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="city">
                        {({ field, form }: { field: any; form: any }) => (
                          <FormControl
                            isInvalid={form.errors.city && form.touched.city}
                          >
                            <FormLabel htmlFor="city">Cidade</FormLabel>
                            <Input id="city" {...field} bgColor={"gray.50"} />
                            <FormErrorMessage>
                              {form.errors.city}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="state">
                        {({ field, form }: { field: any; form: any }) => (
                          <FormControl
                            isInvalid={form.errors.state && form.touched.state}
                          >
                            <FormLabel htmlFor="state">Estado</FormLabel>
                            <Input id="state" {...field} bgColor={"gray.50"} />
                            <FormErrorMessage>
                              {form.errors.state}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </SimpleGrid>
                  </Flex>
                )}
                {activeStep == 3 && (
                  <>
                    <Flex
                      p={5}
                      border="1px solid"
                      borderColor="gray.200"
                      rounded="md"
                      flexDir="column"
                      gap={10}
                    >
                      <Heading as={"h3"} size={"sm"}>
                        Escolha a forma de entrega
                      </Heading>

                      <SimpleGrid columns={mobile ? 1 : 3} gap={4} w="full">
                        <Flex
                          w={{ base: "100%" }}
                          p={4}
                          border="1px solid"
                          rounded="md"
                          flexDir="column"
                          gap={4}
                          cursor={"pointer"}
                          alignItems={"space-between"}
                          justifyContent={"space-between"}
                          bg={selectedFreight === 1 ? "gray.50" : "white"}
                          onClick={() => setSelectedFreight(1)}
                          borderColor={
                            selectedFreight === 1 ? "blue.300" : "gray.200"
                          }
                          _hover={{
                            bg: "gray.50",
                            borderColor: "blue.300",
                          }}
                        >
                          <Text fontSize="sm" fontWeight={"bold"}>
                            Retirar na loja
                          </Text>
                          <Text fontSize="sm">
                            Rua das Margaridas, 110 - Jardim das Flores
                          </Text>
                          <Text fontSize="sm">R$ 0,00</Text>
                        </Flex>

                        <Flex
                          w={{ base: "100%" }}
                          p={4}
                          border="1px solid"
                          bg={selectedFreight === 2 ? "gray.50" : "white"}
                          onClick={() => setSelectedFreight(2)}
                          borderColor={
                            selectedFreight === 2 ? "blue.300" : "gray.200"
                          }
                          rounded="md"
                          flexDir="column"
                          gap={4}
                          cursor={"pointer"}
                          alignItems={"space-between"}
                          justifyContent={"space-between"}
                          _hover={{
                            bg: "gray.50",
                            borderColor: "blue.300",
                          }}
                        >
                          <Text fontSize="sm" fontWeight={"bold"}>
                            Sedex - Correios
                          </Text>
                          <Text fontSize="sm">Entrega em até 3 dias úteis</Text>
                          <Text fontSize="sm">R$ 10,00</Text>
                        </Flex>
                        <Flex
                          w={{ base: "100%" }}
                          p={4}
                          border="1px solid"
                          bg={selectedFreight === 3 ? "gray.50" : "white"}
                          onClick={() => setSelectedFreight(3)}
                          borderColor={
                            selectedFreight === 3 ? "blue.300" : "gray.200"
                          }
                          rounded="md"
                          flexDir="column"
                          gap={4}
                          cursor={"pointer"}
                          alignItems={"space-between"}
                          justifyContent={"space-between"}
                          _hover={{
                            bg: "gray.50",
                            borderColor: "blue.300",
                          }}
                        >
                          <Text fontSize="sm" fontWeight={"bold"}>
                            Pac - Correios
                          </Text>
                          <Text fontSize="sm">
                            Entrega em até 10 dias úteis
                          </Text>
                          <Text fontSize="sm">R$ 23,00</Text>
                        </Flex>
                      </SimpleGrid>
                    </Flex>
                    <Flex
                      w={{ base: "100%" }}
                      p={4}
                      my={10}
                      border="1px solid"
                      borderColor="gray.200"
                      rounded="md"
                      flexDir="column"
                      gap={4}
                    >
                      <Heading as={"h3"} size={"sm"}>
                        Forma de pagamento
                      </Heading>

                      <RadioGroup
                        onChange={(value) =>
                          setPaymentMethod(value as PaymentMethod)
                        }
                        value={paymentMethod}
                      >
                        <Flex gap={4}>
                          <Radio value={PaymentMethod.creditCard}>
                            Cartão de crédito
                          </Radio>
                          <Radio value={PaymentMethod.pix}>Pix</Radio>
                          <Radio value={PaymentMethod.boleto}>Boleto</Radio>
                        </Flex>
                      </RadioGroup>
                      {paymentMethod === PaymentMethod.creditCard && (
                        <Flex
                          w="full"
                          direction={mobile ? "column" : "row"}
                          gap={6}
                        >
                          <Cards
                            number={values.card_number}
                            expiry={values.card_expiry}
                            cvc={values.card_cvc}
                            name={values.card_holder_name}
                            focused={state.focus as any}
                          />

                          <Flex flexDir={"column"} gap={4} w={"full"}>
                            <Field name="card_holder_name">
                              {({ field, form }: { field: any; form: any }) => (
                                <FormControl
                                  isInvalid={
                                    form.errors.card_holder_name &&
                                    form.touched.card_holder_name
                                  }
                                >
                                  <FormLabel htmlFor="card_holder_name">
                                    Nome do titular
                                  </FormLabel>
                                  <Input
                                    id="card_holder_name"
                                    {...field}
                                    bgColor={"gray.50"}
                                  />
                                  <FormErrorMessage>
                                    {form.errors.card_holder_name}
                                  </FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>

                            <Field name="card_number">
                              {({ field, form }: { field: any; form: any }) => (
                                <FormControl
                                  isInvalid={
                                    form.errors.card_number &&
                                    form.touched.card_number
                                  }
                                >
                                  <FormLabel htmlFor="card_number">
                                    Número do cartão
                                  </FormLabel>
                                  <Input
                                    id="card_number"
                                    {...field}
                                    type="number"
                                    bgColor={"gray.50"}
                                  />
                                  <FormErrorMessage>
                                    {form.errors.card_number}
                                  </FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                            <SimpleGrid columns={2} gap={4}>
                              <Field name="card_expiry">
                                {({
                                  field,
                                  form,
                                }: {
                                  field: any;
                                  form: any;
                                }) => (
                                  <FormControl
                                    isInvalid={
                                      form.errors.card_expiry &&
                                      form.touched.card_expiry
                                    }
                                  >
                                    <FormLabel htmlFor="card_expiry">
                                      Expiração
                                    </FormLabel>
                                    <Input
                                      as={InputMask}
                                      id="card_expiry"
                                      {...field}
                                      mask="**/**"
                                      maskChar={null}
                                      bgColor={"gray.50"}
                                    />
                                    <FormErrorMessage>
                                      {form.errors.card_expiry}
                                    </FormErrorMessage>
                                  </FormControl>
                                )}
                              </Field>
                              <Field name="card_cvc">
                                {({
                                  field,
                                  form,
                                }: {
                                  field: any;
                                  form: any;
                                }) => (
                                  <FormControl
                                    isInvalid={
                                      form.errors.card_cvc &&
                                      form.touched.card_cvc
                                    }
                                  >
                                    <FormLabel htmlFor="card_cvc">
                                      CVV
                                    </FormLabel>
                                    <Input
                                      id="card_cvc"
                                      {...field}
                                      bgColor={"gray.50"}
                                    />
                                    <FormErrorMessage>
                                      {form.errors.card_cvc}
                                    </FormErrorMessage>
                                  </FormControl>
                                )}
                              </Field>
                            </SimpleGrid>
                          </Flex>
                        </Flex>
                      )}
                      {paymentMethod === PaymentMethod.pix && (
                        <Flex w="full" gap={6}>
                          <Text fontSize="sm">
                            Clicando em efetuar pagamento, você receberá o
                            QRCode e terá 2h para efetuar o pagamento via PIX..
                          </Text>
                        </Flex>
                      )}
                      {paymentMethod === PaymentMethod.boleto && (
                        <Flex w="full" gap={6}>
                          <Text fontSize="sm">
                            Clicando em efetuar pagamento, você terá acesso ao
                            boleto e 3 dias para efetuar o pagamento.
                          </Text>
                        </Flex>
                      )}
                    </Flex>
                    <Flex
                      w={{ base: "100%" }}
                      p={4}
                      border="1px solid"
                      borderColor="gray.200"
                      rounded="md"
                      flexDir="column"
                      gap={2}
                    >
                      <Flex w="full" justify="space-between">
                        <Heading as={"h3"} size={"sm"}>
                          Resumo do pedido
                        </Heading>

                        <Text fontSize="sm" color={"gray.600"}>
                          {" "}
                          4 itens
                        </Text>
                      </Flex>

                      <SimpleGrid
                        columns={1}
                        gap={2}
                        w={"100%"}
                        height={"300px"}
                        overflowY={"auto"}
                        mb={10}
                        pr={4}
                      >
                        {cartItems.slice(0, 4).map((product: any) => (
                          <ResumeCartItem key={product.id} {...product} />
                        ))}
                      </SimpleGrid>
                      <Flex
                        justify="space-between"
                        borderBottom={"1px solid"}
                        borderBottomColor={"gray.200"}
                        pb={2}
                      >
                        <Text fontSize="sm" color={"gray.600"}>
                          Subtotal
                        </Text>
                        <Text fontSize="sm">
                          {formatMoney(
                            cartItems
                              .slice(0, 4)
                              .reduce(
                                (acc: any, product: any) => acc + product.price,
                                0
                              )
                          )}
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
                          <Text
                            fontSize="sm"
                            color={"gray.600"}
                            display="flex"
                            alignItems="center"
                          >
                            Selecione um frete
                          </Text>
                        </Flex>
                      </Flex>

                      <Flex justify="space-between" pb={2}>
                        <Text fontSize="sm" fontWeight={"bold"}>
                          Total
                        </Text>
                        <Text fontSize="sm" fontWeight={"bold"}>
                          {formatMoney(subTotal)}
                        </Text>
                      </Flex>
                    </Flex>
                  </>
                )}
              </Flex>
              <Flex
                w="full"
                mt={10}
                justifyContent={"center"}
                alignItems={"center"}
                justifyItems={"center"}
              >
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  w={mobile ? "90%" : "50%"}
                  textAlign={"center"}
                >
                  Finalizar compra
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Flex>
    </Flex>
  );
}
