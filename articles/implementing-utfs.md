
1-6 octets (8 bits)

if rune < (1 << 7)    //Fits in 7 bits
  b[0] = rune

if rune < (1 << 11)   //Fits in 11 bits
  
  b[0] = '1100 0000' | (rune >> 6)
  b[0] = '1000 0000' | (rune & '0011 1111')


if rune < (1 << 16)   //Fits in 16 bits

if rune < (1 << 21)   //Fits in 21 bits
