### Preface
With the abstractions built into many modern programming langauges
it is rare we have to give much thought to character encodings. We
know they exist, most of us have some idea what they are about, and
so long as all the components in a system use the same encoding, 
things tend to 'just work'. 

...


### UTF-8

The most common format used in recent times is UTF-8, and as such, will
be the focus of this article.

#### Encoding

As defined in [RFC 3629](http://tools.ietf.org/html/rfc3629), the method
for encoding a character as UTF-8 is as follows:

  1. Determine how many bytes will be required to store the character,
  simple method is that if the character code can be stored in 7-bits
  then 1 byte is required and can simply be used as is; 11-bits require 
  2 bytes; 16-bits require 3 and 21-bits need 4 bytes.

  2. Next step is to set the high-order bits of each byte, all bytes 
  of a multi-byte character must have their.

``` Go
func encode(r int32) []byte {
	switch {
	case r <= 0x7F:                       // < 7-bits
		return []byte{byte(r)}              // use it as is, don't encode.

	case r <= 0x07FF:                     // < 11-bits
		return []byte{
			byte(0xC0 | (r >> 6)),            // 1100 0000 |   000 000x xxxx
			byte(0x80 | (r & 0x3F)),          // 1000 0000 | ( xxx xxxx xxxx & 0011 1111 )
		}
	case r <= 0x10FFFF:                   // < 16-bits
		return []byte{
			byte(0xE0 | (r >> 12)),           // 1110 0000 |   0000 0000 0000 xxxx
			byte(0x80 | ((r >> 6) & 0x3F)),   // 1000 0000 | ( 0000 0000 00xx xxxx
			byte(0x80 | (r & 0x3F)),
		}
	default:
		return []byte{
			byte(0xF0 | (r >> 18)),
			byte(0x80 | ((r >> 12) & 0x3F)),
			byte(0x80 | ((r >> 6) & 0x3F)),
			byte(0x80 | (r & 0x3F)),
		}
	}
	return []byte{}
}
```





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


