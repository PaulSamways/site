### Preface
With the abstractions built into many modern programming langauges
it is rare we have to give much thought to character encodings. We
know they exist, most of us have some idea what they are about, and
so long as all the components in a system use the same encoding, 
things tend to 'just work'. 
...


### UTF-8

The most common format used in recent times is UTF-8, and as such, will
be the encoding that I implement.

#### Encoding

As defined in [RFC 3629](http://tools.ietf.org/html/rfc3629), the method
for encoding a character as UTF-8 is as follows:

  1. Determine how many bytes will be required to store the character,
  simple method is that if the character code can be stored in 7-bits
  then 1 byte is required and can simply be used as is; 11-bits require 
  2 bytes; 16-bits require 3 and 21-bits need 4 bytes.

  2. Next step is to set the high-order bits of each byte, all bytes must
  have their higher-order bits set to 10xx xxxx, with the first byte having an
  additional MSB set for each byte therafter. 110x xxxx for the 2 bytes,
  1110 xxxx for 3 bytes, and so on.

  3. Finally, the code point can be stored in the bytes, filling the bits
  from the LSB.

##### An example in Go

``` Go
func encode(r int32) []byte {
	switch {
	case r <= 0x7F:
		return []byte{byte(r)}

	case r <= 0x07FF:
		return []byte{
			byte(0xC0 | (r >> 6)),
			byte(0x80 | (r & 0x3F)),
		}
	case r <= 0x10FFFF:
		return []byte{
			byte(0xE0 | (r >> 12)),
			byte(0x80 | ((r >> 6) & 0x3F)),
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

As you can see, encoding Unicode code points to UTF-8 is quite easy.

#### Decoding

On the flip side of being able to encode a code point is being able to
decode a byte stream.


