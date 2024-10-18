import {
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  FormErrorMessage,
  Radio,
  RadioGroup,
  Stack,
  Box,
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
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
// @ts-ignore
import InputMask from "react-input-mask";
import { useEffect, useState, useContext } from "react";
import { BsCart3, BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import * as Yup from "yup";
import { validateCNPJ, validateCPF } from "validations-br";
import axios from "axios";
import Select from "react-select";
import { useAuth } from "../../context/AuthContext";

const RegisterSchema = Yup.object({
  name: Yup.string()
    .min(2, "Seu nome é muito curto")
    .max(70, "Seu nome é muito longo")
    .required("Digite um nome"),
  password: Yup.string()
    .min(8, "Sua senha é muito curta")
    .required("Digite sua senha"),
  email: Yup.string().email("Seu email é inválido").required("Digite um email"),
});

export default function RegisterContent(props: any) {
  const { states } = props;
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [mobile] = useMediaQuery("(max-width: 400px)");

  const toast = useToast();

  function createAccount(values: any) {
    register(values)
      .then((res: any) => {
        toast({
          title: "Conta Criada",
          description: "faça login e continue a usar",
          status: "success",
        });
        router.push("/conta/login");
      })
      .catch((err: any) => {
        toast({
          title: "Tente novamente",
          description: err.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  }

  return (
    <Flex direction={"column"} as={"main"} w={"full"}>
      <Flex as={"section"} direction={"column"} py={4}>
        <Container maxW={"container.xl"}>
          <Center>
            <Heading
              as={"h2"}
              size={"lg"}
              mb={10}
              borderBottom={"1px solid"}
              borderColor={"gray.200"}
              pb={4}
            >
              Criar conta
            </Heading>
          </Center>
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
            }}
            onSubmit={(values) => createAccount(values)}
            validationSchema={RegisterSchema}
          >
            {({ values, errors, touched }) => (
              <Center px={10}>
                <Form>
                  <Box>
                    <Field name="name">
                      {({ field, form }: { field: any; form: any }) => (
                        <FormControl
                          isInvalid={form.errors.name && form.touched.name}
                        >
                          <FormLabel>Nome</FormLabel>
                          <Input
                            {...field}
                            placeholder="joão da silva"
                          />
                          <FormErrorMessage>
                            {form.errors.name}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="email">
                      {({ field, form }: { field: any; form: any }) => (
                        <FormControl
                          isInvalid={form.errors.email && form.touched.email}
                        >
                          <FormLabel>Email</FormLabel>
                          <Input
                            {...field}
                            placeholder="contato@toycity.com.br"
                          />
                          <FormErrorMessage>
                            {form.errors.email}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="password">
                      {({ field, form }: { field: any; form: any }) => (
                        <FormControl
                          mt={4}
                          isInvalid={
                            form.errors.password && form.touched.password
                          }
                        >
                          <FormLabel>Senha</FormLabel>
                          <InputGroup w={mobile ? "100%" : 500}>
                            <Input
                              key={1}
                              {...field}
                              type={show ? "text" : "password"}
                              placeholder="Insira sua senha"
                              w={mobile ? 350 : 500}
                            />
                            <InputRightElement width="4.5rem">
                              <Button
                                h="1.75rem"
                                size="md"
                                onClick={() => setShow(!show)}
                              >
                                {show ? <BsEyeSlashFill /> : <BsEyeFill />}
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                          <FormErrorMessage>
                            {form.errors.password}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Box>

                  <Flex direction={"column"} my={10}>
                    <Button
                      mt={4}
                      w={mobile ? "100%" : 500}
                      color={"white"}
                      bg={"#00a0e3"}
                      isLoading={isLoading}
                      type="submit"
                      onClick={() => {
                        createAccount(values);
                      }}
                      _hover={{
                        bg: "primary.600",
                      }}
                    >
                      Criar conta
                    </Button>
                  </Flex>
                </Form>
              </Center>
            )}
          </Formik>
          <Center>
            <Button
              onClick={() => router.push("/conta/login")}
              mt={4}
              mb={20}
              color={"white"}
              bg={"#00a0e3"}
            >
              Entrar com minha conta.
            </Button>
          </Center>
        </Container>
      </Flex>
    </Flex>
  );
}
