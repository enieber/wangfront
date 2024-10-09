import React from 'react';
import { Box, useMediaQuery } from '@chakra-ui/react';

export default function Banner(props: any) {
  const [mobile] = useMediaQuery('(max-width: 430px)');
  
  return (
    <Box
      key={props.id}
      p={0}
      w="100%"
      h={mobile ? 300 : 550}
      bgImage={`url(${props.image_url})`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
    />
  )
}
