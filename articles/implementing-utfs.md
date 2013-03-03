## Case of mistaken encoding

### Preface
With the abstractions built into many modern programming langauges
it is rare we have to give much thought to character encodings. We
know they exist, most of us have some idea what they are about, and
so long as all the components in a system use the same encoding, 
things just work. 

Unfortunately at some point, things will go pear shaped, you will pass
some text through a component of your system and all of a sudden your 
accented e will turn into &#195;&#169;. When this happens, you can either
chock it down to corruption or recognize it for what it is, a simple
case of mistaken encoding.

Since the most popular encoding is UTF-8, it makes sense that we focus
on this encoding so you can see just how that é turned into a copyrighted
Ã.

### Unicode
Unicode is the standard used for representing most of the characters in the
world's writing systems. Each character is given a value, referred to as
a "code point", in the range of 0 - 1,114,111. When representing a code point
in memory, an encoding must be used and this is where UTF (UCS Transformation
Format) comes in.

### UTF-8

As defined in [RFC 3629](http://tools.ietf.org/html/rfc3629), the method
for encoding a code point as UTF-8 is as follows:

  1. Determine how many bytes will be required to store the code point. The
  simple method is that if the code point value can be stored in 7-bits
  then 1 byte is required and can simply be used as is; 11-bits require 
  2 bytes; 16-bits require 3 and 21-bits, 4 bytes.

  2. Next step is to set the high-order bits of each byte, all bytes must
  have their higher-order bits set to 10xx xxxx, with the first byte having an
  additional MSB set for each byte thereafter. 110x xxxx for 2 byte sequences,
  1110 xxxx for 3 byte, and so on.

  3. Finally, we store the value of the code point in the remaining bits.

#### Implementation in Go

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

### Corruption 
So all this is pretty straight forward, but how did those "funny" characters
get into your text?

**Most likely, you're treating your UTF-8 encoded stream of characters as ASCII.**

You've told the system that the bytes [0xC3 0xA9] should be interpreted as 
two extended ASCII characters, not a single UTF-8 encoded sequence. This is an
easy mistake to make, during development you'll assume the stream is ASCII.
You'll do some tests, of course only in english, and everything will pass. It is
not until some joker decides to write 
