export function backIndex(length: number, index: number) {
 if (index == 0) {
  return length -1
 }

 return index -1 
}

export function nextIndex(length: number, index: number) {
  return (index + 1) % length
}


