import {
  Box,
  Text,
  Image,
  Button,
  useClipboard,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { FaCopy } from "react-icons/fa";

export default function PaymentPix({ transaction, retry }: any) {
  const { hasCopied, onCopy } = useClipboard(transaction.Key);

  useEffect(() => {
    const fetchTransactionStatus = () => {
      retry();
    };

    // Configura o intervalo para chamar a função a cada 10 segundos
    const intervalId = setInterval(fetchTransactionStatus, 10000);

    // Limpa o intervalo ao desmontar o componente
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Flex justifyContent="center">
      <Box borderWidth="1px" borderRadius="md" p={4} maxW="md" boxShadow="sm">
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          {transaction.Message}
        </Text>
        <Box mb={4}>
          <Text fontWeight="bold">QR Code:</Text>
          <Image
            src={transaction.QrCode}
            w={500}
            h={500}
            alt="QR Code de pagamento"
          />
        </Box>
        <Text fontSize="sm" color="gray.600" mb={4}>
          {transaction.Description}
        </Text>
        <Box mb={4}>
          <Text fontWeight="bold">ID da Transação:</Text>
          <Text>{transaction.IdTransaction}</Text>
        </Box>
        <Box mb={4}>
          <Text fontWeight="bold">Status:</Text>
          <Text>
            {transaction.Status === "1" ? "Pendente" : "Outro Status"}
          </Text>
        </Box>
        <Box mb={4}>
          <Text fontWeight="bold">Código PIX:</Text>
          <Box display="flex" alignItems="center">
            <Text isTruncated maxW="80%">
              {transaction.Key}
            </Text>
            <Button onClick={onCopy} ml={2} size="sm" variant="ghost">
              <Icon as={FaCopy} mr={1} />
              {hasCopied ? "Copiado" : "Copiar"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}
