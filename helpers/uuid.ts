function generateUniqueNumber() {
  const timestamp = Date.now();

  const randomNum = Math.random() * 1000000;

  const uniqueNumber = Math.floor(timestamp + randomNum);

  return uniqueNumber;
}

function generateFixedLengthUniqueNumber(length: number) {
  const baseNumber = generateUniqueNumber();
  return baseNumber.toString().slice(0, length);
}

export default generateFixedLengthUniqueNumber;
