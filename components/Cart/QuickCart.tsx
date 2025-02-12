import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Link,
  SimpleGrid,
  Text,
  useDisclosure
} from '@chakra-ui/react';

import { BsCart3 } from 'react-icons/bs';
import PreviewCartItem from './PreviewCartItem';
import React from 'react';
import { formatMoney } from '../../helpers/money';
import { useCart } from '../../context/CartContext';


// const useCart = () => {
//   function addToCart() {}
//   const cartItems = [];
//   const totalCart = 0
//   function removeFromCart() {}
//   return {
//     addToCart,
//     cartItems,
//     totalCart,
//     removeFromCart,
//   }
// }

export default function QuickCart({
  size,
  colorScheme,
  is_button = false,
  product,
}: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { cartItems, totalCart, removeFromCart } = useCart();

  return (
    <>
      <Flex position="relative" alignItems={'center'} _hover={{ cursor: 'pointer', color: 'primary.500' }}>
        <Flex>
          <IconButton
            onClick={onOpen}
            aria-label={'Carrinho'}
            icon={<BsCart3 size={24} />}
            variant="none"
            colorScheme="primary"
          />
          <Text bg="primary.500" color="white" fontSize="xs" w={5} h={5} borderRadius="full" textAlign={'center'}>
            {cartItems.length}
          </Text>
        </Flex>
      </Flex>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Meu Carrinho</DrawerHeader>

          <DrawerBody pb={10}>
            <SimpleGrid columns={1} gap={2} w={"100%"}>
              {cartItems.map((product: any) => (
                <PreviewCartItem key={product.id} product={product} remove={removeFromCart}/>
              ))}
            </SimpleGrid>
          </DrawerBody>

          <DrawerFooter borderTop={'1px solid'} borderColor={'gray.300'}>
            <Flex flexDir={'column'} gap={6} justify={'center'} align={'center'} w={'100%'}>
              <Flex justify={'center'} align={'center'} gap={4}>
                <Text fontSize={'small'}>Subtotal</Text>
                <Text fontSize={'large'} fontWeight={'bold'}>
                  {formatMoney(totalCart)}
                </Text>
              </Flex>
              <Flex w={'full'}>
                <Link
                  size={'lg'}
                  w="full"
                  bg="primary.500"
                  color="white"
                  borderRadius="md"
                  textAlign={'center'}
                  py={4}
                  _hover={{ bg: 'primary.600' }}
                  _active={{ bg: 'primary.700' }}
                  _focus={{ boxShadow: 'none' }}
                  href="/finalizar-compra"
                >
                  Finalizar compra
                </Link>
              </Flex>
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
