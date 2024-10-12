import { Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import ReviewStars from '../UI/ReviewStart';
import { BsHandThumbsUpFill } from 'react-icons/bs';

export default function ReviewCard({
  name,
  date,
  rating,
  comment,
  likes = 0
}: {
  key: number;
  name: string;
  date: string;
  rating: number;
  comment: string;
  likes?: number;
}) {
  const [data, setData] = useState(new Date(date).toLocaleDateString());
  const [liked, setLiked] = useState(false);
  const [like, setLike] = useState(likes);

  const handleLike = () => {
    console.log('like');
    if (!liked) {
      setLike(like + 1);
      setLiked(!liked);
    } else {
      setLike(like - 1);
      setLiked(!liked);
    }
  };
 
  return (
    <Flex direction="column" w={'full'} gap={2} mb={4} border={'1px'} borderColor={'gray.200'} p={4}>
      <Text>
        <Text fontWeight={'700'} color={'gray.600'} as="span">
          {name}
        </Text>{' '}
        - {data}
      </Text>
      <ReviewStars value={rating} size={20} />
      <Text>{comment}</Text>
      <Flex justifyItems={'center'} alignItems={'center'}>
        <Text mr={2}>Esta avaliação foi útil?</Text>
        <BsHandThumbsUpFill size={20} onClick={handleLike} color={liked ? 'black' : '#ddd'} />{' '}
        <Text ml={1}>{like}</Text>
      </Flex>
    </Flex>
  );
}
