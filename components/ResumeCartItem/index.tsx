import { Badge, Flex, Image, Link, Text } from "@chakra-ui/react";
import React from "react";
import { formatMoney } from "../../helpers/money";

export default function ResumeCartItem({ id, product_image, title, price }: any) {
  return (
    <Flex
      key={id}
      flexDir={"column"}
      gap={2}
      w={"100%"}
      borderBottom={"1px solid"}
      borderBottomColor={"gray.100"}
      pb={2}
    >
      <Flex w={"100%"} justify={"space-between"} align={"center"}>
        <Flex
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={2}
          w="full"
        >
          <Flex align={"center"} gap={2} w={"80%"}>
            <Image
              src={product_image[0].url}
              w={24}
              h={24}
              alt={title}
            />
            <Flex flexDir={"column"} gap={0} width={"50%"}>
              <Link
                href={"#"}
                color={"gray.800"}
                _hover={{ textDecoration: "underline" }}
              >
                <Text fontSize={"xs"} isTruncated>
                  {title}
                </Text>
              </Link>
              <Text fontSize={"md"} fontWeight={"bold"}>
                {formatMoney(price)}
              </Text>
            </Flex>
          </Flex>
          <Flex align="center">
            <Badge colorScheme="gray">Qtd: 1</Badge>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
