import { Box, IconButton, Flex } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import React from 'react';
import { nextIndex, backIndex } from '../../helpers/slide';

function SampleNextArrow(props: any) {
  const { onClick } = props;

  return (
    <IconButton
      aria-label="Próximo"
      icon={<FiChevronRight color="#000" />}
      onClick={onClick}
      position={'absolute'}
      bottom="50%"
      right="5px"
      width="40px"
      height="40px"
      bg="#fff"
      border="1px solid"
      borderColor="gray.400"
      cursor="pointer"
      borderRadius="full"
      fontSize="1.5rem"
      zIndex={1}
    />
  );
}

function SamplePrevArrow(props: any) {
  const { onClick } = props;

  return (
    <IconButton
      aria-label="Anterior"
      icon={<FiChevronLeft color="#000" />}
      onClick={onClick}
      position={'absolute'}
      bottom="50%"
      left="5px"
      width="40px"
      height="40px"
      bg="#fff"
      border="1px solid"
      borderColor="gray.400"
      cursor="pointer"
      borderRadius="full"
      fontSize="1.5rem"
      zIndex={1}
    />
  );
}

export default function Carousel(props: any) {
  const { Render } = props;
  // Controle de navegação
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [slides, setSlides] = React.useState({
    a: backIndex(props.items.length, 1),
    b: backIndex(props.items.length, 2),
    c: backIndex(props.items.length, 3),
    d: backIndex(props.items.length, 4),
  })

  const nextSlide = () => {
    setSlides({
      a: nextIndex(props.items.length, slides.a),
      b: nextIndex(props.items.length, slides.b),
      c: nextIndex(props.items.length, slides.c),
      d: nextIndex(props.items.length, slides.d),
    });

    setCurrentIndex((prevIndex) => {
      return (prevIndex + 1) % props.items.length
    });
  };

  const prevSlide = () => {
    setSlides({
      a: backIndex(props.items.length, slides.a),
      b: backIndex(props.items.length, slides.b),
      c: backIndex(props.items.length, slides.c),
      d: backIndex(props.items.length, slides.d),
    });

    setCurrentIndex((prevIndex) => {
      return (prevIndex === 0 ? props.items.length - 1 : prevIndex - 1)
    });
  };

  if (props.full) {
    return (
      <Flex direction="row" align="center" justify="center" position="relative" width="full" overflow="hidden">
        <SamplePrevArrow onClick={prevSlide} />
              <Render key={props.items[currentIndex].id} {...props.items[currentIndex]} />
          <SampleNextArrow onClick={nextSlide} />
      </Flex>
    );

  }

  return (
    <Flex direction="row" align="center" justify="center" position="relative" width="full" overflow="hidden">
      <SamplePrevArrow onClick={prevSlide} />
            <Render key={props.items[slides.a].id} {...props.items[slides.a]} />
            <Render key={props.items[slides.b].id} {...props.items[slides.b]} />
            <Render key={props.items[slides.c].id} {...props.items[slides.c]} />
            {props.items[slides.d] && (<Render key={props.items[slides.d].id} {...props.items[slides.d]} />)}
        <SampleNextArrow onClick={nextSlide} />
    </Flex>
  );
};

