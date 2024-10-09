import { Flex, IconButton, Image, Link, Text } from '@chakra-ui/react';

import React from 'react';
import { TbTrash } from 'react-icons/tb';
import { formatMoney } from '../../helpers/money';

export default function PreviewCartItem({ product, remove }: any) {
  return (
    <Flex
      key={product.id}
      flexDir={'column'}
      gap={2}
      w={'100%'}
      borderBottom={'1px solid'}
      borderBottomColor={'gray.100'}
      pb={2}
    >
      <Flex w={'100%'} justify={'space-between'} align={'center'}>
        <Flex justifyContent={'space-between'} alignItems={'center'} gap={2} w="full">
          <Flex align={'center'} gap={2} w={'80%'}>
            <Image src={product.product_image[0].url} w={16} h={16} alt={product.title} />
            <Flex flexDir={'column'} gap={0} width={'50%'}>
              <Link href={'#'} color={'gray.800'} _hover={{ textDecoration: 'underline' }}>
                <Text fontSize={'xs'} isTruncated>
                  {product.title}
                </Text>
              </Link>
              <Text fontSize={'sm'}>{formatMoney(product.price)}</Text>
            </Flex>
          </Flex>
          <Flex align={"center"} gap={2}>
            <IconButton aria-label="Remover" icon={<TbTrash />} onClick={() => remove(product.id)} />
              <Text fontSize={'sm'}>{formatMoney(parseInt(product.price))}</Text>
            </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
