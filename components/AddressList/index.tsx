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
  Card,
  Highlight,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";

const AddressListComponent = ({
  addressList,
  isLoading,
  removeItem,
  selectValue,
}: any) => {
  const [selectedOption, setSelectedOption] = useState(undefined);

  function handleSelection(value: any) {
    setSelectedOption(value);
    selectValue(addressList.find((item: any) => item.id == value));
  }

  if (isLoading) {
    return (
      <SimpleGrid columns={1} row={1} gap={6}>
        <Skeleton height={50} width={250}></Skeleton>
        <Skeleton height={50} width={250}></Skeleton>
        <Skeleton height={50} width={250}></Skeleton>
      </SimpleGrid>
    );
  }

  if (!selectValue) {
    return (
      <SimpleGrid columns={2} gap={5}>
        {addressList.map((address: any) => (
          <Card gap={5} p={10} key={address.id}>
            <Highlight
              query="spotlight"
              styles={{ px: "1", py: "1", bg: "orange.100" }}
            >
              {`${address.street} - Nº: ${address.number}`}
            </Highlight>
            <Text>{`Bairro: ${address.neighborhood}`}</Text>
            <Text>{`${address.city} - ${address.state}`}</Text>
            <Button onClick={() => removeItem(address.id)}>Remover</Button>
          </Card>
        ))}
      </SimpleGrid>
    );
  }

  return (
    <Stack spacing={4}>
      <RadioGroup onChange={handleSelection} value={selectedOption}>
        {addressList.map((address: any) => (
          <Card gap={5} p={10} key={address.id}>
            <Radio value={String(address.id)}>
              <Highlight
                query="spotlight"
                styles={{ px: "1", py: "1", bg: "orange.100" }}
              >
                {`${address.street} - Nº: ${address.number}`}
              </Highlight>
              <Text>{`Bairro: ${address.neighborhood}`}</Text>
              <Text>{`${address.city} - ${address.state}`}</Text>
            </Radio>
          </Card>
        ))}
      </RadioGroup>
    </Stack>
  );
};

export default AddressListComponent;
