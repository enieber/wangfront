import { Container, Flex, Image, SimpleGrid } from '@chakra-ui/react';

import React from 'react';

interface Props {
  items: IItems[];
  columns?: number;
}

interface IItems {
  image_url: string;
}

export default function FeatureImagesSection({ items, columns = 3 }: Props) {
  return (
    <Flex as={'section'} direction={'column'} w={'full'} py={4} px={7}>
      <Container maxW={'container.xl'}>
        <SimpleGrid columns={[1, columns, columns]} spacing={8}>
          {items.map((item, index) => (
            <Image key={index} src={item.image_url} alt={'Feature Image'} w={'full'} borderRadius={'md'} />
          ))}
        </SimpleGrid>
      </Container>
    </Flex>
  );
}
