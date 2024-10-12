import { Button, Flex, Image, Link, Text } from '@chakra-ui/react';

import React from 'react';
import ReviewStars from '../UI/ReviewStart';
import { formatMoney } from '../../helpers/money';
import { useCart } from '../../context/CartContext';


export default function ProductItem(props: any) {
 const { addToCart } = useCart();

  return (
    <Flex key={props.id} flexDir={'column'} p={4}>
      <Flex
        direction={'column'}
        bg={'white'}
        pb={2}
        borderRadius={8}
        boxShadow={'sm'}
        _hover={{ boxShadow: 'lg' }}
        transition={'box-shadow 0.2s'}
      >
        <Link href={`/produto/${props.id}`} _focus={{ outline: 'none', boxShadow: 'none' }}>
          <Image
            src={props.product_image[0].url}
            alt={props.title}
            width={'full'}
            height={'300px'}
            objectFit={'contain'}
          />
        </Link>
        <Flex direction={'column'} p={2} w="full" gap={2}>
          <Link
            href={`/produto/${props.id}`}
            _hover={{ textDecoration: 'none' }}
            _focus={{ outline: 'none', boxShadow: 'none' }}
            color={'gray.600'}
            fontSize={'xs'}
            textAlign={'center'}
          >
            {props.title}
          </Link>
          <Flex w={'full'} justifyContent={'center'}>
            <ReviewStars value={props.average_rating} />
          </Flex>
          <Flex w={'full'} justifyContent={'center'} flexDir={'column'} alignItems={'center'}>
            <Text fontSize={'md'} fontWeight={'bold'} color="primary.500">
              {formatMoney(props.price)}
            </Text>
            <Text fontSize={'xs'}>
              até{' '}
              <Text as="span" fontWeight={'bold'}>
                03x
              </Text>{' '}
              de{' '}
              <Text as="span" fontWeight={'bold'}>
                {formatMoney(props.price / 3)}
              </Text>{' '}
              sem juros
            </Text>
            <Text fontSize={'xs'}>
              ou{' '}
              <Text as="span" fontWeight={'bold'} color="primary.500">
                {formatMoney(props.price * 0.9)}
              </Text>{' '}
              via Pix
            </Text>
          </Flex>
          <Flex w={'full'} justifyContent={'center'} mt={2}>
            <Button aria-label={'Adicionar ao carrinho'} onClick={() => addToCart(props)} px={20}>
              Adicionar ao Carrinho
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
