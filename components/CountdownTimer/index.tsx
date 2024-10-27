import { useEffect, useState } from 'react';
import { Box, Progress, Text } from '@chakra-ui/react';

const CountdownTimer = (props: any) => {
  const { action } = props;
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutos em segundos

  useEffect(() => {
    if (timeLeft <= 0) {
      action()
      return;
    }
    
    const interval = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Box textAlign="center" py={4}>
      <Text fontSize="2xl">
        {`Tempo restante: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
      </Text>
      <Progress value={(timeLeft / (5 * 60)) * 100} size="lg" colorScheme="teal" mt={4} />
    </Box>
  );
};

export default CountdownTimer;
