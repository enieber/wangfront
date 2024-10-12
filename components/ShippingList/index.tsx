import {
  Box,
  Image,
  Text,
  Stack,
  Badge,
  Heading,
  RadioGroup,
  Radio,
  SimpleGrid,
  Skeleton,
} from "@chakra-ui/react";
import { useState } from "react";

const ShippingList = ({ shippingOptions, shippingLoading, selectValue }: any) => {
  const [selectedOption, setSelectedOption] = useState(undefined);

  function handleSelection(value: any) {
    setSelectedOption(value);
    selectValue(shippingOptions.find((item: any )=> item.id ==value));
  }

  if (shippingLoading) {
    return (
      <SimpleGrid columns={1} row={1} gap={6}>
        <Skeleton height={50} width={250}></Skeleton>
        <Skeleton height={50} width={250}></Skeleton>
        <Skeleton height={50} width={250}></Skeleton>
      </SimpleGrid>
    );
  }

  return (
    <Stack spacing={4}>
      <RadioGroup onChange={handleSelection} value={selectedOption}>
        {shippingOptions
          .filter((item: any) => !item.error)
          .map((option: any) => (
            <Box
              key={option.id}
              p={5}
              shadow="md"
              borderWidth="1px"
              borderRadius="md"
            >
              <Stack
                direction="row"
                align="center"
                justify="space-around"
                my={5}
              >
                <Image
                  w={50}
                  height={30}
                  boxSize={50}
                  src={option.company.picture}
                  alt={option.company.name}
                />
              </Stack>

              <Radio value={String(option.id)} isDisabled={!!option.error}>
                <Heading size="md">{option.name}</Heading>
              </Radio>

              {option.error ? (
                <Text color="red.500">{option.error}</Text>
              ) : (
                <>
                  <Text>
                    Preço: {option.currency} {option.price}
                  </Text>
                  <Text>
                    Tempo de Entrega: {option.delivery_range.min} -{" "}
                    {option.delivery_range.max} dias
                  </Text>
                </>
              )}
            </Box>
          ))}
      </RadioGroup>
    </Stack>
  );
};

export default ShippingList;
