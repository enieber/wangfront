import {
  Box,
  Button,
  Container,
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useMediaQuery,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  MenuButton,
  Menu,
  MenuItem,
  MenuList,
  Skeleton,
} from '@chakra-ui/react';
import { FaRegHeart, FaRegUser, FaRegUserCircle } from 'react-icons/fa';
import { FiInfo, FiSearch } from 'react-icons/fi';
import { BsGridFill } from 'react-icons/bs';
import { useContext } from 'react';
import { BiSupport, BiMenu } from 'react-icons/bi';
import { LegacyRef, RefObject, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import QuickCart from '../Cart/QuickCart';
import { useAuth } from '../../context/AuthContext';


export default function Header({ menus, userServer }: any) {  
  const { login, logout, user, setUser, isLoading, aboutMe } = useAuth();
  const [mobile] = useMediaQuery('(max-width: 400px)');

  useEffect(() => {
    if (!userServer) {
      aboutMe()
    } else {
      setUser(userServer)
    }
  }, [])
  
  return (
    <Flex as={'header'} direction={'column'} w={'full'}>
      {!!mobile && <MenuMobile menuItems={menus} login={login} user={user} isLoading={isLoading} />}
      {!mobile && <PrimaryMenu menuItems={menus} login={login} logout={logout} user={user} isLoading={isLoading} />}

      {!mobile && <SecondaryMenu menuItems={menus} login={login} logout={logout} user={user} isLoading={isLoading} />}
    </Flex>
  );
}

interface MenuProps {
  menuItems: Array<any>;
  login: any;
  user: any;
  isLoading: boolean;
  logout?: any;
}

const MenuMobile = (props: MenuProps) => {
  const { menuItems, login, user, isLoading, logout } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<LegacyRef<HTMLButtonElement>>();

  const [search, setSearch] = useState('');

  const router = useRouter();

  const handleSearch = () => {
    router.push('/busca?q=' + search);
  };
  const handleGoToLogin = () => {
    router.push('/conta/login');
  };

  return (
    <Flex my={2}>
      <BiMenu onClick={onOpen} fontSize={'38px'} fontWeight={'100'} />
      <Drawer isOpen={isOpen} placement="left" size={'xs'} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton right={'-35px'} bg={'white'} />
          <DrawerHeader borderBottomWidth="1px">
            <Flex>
              {user !== null ? (
                <Button
                  leftIcon={<FaRegUserCircle color="#2196f3" size={20} />}
                  fontWeight={'small'}
                  variant={'link'}
                  mr={5}
                  colorScheme="black"
                  _hover={{ underline: 'none', color: 'primary.700' }}
                >
                  {user.name.split(' ')[0]}
                </Button>
              ) : (
                <Button
                  leftIcon={<BsGridFill color="#2196f3" size={20} />}
                  fontWeight={'small'}
                  variant={'link'}
                  colorScheme="black"
                  _hover={{ underline: 'none', color: 'primary.700' }}
                >
                  Login
                </Button>
              )}
              <Button
                leftIcon={<BsGridFill color="#2196f3" size={20} />}
                fontWeight={'small'}
                variant={'link'}
                colorScheme="black"
                _hover={{ underline: 'none', color: 'primary.700' }}
              >
                Meus pedidos
              </Button>
            </Flex>
          </DrawerHeader>

          <DrawerBody px={0}>
            <Flex direction={'column'}>
              <Text
                bg={'primary.500'}
                color={'white'}
                fontSize={'sm'}
                w={'100%'}
                h={'40px'}
                px={3}
                py={2}
                fontWeight={'500'}
              >
                NAVEGUE PELA LOJA
              </Text>
              <Flex direction={'column'} mx={4} my={4}>
                <Text fontWeight={'600'} fontSize={'sm'}>
                  Categorias
                </Text>
                {menuItems && menuItems.map((item: any, index: number) => (
                  <Flex key={index} direction={'column'}>
                    <Link
                      key={index}
                      href={'/categoria/' + item.name.toLowerCase()}
                      fontSize={item.children.length >= 1 ? 'sm' : 'xs'}
                      fontWeight={item.children.length >= 1 ? '600' : '400'}
                      _hover={{ color: 'primary.600' }}
                      py={2}
                      px={3}
                    >
                      {item.name}
                    </Link>
                    {item.children.map((subItem: any, subIndex: number) => (
                      <Link
                        key={subIndex}
                        href={'/categoria/' + subItem.name.toLowerCase()}
                        fontSize={'xs'}
                        fontWeight={'400'}
                        _hover={{ color: 'primary.600' }}
                        py={2}
                        px={3}
                        ml={3}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </Flex>
                ))}
              </Flex>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Container maxW={'container.xl'}>
        <Flex direction={'row'} justify={'space-between'} align={'center'}>
          <Link href={'/'}>
            <Image w={100} src={'/logo.png'} alt={'Chakra UI Logo'} />
          </Link>
          <Flex justify={'flex-end'} gap={4} align={'center'}>
            <FaRegUserCircle onClick={() => handleGoToLogin()} size={24} />
            <FiSearch  size={24} />
            <QuickCart />
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
};

const PrimaryMenu = (props: MenuProps) => {
  const { menuItems, login, user, isLoading, logout } = props;
  
  const [search, setSearch] = useState('');
  
  const router = useRouter();
  const handleSearch = () => {
    router.push('/busca?q=' + search);
  };

  const handleGoToFavorites = () => {
    if (user) {
      router.push('/conta/favoritos');
    } else {
      router.push('/conta/login');
    }
  };

  if (isLoading || user == null) {
    return (
      <Flex w={'full'} px={8} py={4} align={'center'} borderBottom={'1px solid'} borderBottomColor={'gray.100'}>
        <Container maxW={'container.xl'}>
          <Flex justify={'space-between'} align={'center'}>
            <Link href={'/'}>
              <Image src={'/logo.png'} alt={'Chakra UI Logo'} />
            </Link>
            <Flex as="form">
              <InputGroup size="lg" bg="gray.100">
                <Input
                  placeholder="Olá, o que está procurando hoje?"
                  _focus={{
                    outerHeight: 'none',
                    borderColor: 'none',
                    boxShadow: 'none'
                  }}
                />
                <InputRightElement>
                  <Button size="sm" variant={'ghost'}>
                    <FiSearch />
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Flex>
            <Flex>
            <Popover trigger="hover">
                <PopoverTrigger>
                  <Button
                    leftIcon={<BiSupport size={25} />}
                    fontWeight={'normal'}
                    variant={'link'}
                    colorScheme="black"
                    _hover={{ underline: 'none', color: 'primary.600' }}
                  >
                    Atendimento
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody>
                    <Flex flexDir={'column'} p={4} textAlign={'center'}>
                      <Text fontWeight={'bold'}>E-mail</Text>
                      <Link href={`mailto:atendimento@toycity.com.br`} fontSize={'xs'} _hover={{ textDecoration: 'underline' }}>
                      <Text>atendimento@toycity.com.br</Text>
                    </Link>
                    </Flex>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Flex>
            <Flex>
            <Button
                leftIcon={<FaRegHeart size={25} />}
                fontWeight={'normal'}
                variant={'link'}
                colorScheme="black"
                _hover={{ underline: 'none', color: 'primary.600' }}
                onClick={() => handleGoToFavorites()}
              >
                Favoritos
              </Button>
            </Flex>
            <Flex gap={10}>
              <Link flexDirection={'row'} gap={2} display={'flex'} href={'/conta/login'}>
                <FaRegUserCircle size={25} />
                Login
              </Link>
            </Flex>
            <QuickCart />
          </Flex>
        </Container>
      </Flex>
    );
  }

  return (
    <Flex w={'full'} px={8} py={4} align={'center'} borderBottom={'1px solid'} borderBottomColor={'gray.100'}>
      <Container maxW={'container.xl'}>
        <Flex justify={'space-between'} align={'center'}>
          <Link href={'/'}>
            <Image src={'/logo.png'} alt={'Chakra UI Logo'} />
          </Link>
          <Flex as="form">
            <InputGroup size="lg" bg="gray.100">
              <Input
                placeholder="Olá, o que está procurando hoje?"
                _focus={{
                  outerHeight: 'none',
                  borderColor: 'none',
                  boxShadow: 'none'
                }}
                value={search}
                onChange={e => setSearch(e.target.value)}
              
              />
              <InputRightElement>
                <Button size="sm" onClick={handleSearch} variant={'ghost'}>
                  <FiSearch />
                </Button>
              </InputRightElement>
            </InputGroup>
          </Flex>
          <Flex gap={10}>
            <Box>
              <Popover trigger="hover">
                <PopoverTrigger>
                  <Button
                    leftIcon={<BiSupport size={25} />}
                    fontWeight={'normal'}
                    variant={'link'}
                    colorScheme="black"
                    _hover={{ underline: 'none', color: 'primary.600' }}
                  >
                    Atendimento
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody>
                    <Flex flexDir={'column'} p={4} textAlign={'center'}>
                      <Text fontWeight={'bold'}>E-mail</Text>
                      <Link href={`mailto:atendimento@toycity.com.br`} fontSize={'xs'} _hover={{ textDecoration: 'underline' }}>
                      <Text>atendimento@toycity.com.br</Text>
                    </Link>
                    </Flex>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Box>
            <Box>
              <Button
                leftIcon={<FaRegHeart size={25} />}
                fontWeight={'normal'}
                variant={'link'}
                colorScheme="black"
                _hover={{ underline: 'none', color: 'primary.600' }}
                onClick={() => handleGoToFavorites()}
              >
                Favoritos
              </Button>
            </Box>
            <Box>
              {user !== null ? (
                <Popover trigger="hover">
                  <PopoverTrigger>
                    <Button
                      leftIcon={<FaRegUserCircle size={25} />}
                      fontWeight={'normal'}
                      variant={'link'}
                      colorScheme="black"
                      _hover={{ underline: 'none', color: 'primary.600' }}
                    >
                      {user.name.split(' ')[0]}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent w="200px">
                    <PopoverArrow />
                    <PopoverBody>
                      <Flex flexDir={'column'} p={2} gap={3}>
                        <Link href="/conta" _hover={{ underline: 'none', color: 'primary.600' }}>
                          Minha Conta
                        </Link>
                        <Button
                          onClick={() => {
                            logout().then((res: any) => {
                              router.push('/');
                            });
                          }}
                        >
                          Sair
                        </Button>
                      </Flex>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              ) : (
                <Button
                  leftIcon={<FaRegUserCircle size={25} />}
                  fontWeight={'normal'}
                  variant={'link'}
                  colorScheme="black"
                  _hover={{ underline: 'none', color: 'primary.600' }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Flex>
          <QuickCart />
        </Flex>
      </Container>
    </Flex>
  );
};

const SecondaryMenu = (props: MenuProps) => {
  const { menuItems, login, user, isLoading } = props;
  const [itemHovered, setItemHovered] = useState<number | null>(null);
  const router = useRouter();

  const handleHover = (index: number) => {
    setItemHovered(index);
  };

  useEffect(() => {}, []);

  const navigateToCategory = (route: string) => {
    router.push(`/categoria/${route}`);
  };

  return (
    <Flex
      w={'full'}
      px={8}
      py={4}
      justify={'center'}
      align={'center'}
      borderBottom={'1px solid'}
      borderBottomColor={'gray.100'}
    >
      <Container maxW={'container.xl'}>
        <Flex justify={'center'} align={'center'}>
          {menuItems && menuItems.map((item: any, index: number) => (
            <Container key={index}>
              {item.children.length >= 1 ? (
                <Menu key={index}>
                  <MenuButton
                    fontSize={'sm'}
                    fontWeight={'bold'}
                    color={item == itemHovered ? 'gray.600' : 'gray.300'}
                    transition={'color 0.3s'}
                  >
                    {item.name}
                  </MenuButton>
                  <MenuList>
                    {item.children.map((subItem: any, subIndex: number) => (
                      <MenuItem
                        minH="48px"
                        key={subIndex}
                        onClick={() => navigateToCategory(subItem.name.toLowerCase())}
                      >
                        <Text
                          fontSize={'sm'}
                          fontWeight={'bold'}
                          color={itemHovered === null ? 'gray.600' : item === itemHovered ? 'gray.600' : 'gray.300'}
                          transition={'color 0.3s'}
                        >
                          {subItem.name}
                        </Text>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              ) : (
                <Link
                  key={index}
                  href={'/categoria/' + item.name.toLowerCase()}
                  _hover={{ textDecoration: 'none' }}
                  px={4}
                  onMouseEnter={() => handleHover(item)}
                  onMouseLeave={() => setItemHovered(null)}
                >
                  <Text
                    fontSize={'sm'}
                    fontWeight={'bold'}
                    color={itemHovered === null ? 'gray.600' : item === itemHovered ? 'gray.600' : 'gray.300'}
                    transition={'color 0.3s'}
                  >
                    {item.name}
                  </Text>
                </Link>
              )}
            </Container>
          ))}
          {menuItems && menuItems.length === 0 && <Skeleton height="20px" />}
        </Flex>
      </Container>
    </Flex>
  );
};
