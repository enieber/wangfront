'use client';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { Flex, IconButton, Image, Input, Link, Text, useMediaQuery } from '@chakra-ui/react';

import React from 'react';
import { TbTrash } from 'react-icons/tb';
import { formatMoney } from '../../helpers/money';

export default function CartItem({ product, remove, increment, decrement, setQuantity }: any) {
const [mobile] = useMediaQuery('(max-width: 430px)');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

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
        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
          gap={2}
          direction={mobile ? 'column' : 'row'}
          w="full"
        >
          <Flex align={'center'} gap={2} w={'80%'} direction={mobile ? 'column' : 'row'}>
            <Image src={product.product_image[0].url} w={24} h={24} alt={product.title} />
            <Flex flexDir={'column'} gap={0} width={'50%'}>
              <Link href={`/produto/${product.id}`} color={'gray.800'} _hover={{ textDecoration: 'underline' }}>
                <Text w={mobile ? '100%' : 'auto'} fontSize={'xs'} isTruncated>
                  {product.title}
                </Text>
              </Link>
              <Text fontSize={'md'} textAlign={mobile ? 'center' : 'start'} fontWeight={'bold'}>
                {formatMoney(product.price)}
              </Text>
            </Flex>
          </Flex>
          <Flex align="center">
            <IconButton
              isDisabled={product.quantity <= 1}
              icon={<FaMinus />}
              onClick={() => decrement(product.id)}
              colorScheme="blue"
              aria-label="Decrementar quantidade"
            />
            <Input
              value={product.quantity}
              onChange={handleInputChange}
              textAlign="center"
              mx={2}
              width="50px"
              type="number"
            />
            <IconButton
              icon={<FaPlus />}
              colorScheme="blue"
              onClick={() => increment(product.id)}
              mx={2}
              aria-label="Incrementar quantidade"
            />
            <IconButton aria-label="Remover" icon={<TbTrash />} onClick={() => remove(product.id)} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
