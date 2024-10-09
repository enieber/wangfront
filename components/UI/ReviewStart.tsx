import React from 'react';
import ReactStars from 'react-rating-stars-component';
import generateFixedLengthUniqueNumber from '../../helpers/uuid';

export default function ReviewStars({
  count = 5,
  value,
  isHalf = true,
  size = 24,
  activeColor = '#ffd700',
  color = '#f0f0f0',
  edit = false
}) {
  return (
    <ReactStars
      key={generateFixedLengthUniqueNumber(10)}
      count={count}
      value={value}
      isHalf={isHalf}
      size={size}
      activeColor={activeColor}
      color={color}
      edit={edit}
    />
  );
}
