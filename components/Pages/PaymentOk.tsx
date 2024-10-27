import { Box, Text, Button, Icon, Flex } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';

const PaymentSuccess = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/conta');
  };

  return (
    <Flex justifyContent={"center"}>
    <Box 
      borderWidth="1px" 
      borderRadius="md" 
      p={6} 
      maxW="md" 
      textAlign="center" 
      boxShadow="sm" 
      bg="green.50"
    >
      <Icon as={CheckCircleIcon} boxSize={10} color="green.400" mb={4} />
      <Text fontSize="xl" fontWeight="bold" mb={2} color="green.700">
        Pagamento Realizado com Sucesso!
      </Text>
      <Text fontSize="md" color="gray.600" mb={6}>
        Seu pagamento foi confirmado. Agora você pode acessar sua conta para visualizar mais detalhes.
      </Text>
      <Button colorScheme="green" onClick={handleRedirect}>
        Ir para Minha Conta
      </Button>
    </Box>
    </Flex>
  );
};

export default PaymentSuccess;
