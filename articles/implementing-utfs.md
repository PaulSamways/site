
1-6 octets (8 bits)

No encoding required for characters less then 7-bits (ASCII).

if rune < (1 << 7)    //Fits in 7 bits
  b[0] = rune

Now we need to work out how many bits are required to encode the 
character. This is done by

if rune < (1 << 11)   //Fits in 11 bits
  
  b[0] = '1100 0000' | (rune >> 6)
  b[0] = '1000 0000' | (rune & '0011 1111')

if rune < (1 << 16)   //Fits in 16 bits
  b[0] = '1110 0000' | (rune >> 12)
  b[1] = '1000 0000' | ((rune >> 6) & '0011 1111')
  b[2] = '1000 0000' | (rune & '0011 1111')

if rune < (1 << 21)   //Fits in 21 bits
  b[0] = '1111 0000' | (rune >> 18)                 // 3-bits available, place 3 MSBs into 1111 0xxx
  b[1] = '1000 0000' | ((rune >> 12) & '0011 1111') // 
  b[2] = '1000 0000' | ((rune > 6) & '0011 1111')   //
  b[3] = '1000 0000' | (rune & '0011 1111')         // 
