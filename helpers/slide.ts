export function backIndex(length, index) {
 if (index == 0) {
  return length -1
 }

 return index -1 
}

export function nextIndex(length, index) {
  return (index + 1) % length
}


