import { Container, Flex, Heading, Text, useMediaQuery } from '@chakra-ui/react';

import Carousel from '../UI/Carousel';
import ProductItem from './ProductItem';
import React from 'react';

export default function ProductsSection({ products, title }: { products: Array<any>; title: string }) {
  const [mobile] = useMediaQuery('(max-width: 400px)');

  return (
    <Flex as={'section'} direction={'column'} w={'full'} py={10}>
      <Container maxW={'container.xl'}>
        <Heading
          as={'h2'}
          size={mobile ? 'md' : 'lg'}
          textAlign={'center'}
          fontWeight={'400'}
          color={'gray.600'}
          textTransform={'uppercase'}
          mb={5}
        >
          <Text fontWeight={'bold'} as="span">
            {title.split(' ')[0]}
          </Text>{' '}
          {title.split(' ').slice(1).join(' ')}
        </Heading>
        <Carousel
          items={products}
          Render={ProductItem}
        />
      </Container>
    </Flex>
  );
}
