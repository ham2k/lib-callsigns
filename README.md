# Callsign structure

The best source of information is the [Wikipedia Article on Amateur radio call signs](https://en.wikipedia.org/wiki/Amateur_radio_call_signs)

## Basic rules

- An amateur operator's call sign is composed of a prefix, a separating numeral and a suffix.

- Call signs begin with a one- two- or three-character prefix chosen from a range assigned by the ITU to the amateur's country of operation

- Single letter prefixes: B (China), F (France), G (United Kingdom), I (Italy), K (USA), M (UK), N (USA), R (Russia) or W (USA)

- The jurisdiction then assigns a single digit (a numeral to separate prefix from suffix) as well as a suffix of from one to four characters (the last being a letter).

## Exceptions

### Callsigns with no separating numeral

- Korea has issued a special event callsign of D9K. The 'D9' is the ITU prefix for South Korea, so they have issued a call with no separating numeral.

- Bahamas issues call signs without a separating numeral. They are assigned the C6A–C6Z block, and the '6' is part of the 2-character prefix. Examples are as found on QRZ.COM (C6AFO, C6AGB, etc.).

- Cyprus has issued H2T as a special event call sign. Whereas Cyprus is assigned the H2A–H2Z block, there is then no numeral separator, just a one-letter suffix.

- Panama allows the use of "HP/" as a prefix when operating from a cruise ship registered in Panama, so again, a prefix without a numeral.

- Fiji and Swaziland are assigned 3DN–3DZ and 3DA–3DM respectively, so they should choose also the third character from the left to produce unique call signs, but in practise do not. Fiji has issued many call signs with a '3D' prefix and a '2' numeral separator. In theory this does not distinguish their call signs from Swaziland which is issued the 3DA–3DM block.

### Special Event callsigns

- Often have suffixes with more than four characters.

- There are special call signs that have no final letter. Country Files show AX2000 for Australia, for example, Wikipedia page mentions XE21 and VX7150

- Special callsigns celebrating King of Spain EF6, and King of Jordan, JY1, have no suffix.

## Modifiers

- CEPT signatory countries allow for licensed amateurs from one country to operate in another, and it requires the prefix of the country being visited to be added as premodifier. So `YV/N0CALL` is `N0CALL` operating from `YV`.

- Canada and Peru require the prefix of the area the operator is operating from to be included as a postmodifier. The US used to, and while it is no longer required, it is still common to use it.

- When a country's separating numeral denotes a geographic area within, an operator from one region operating in another region can affix a secondary suffix indicating so. For instance an amateur from Queensland, Australia, operating in Tasmania can sign as VK4xxx/7 or VK4xxx/VK7.

- Argentina uses the first letter of the suffix as a regional designator. And it allows a postmodifier letter to replace it. So `LU1NABC` is located in Santiago del Estero, and `LU5AXYZ` is located in Buenos Aires, but `LU5AXYZ/N` is operating from Santiago del Estero.

# CQ WPX

CQ Magazine has both contests and [awards](https://cq-amateur-radio.com/cq_awards/cq_wpx_awards/cq-wpx-award-rules-022017.pdf) that are based on callsign prefixes.

Their prefix rules are slightly different from ITU's. They include all separating numerals as part of the prefix, not just the first one.

And when a prefix is defined by a modifier but does not include a numeral, it defaults to 0.

# Other Links

https://www.itu.int/net/ITU-R/terrestrial/docs/fixedmobile/fxm-art19-sec3.pdf

> 19.67 Amateur and experimental stations
> 19.68 § 30 1)
> – one character (provided that it is the letter B, F, G, I, K, M, N, R or W) and a single digit (other than 0 or 1), followed by a group of not more than four characters, the last of which shall be a letter, or
> – two characters and a single digit (other than 0 or 1), followed by a group of not more than four characters, the last of which shall be a letter. (WRC-03)
> 9.68A 1A) On special occasions, for temporary use, administrations may authorize use of call signs with more than the four characters referred to in No. 19.68. (WRC-03)

> 19.68.1 In the case of half series (i.e. when the first two characters are allocated to more than one Member State), the first three characters are required for nationality identification. In such cases, the call sign shall consist of three characters followed by a single digit and a group of not more than three characters, the last of which shall be a letter. (WRC-07)

https://www.itu.int/en/ITU-R/terrestrial/fmd/Pages/call_sign_series.aspx

https://www.fcc.gov/wireless/bureau-divisions/mobility-division/amateur-radio-service/amateur-call-sign-systems

From https://ham.stackexchange.com/questions/1352/how-can-i-tell-if-a-call-sign-is-valid

https://www.country-files.com/

http://www.dxatlas.com/Dev/

> > > If you check out the resources provided by Alex Shovkoplyas, VE3NEA in http://www.dxatlas.com/Dev/ you will find a variety of examples of callsign parsing. His prefix list contains REGEX matches for each country, but be aware that he uses HIS OWN syntax for callsign matching:

> > > The 'Mask' field in PREFIX.LST is used for callsign resolution. The following meta symbols are used in the mask:

> > > '@' - any letter '#' - any digit '?' - any character (letter or digit) [AC] - A or C [A-C] - A, B, or C. [AC-E] - A, C, D, or E. '.' - no characters are allowed after this simbol. Example: '??#@@.' matches all calls with 2-letter suffixes.

> > > His symbols MUST be substituted for other types, to use the mask with other languages:Javascript, VB.Net, PHP, etc.
