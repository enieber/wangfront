import {
  Container,
  Flex,
  Image,
  Link,
  SimpleGrid,
  Text,
  useMediaQuery
} from '@chakra-ui/react';
import { FaFacebookSquare, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

import { CgMail } from 'react-icons/cg';
import React, { useEffect, useState } from 'react';
import { mockData } from '../../mock/footer';
import axios from 'axios';

export default function Footer({ categories }: any) {
  const [mobile] = useMediaQuery('(max-width: 400px)');

  return (
    <Flex as={'footer'} direction={'column'} w={'full'}>
      <Flex w={'full'} direction={'column'} px={8} py={10} justify={'center'} align={'center'} gap={10}>
        <Container maxW={'container.xl'}>
          <SimpleGrid columns={[1, 4, 4]} spacing={4} textAlign={['center', 'left']}>
            <Flex flexDir={'column'} gap={4}>
              <Text textTransform={'uppercase'} color={'primary.600'} fontWeight={'bold'}>
                Categorias
              </Text>
              <Flex flexDir={'column'} gap={1}>
                {categories &&
                  categories.map((item: any, index: number) => (
                    <Link
                      key={index}
                      href={`/categoria/${item.name}`}
                      fontSize={'xs'}
                      color={'gray.500'}
                      _hover={{ textDecoration: 'underline' }}
                    >
                      <Text>{item.name}</Text>
                    </Link>
                  ))}
              </Flex>
            </Flex>
            <Flex flexDir={'column'} gap={4}>
              <Text textTransform={'uppercase'} color={'primary.600'} fontWeight={'bold'}>
                Institucional
              </Text>
              <Flex flexDir={'column'} gap={1}>
                {mockData &&
                  mockData.institucional.map(item => (
                    <Link
                      key={item}
                      href={`#`}
                      fontSize={'xs'}
                      color={'gray.500'}
                      _hover={{ textDecoration: 'underline' }}
                    >
                      <Text>{item}</Text>
                    </Link>
                  ))}
              </Flex>
            </Flex>
            <Flex
              flexDir={'column'}
              gap={4}
              justifyItems={mobile ? 'center' : 'self-start'}
              alignItems={mobile ? 'center' : 'self-start'}
            >
              <Text textTransform={'uppercase'} color={'primary.600'} fontWeight={'bold'}>
                Suporte
              </Text>
              <Flex gap={1} alignItems={'center'}>
                {mockData && (
                  <>
                    <CgMail />
                    <Link href={`mailto:`+mockData.atendimento.email} fontSize={'xs'} color={'gray.500'} _hover={{ textDecoration: 'underline' }}>
                      <Text>{mockData.atendimento.email}</Text>
                    </Link>
                  </>
                )}
              </Flex>

              <Text textTransform={'uppercase'} color={'primary.600'} fontWeight={'bold'}>
                Horário de Atendimento
              </Text>
              <Flex flexDir={'column'} gap={1}>
                {mockData && (
                  <Link href={`#`} fontSize={'xs'} color={'gray.500'} _hover={{ textDecoration: 'underline' }}>
                    <Text>{mockData.atendimento.horario}</Text>
                  </Link>
                )}
              </Flex>
            </Flex>
            <Flex
              flexDir={'column'}
              gap={4}
              justifyItems={mobile ? 'center' : 'self-start'}
              alignItems={mobile ? 'center' : 'self-start'}
            >
              <Text textTransform={'uppercase'} color={'primary.600'} fontWeight={'bold'}>
                Acompanhe nas redes
              </Text>
              <Flex gap={3}>
                {mockData?.socialLinks && (
                  <>
                    <Link href={`#`} fontSize={'xs'} color={'gray.500'} _hover={{ color: 'primary.500' }}>
                      <FaFacebookSquare size={30} />
                    </Link>
                    <Link href={`#`} fontSize={'xs'} color={'gray.500'} _hover={{ color: 'primary.500' }}>
                      <FaTwitter size={30} />
                    </Link>
                    <Link href={`#`} fontSize={'xs'} color={'gray.500'} _hover={{ color: 'primary.500' }}>
                      <FaYoutube size={30} />
                    </Link>
                    <Link href={`#`} fontSize={'xs'} color={'gray.500'} _hover={{ color: 'primary.500' }}>
                      <FaInstagram size={30} />
                    </Link>
                  </>
                )}
              </Flex>
            </Flex>
          </SimpleGrid>
        </Container>
        <Container maxW={'container.xl'}>
          <SimpleGrid columns={[1, 2, 2]} spacing={4} textAlign={['center', 'left']}>
            <Flex flexDir={'column'} gap={4}>
              <Text textTransform={'uppercase'} color={'primary.600'} fontWeight={'bold'}>
                Pague com
              </Text>
              <Flex gap={2} wrap={'wrap'} alignItems={'center'}>
                <Image src={'/assets/icons/visa.png'} alt={'Visa'} />
                <Image src={`/assets/icons/pix.png`} alt={'Pix'} />
              </Flex>
            </Flex>
            <Flex flexDir={'column'} gap={4}>
              <Text textTransform={'uppercase'} color={'primary.600'} fontWeight={'bold'}>
                Acompanhe nas redes
              </Text>
              <Flex gap={2} alignItems={'center'}>
                <Image src={'/assets/icons/site-seguro.png'} alt={'Site seguro - wang store'} />
                <Image src={'/assets/icons/google-seguro.png'} alt={'Google seguro - wang store'} />
              </Flex>
            </Flex>
          </SimpleGrid>
        </Container>
      </Flex>
      <Flex
        w={'full'}
        direction={'column'}
        px={8}
        py={6}
        justify={'center'}
        align={'center'}
        gap={10}
        borderTop={'1px solid'}
        borderColor={'gray.200'}
      >
        <Container maxW={'container.xl'}>
          <Flex w="full" justifyContent={'space-between'}>
            <Text fontSize={'sm'} color={'gray.500'}>
              {mockData.copyRight}
            </Text>
          </Flex>
        </Container>
      </Flex>
    </Flex>
  );
}
