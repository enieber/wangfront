"use client";

import {
  Flex,
  Text,
  Button,
  Input,
  RadioGroup,
  Stack,
  Radio,
  FormLabel,
  FormControl,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { Formik, Form, Field } from "formik";
import InputMask from "react-input-mask";
import * as Yup from "yup";
import { validateCNPJ, validateCPF } from "validations-br";

enum Pessoa {
  fisica = "Fisica",
  juridica = "Juridica",
}

const AcccountSchema = Yup.object({
  name: Yup.string()
    .min(2, "Seu nome é muito curto")
    .max(70, "Seu nome é muito longo")
    .required("Digite um nome"),
  birth_date: Yup.string().required(),
  pessoa: Yup.string().required("Selecione o tipo de pessoa"),
  phone_number: Yup.string().required("Digite um celular"),
  cpf_cnpj: Yup.string().test(
    "cpf_cnpj",
    "Documento inválido",
    function (value?: string) {
      const { pessoa } = this.parent; // Acessa o valor de 'pessoa'
      if (!value) {
        return false;
      }
      if (pessoa === "fisica") {
        return validateCPF(value);
      } else if (pessoa === "juridica") {
        return validateCNPJ(value);
      }
      return false; // Retorna false para marcar como inválido
    }
  ),
});

type AccountFormProps = any;

export default function AccountForm({ user, updateUser }: AccountFormProps) {
  const toast = useToast();

  // Memoize initial values to avoid recomputation
  const initialValues = useMemo(
    () => ({
      name: user.name,
      gender: user.gender,
      birth_date: user.birth_date,
      email: user.email,
      phone_number: user.phone_number,
      pessoa: user.pessoa,
      cpf_cnpj: user.cpf_cnpj,
      isNotEdit: true,
    }),
    [user]
  );

  // Memoize the validation schema to avoid recreation
  const validationSchema = useMemo(() => AcccountSchema, []);

  // Use useCallback to avoid recreating onSubmit handler
  const handleSubmit = useCallback(
    (values) => {
      updateUser(values)
        .then((res: any) => {
          toast({
            title: "Dados Alterados com sucesso",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          // enableNotEdit(true);
        })
        .catch((err: any) => {
          let message = err.message;
          if (err.response && err.response.data.message) {
            message = err.response.data.message;
          }
          toast({
            title: "Falha ao alterar dados",
            description: message,
            status: "warning",
            duration: 9000,
            isClosable: true,
          });
        });
    },
    [toast, updateUser]
  );

  return (
    <Flex
      direction={"column"}
      p={10}
      gap={10}
      background={"#FAFAFA"}
      borderRadius={5}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values);
          setSubmitting(false);
        }}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleSubmit, values, setFieldValue }) => (
          <Form
            onSubmit={(e) => {
              e.preventDefault(); // Aqui usamos preventDefault para evitar o comportamento padrão do form
              handleSubmit(); // Chama o handleSubmit do Formik
            }}
          >
            <Flex direction="column" gap={10}>
              <Flex w={"full"} direction={"column"}>
                <Text fontSize={"sm"} fontWeight={"600"}>
                  Nome:
                </Text>
                <Field name="name">
                  {({ field, form }) => (
                    <FormControl
                      mt={4}
                      isInvalid={form.errors.name && form.touched.name}
                    >
                      <Input
                        {...field}
                        value={field.value}
                        onChange={handleChange}
                        disabled={values.isNotEdit}
                        placeholder="Digite seu nome"
                      />
                      <FormErrorMessage>
                        {form.errors.phone_number}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Flex>

              <Flex w={"full"} direction={"column"}>
                <Text fontSize={"sm"} fontWeight={"600"}>
                  Email:
                </Text>
                <Field name="email">
                  {({ field }) => (
                    <Input
                      {...field}
                      disabled={true}
                      value={field.value}
                      onChange={handleChange}
                      placeholder="Digite seu email"
                    />
                  )}
                </Field>
              </Flex>
              <Flex w={"full"} direction={"column"}>
                <Text fontSize={"sm"} fontWeight={"600"}>
                  Celular:
                </Text>
                <Field name="phone_number">
                  {({ field, form }) => (
                    <FormControl
                      mt={4}
                      isInvalid={
                        form.errors.phone_number && form.touched.phone_number
                      }
                    >
                      <InputMask
                        disabled={values.isNotEdit}
                        mask="(99) 99999-9999"
                        value={field.value}
                        onChange={(e: any) =>
                          form.setFieldValue("phone_number", e.target.value)
                        }
                      >
                        {(inputProps: any) => (
                          <Input
                            {...inputProps}
                            disabled={values.isNotEdit}
                            type="text"
                            placeholder="(XX) XXXXX-XXXX"
                          />
                        )}
                      </InputMask>

                      <FormErrorMessage>
                        {form.errors.phone_number}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Flex>
              <Flex w={"full"} direction={"column"}>
                <Field name="pessoa">
                  {({ field, form }: any) => (
                    <RadioGroup
                      adioGroup
                      {...field}
                      onChange={(newPessoa) => {
                        form.setFieldValue("pessoa", newPessoa);
                      }}
                      value={field.value}
                      isDisabled={values.isNotEdit}
                    >
                      <Stack direction="row" gap={10}>
                        <Radio value="fisica">Pessoa Física</Radio>
                        <Radio value="juridica">Pessoa Jurídica</Radio>
                      </Stack>
                    </RadioGroup>
                  )}
                </Field>
              </Flex>
              <Flex w={"full"} direction={"column"}>
                <Field name="cpf_cnpj">
                  {({ field, form }: { field: any; form: any }) => (
                    <FormControl
                      mt={4}
                      isInvalid={form.errors.cpf_cnpj && form.touched.cpf_cnpj}
                    >
                      {form.values.pessoa === "fisica" ? (
                        <>
                          <FormLabel>CPF</FormLabel>
                          <InputMask
                            mask="999.999.999-99"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={values.isNotEdit}
                          >
                            {(inputProps: any) => (
                              <Input
                                {...field}
                                {...inputProps}
                                disabled={values.isNotEdit}
                                placeholder="000.000.000-00"
                              />
                            )}
                          </InputMask>
                        </>
                      ) : (
                        <>
                          <FormLabel>CNPJ</FormLabel>
                          <InputMask
                            mask="99.999.999/9999-99"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={values.isNotEdit}
                          >
                            {(inputProps: any) => (
                              <Input
                                {...field}
                                disabled={values.isNotEdit}
                                placeholder="00.000.000/0000-00"
                              />
                            )}
                          </InputMask>
                        </>
                      )}
                      <FormErrorMessage>
                        {form.errors.cpf_cnpj}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <>
                  <Flex w={"full"} direction={"column"}>
                    <Text fontSize={"sm"} fontWeight={"600"} py={5}>
                      Sexo:
                    </Text>
                    <Field
                      as="select"
                      name="gender"
                      disabled={values.isNotEdit}
                      value={values.gender}
                      onChange={handleChange}
                    >
                      <option value="">Selecione o sexo</option>
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                    </Field>
                  </Flex>
                  <Flex w={"full"} direction={"column"}>
                    <Field name="birth_date">
                      {({ field, form }: { field: any; form: any }) => (
                        <FormControl
                          mt={4}
                          isInvalid={
                            form.errors.birth_date && form.touched.birth_date
                          }
                        >
                          <FormLabel>Data Nascimento</FormLabel>
                          <InputMask
                            mask="99/99/9999"
                            value={field.value}
                            onChange={(e: any) =>
                              form.setFieldValue("birth_date", e.target.value)
                            }
                            onBlur={field.onBlur}
                            disabled={values.isNotEdit}
                          >
                            {(inputProps: any) => (
                              <Input
                                {...inputProps}
                                type="text"
                                disabled={values.isNotEdit}
                                placeholder="00/00/0000"
                              />
                            )}
                          </InputMask>
                          <FormErrorMessage>
                            {form.errors.birth_date}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Flex>
                </>
              </Flex>
            </Flex>
            <Flex gap={10}>
              <Button type="submit" colorScheme="blue" mt={4}>
                Salvar
              </Button>
              <Button
                colorScheme="blue"
                mt={4}
                onClick={() => {
                  values.isNotEdit
                    ? setFieldValue("isNotEdit", false)
                    : setFieldValue("isNotEdit", true);
                }}
              >
                {values.isNotEdit ? "Editar" : "Cancelar"}
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Flex>
  );
}
