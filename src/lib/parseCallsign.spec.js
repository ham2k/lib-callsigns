const { parseCallsign, processPrefix } = require("./parseCallsign")

describe("Callsign Parsing", () => {
  describe("processPrefix", () => {
    it("should parse a full callsign", () => {
      expect(processPrefix("N0CALL")).toEqual({
        prefix: "N0",
        ituPrefix: "N",
        digit: "0",
      })
    })

    it("should parse a lone prefix", () => {
      expect(processPrefix("N0")).toEqual({
        prefix: "N0",
        ituPrefix: "N",
        digit: "0",
      })
    })

    it("should parse a prefix without a digit", () => {
      expect(processPrefix("N")).toEqual({
        prefix: "N",
        ituPrefix: "N",
        digit: "",
      })
    })

    it("should ignore invalid prefixes", () => {
      expect(processPrefix("10N").prefix).toBe(undefined)
      expect(processPrefix("10N0").prefix).toBe(undefined)
    })

    it("should handle one character prefixes", () => {
      expect(processPrefix("K1")).toEqual({
        prefix: "K1",
        ituPrefix: "K",
        digit: "1",
      })
      expect(processPrefix("M5UK")).toEqual({
        prefix: "M5",
        ituPrefix: "M",
        digit: "5",
      })
    })

    it("should handle two character prefixes", () => {
      expect(processPrefix("KD2")).toEqual({
        prefix: "KD2",
        ituPrefix: "KD",
        digit: "2",
      })
      expect(processPrefix("AA2AA")).toEqual({
        prefix: "AA2",
        ituPrefix: "AA",
        digit: "2",
      })
      expect(processPrefix("YV5BCS")).toEqual({
        prefix: "YV5",
        ituPrefix: "YV",
        digit: "5",
      })
      expect(processPrefix("4U1U")).toEqual({
        prefix: "4U1",
        ituPrefix: "4U",
        digit: "1",
      })
    })

    it("should handle two character prefixes ending in digits", () => {
      expect(processPrefix("V33")).toEqual({
        prefix: "V33",
        ituPrefix: "V3",
        digit: "3",
      })
      expect(processPrefix("V33XX")).toEqual({
        prefix: "V33",
        ituPrefix: "V3",
        digit: "3",
      })
    })

    it("should handle two character prefixes ending in digits and no separator digit", () => {
      expect(processPrefix("V3XX")).toEqual({
        prefix: "V3",
        ituPrefix: "V3",
        digit: "",
      })
      expect(processPrefix("D9K")).toEqual({
        prefix: "D9",
        ituPrefix: "D9",
        digit: "",
      })
    })

    it("should handle three character prefixes", () => {
      expect(processPrefix("3DA1A")).toEqual({
        prefix: "3DA1",
        ituPrefix: "3DA",
        digit: "1",
      })
      expect(processPrefix("5UA99WS")).toEqual({
        prefix: "5UA9",
        extendedPrefix: "5UA99",
        ituPrefix: "5UA",
        digit: "9",
      })
    })

    it("should handle the special case of Fiji using 3D2 as a prefix", () => {
      expect(processPrefix("3D2A")).toEqual({
        prefix: "3D2",
        ituPrefix: "3D2",
        digit: "",
      })
    })
  })

  describe("parseCallsign", () => {
    it("should recognize simple callsigns", () => {
      expect(parseCallsign("N0CALL")).toEqual({
        call: "N0CALL",
        baseCall: "N0CALL",
        prefix: "N0",
        ituPrefix: "N",
        digit: "0",
      })
    })

    it("should recognize prefix indicators with zone numbers", () => {
      expect(parseCallsign("YV5/N0CALL")).toEqual({
        call: "YV5/N0CALL",
        baseCall: "N0CALL",
        prefix: "YV5",
        ituPrefix: "YV",
        digit: "5",
        preindicator: "YV5",
      })
      expect(parseCallsign("V5/N0CALL")).toEqual({
        call: "V5/N0CALL",
        baseCall: "N0CALL",
        prefix: "V5",
        ituPrefix: "V5",
        digit: "",
        preindicator: "V5",
      })
      expect(parseCallsign("9A5/N0CALL")).toEqual({
        call: "9A5/N0CALL",
        baseCall: "N0CALL",
        prefix: "9A5",
        ituPrefix: "9A",
        digit: "5",
        preindicator: "9A5",
      })
    })

    it("should recognize prefix indicators without digits", () => {
      expect(parseCallsign("YV/N0CALL")).toEqual({
        call: "YV/N0CALL",
        baseCall: "N0CALL",
        prefix: "YV",
        ituPrefix: "YV",
        digit: "",
        preindicator: "YV",
        postmodifier: undefined,
      })
    })

    it("should recognize US & Canada suffix indicators", () => {
      // Only the US, Canada & Peru use callsign suffixes (AFAIK), because:
      // * the baseCall is using their license in another other country,
      // * they are operating from a different area denoted not only by zone number, like Alaska, Hawaii, or Yukon

      expect(parseCallsign("N0CALL/KH6")).toEqual({
        call: "N0CALL/KH6",
        baseCall: "N0CALL",
        prefix: "KH6",
        digit: "6",
        ituPrefix: "KH",
        postindicators: ["KH6"],
      })

      expect(parseCallsign("N0CALL/KL")).toEqual({
        call: "N0CALL/KL",
        baseCall: "N0CALL",
        prefix: "KL",
        ituPrefix: "KL",
        digit: "",
        postindicators: ["KL"],
      })

      expect(parseCallsign("VE0CALL/K6")).toEqual({
        call: "VE0CALL/K6",
        baseCall: "VE0CALL",
        prefix: "K6",
        ituPrefix: "K",
        digit: "6",
        postindicators: ["K6"],
      })

      expect(parseCallsign("K0CALL/CY")).toEqual({
        call: "K0CALL/CY",
        baseCall: "K0CALL",
        prefix: "CY",
        ituPrefix: "CY",
        digit: "",
        postindicators: ["CY"],
      })

      expect(parseCallsign("K0CALL/VE")).toEqual({
        call: "K0CALL/VE",
        baseCall: "K0CALL",
        prefix: "VE",
        ituPrefix: "VE",
        digit: "",
        postindicators: ["VE"],
      })

      expect(parseCallsign("K0CALL/VE5")).toEqual({
        call: "K0CALL/VE5",
        baseCall: "K0CALL",
        prefix: "VE5",
        ituPrefix: "VE",
        digit: "5",
        postindicators: ["VE5"],
      })

      expect(parseCallsign("VE2CALL/VY0")).toEqual({
        call: "VE2CALL/VY0",
        baseCall: "VE2CALL",
        prefix: "VY0",
        ituPrefix: "VY",
        digit: "0",
        postindicators: ["VY0"],
      })
    })

    it("should recognize postfixed prefixes for countries that require them, such as Peru or Bermuda", () => {
      expect(parseCallsign("N0CALL/OA")).toEqual({
        call: "N0CALL/OA",
        baseCall: "N0CALL",
        prefix: "OA",
        digit: "",
        ituPrefix: "OA",
        postindicators: ["OA"],
      })

      expect(parseCallsign("N0CALL/VP9")).toEqual({
        call: "N0CALL/VP9",
        baseCall: "N0CALL",
        prefix: "VP9",
        digit: "9",
        ituPrefix: "VP",
        postindicators: ["VP9"],
      })
    })

    it("should recognize prefixes that end in digits and then are followed by the separator digit", () => {
      expect(parseCallsign("V67C")).toEqual({
        call: "V67C",
        baseCall: "V67C",
        prefix: "V67",
        ituPrefix: "V6",
        digit: "7",
      })
    })

    it("should recognize prefixes with trailing digits and modifier digits", () => {
      // Some would expect the country prefix to be V6 and the separator digit to be 9, so the resulting prefix should be V69
      // but this result is highly confusing for most baseCalls, so nobody should be using zone indicators
      // on prefixes with trailing numbers.

      expect(parseCallsign("V67C/9")).toEqual({
        call: "V67C/9",
        baseCall: "V67C",
        prefix: "V69",
        ituPrefix: "V6",
        digit: "9",
        postindicators: ["9"],
      })
    })

    it("should recognize suffix indicators", () => {
      expect(parseCallsign("N0CALL/P")).toEqual({
        call: "N0CALL/P",
        baseCall: "N0CALL",
        prefix: "N0",
        ituPrefix: "N",
        digit: "0",
        postindicators: ["P"],
        indicators: ["P"],
      })
    })

    it("should recognize suffix modifier with numbers alone", () => {
      expect(parseCallsign("N0CALL/1")).toEqual({
        call: "N0CALL/1",
        baseCall: "N0CALL",
        prefix: "N1",
        ituPrefix: "N",
        digit: "1",
        postindicators: ["1"],
      })
    })

    it("should recognize multiple suffix indicators", () => {
      expect(parseCallsign("N0CALL/1/QRP/P")).toEqual({
        call: "N0CALL/1/QRP/P",
        baseCall: "N0CALL",
        prefix: "N1",
        ituPrefix: "N",
        digit: "1",
        postindicators: ["1", "QRP", "P"],
        indicators: ["QRP", "P"],
      })

      expect(parseCallsign("N0CALL/QRP/1/P")).toEqual({
        call: "N0CALL/QRP/1/P",
        baseCall: "N0CALL",
        prefix: "N1",
        ituPrefix: "N",
        digit: "1",
        postindicators: ["QRP", "1", "P"],
        indicators: ["QRP", "P"],
      })
    })

    it("should handle bad suffix indicators for valid prefixes (should have been prefixes)", () => {
      expect(parseCallsign("N0CALL/YV")).toEqual({
        call: "N0CALL/YV",
        baseCall: "N0CALL",
        prefix: "YV",
        ituPrefix: "YV",
        digit: "",
        postindicators: ["YV"],
      })

      expect(parseCallsign("N0CALL/P/YV7")).toEqual({
        call: "N0CALL/P/YV7",
        baseCall: "N0CALL",
        prefix: "YV7",
        ituPrefix: "YV",
        digit: "7",
        postindicators: ["P", "YV7"],
        indicators: ["P"],
      })

      expect(parseCallsign("N0CALL/HK0")).toEqual({
        call: "N0CALL/HK0",
        baseCall: "N0CALL",
        prefix: "HK0",
        ituPrefix: "HK",
        digit: "0",
        postindicators: ["HK0"],
      })
    })

    it("should handle short calls with potential prefix/postfix confusion", () => {
      expect(parseCallsign("KH0/K0H")).toEqual({
        call: "KH0/K0H",
        baseCall: "K0H",
        prefix: "KH0",
        ituPrefix: "KH",
        digit: "0",
        preindicator: "KH0",
      })

      expect(parseCallsign("K0H/KH0")).toEqual({
        call: "K0H/KH0",
        baseCall: "K0H",
        prefix: "KH0",
        ituPrefix: "KH",
        digit: "0",
        postindicators: ["KH0"],
      })
    })

    it("should handle bad suffix indicators", () => {
      expect(parseCallsign("N0CALL/NA3")).toEqual({
        call: "N0CALL/NA3",
        baseCall: "N0CALL",
        prefix: "N0",
        ituPrefix: "N",
        digit: "0",
        postindicators: ["NA3"],
      })

      expect(parseCallsign("N0CALL/XX")).toEqual({
        call: "N0CALL/XX",
        baseCall: "N0CALL",
        prefix: "N0",
        ituPrefix: "N",
        digit: "0",
        postindicators: ["XX"],
      })
    })

    it("should recognize prefixed and suffixed indicators", () => {
      expect(parseCallsign("YV/N0CALL/P")).toEqual({
        call: "YV/N0CALL/P",
        baseCall: "N0CALL",
        prefix: "YV",
        ituPrefix: "YV",
        digit: "",
        preindicator: "YV",
        postindicators: ["P"],
        indicators: ["P"],
      })

      expect(parseCallsign("YV/N0CALL/P/7")).toEqual({
        call: "YV/N0CALL/P/7",
        baseCall: "N0CALL",
        prefix: "YV7",
        ituPrefix: "YV",
        digit: "7",
        preindicator: "YV",
        postindicators: ["P", "7"],
        indicators: ["P"],
      })

      expect(parseCallsign("YV7/N0CALL/P")).toEqual({
        call: "YV7/N0CALL/P",
        baseCall: "N0CALL",
        prefix: "YV7",
        ituPrefix: "YV",
        digit: "7",
        preindicator: "YV7",
        postindicators: ["P"],
        indicators: ["P"],
      })
    })

    it("should recognize bad callsigns", () => {
      expect(parseCallsign("N0")).toEqual({})
      expect(parseCallsign("N0")).toEqual({})
      expect(parseCallsign("0N")).toEqual({})
      expect(parseCallsign("10N")).toEqual({})
      expect(parseCallsign("10N0")).toEqual({})
      expect(parseCallsign("10N0N")).toEqual({})
      expect(parseCallsign("0N/KL7")).toEqual({})
      expect(parseCallsign("YV5/N0/KL7")).toEqual({})
    })

    it("accepts some callsigns that have trailing numbers", () => {
      // This is non-standard, but some countries have issued special callsigns in this format.
      expect(parseCallsign("VE1SPECIAL2000")).toEqual({
        call: "VE1SPECIAL2000",
        baseCall: "VE1SPECIAL2000",
        prefix: "VE1",
        ituPrefix: "VE",
        digit: "1",
      })

      expect(parseCallsign("9N4N100")).toEqual({
        call: "9N4N100",
        baseCall: "9N4N100",
        prefix: "9N4",
        ituPrefix: "9N",
        digit: "4",
      })

      expect(parseCallsign("9N4N0N0N0")).toEqual({
        call: "9N4N0N0N0",
        baseCall: "9N4N0N0N0",
        prefix: "9N4",
        ituPrefix: "9N",
        digit: "4",
      })

      expect(parseCallsign("3X2021")).toEqual({
        call: "3X2021",
        baseCall: "3X2021",
        extendedPrefix: "3X2021",
        prefix: "3X2",
        ituPrefix: "3X",
        digit: "2",
      })
    })

    it("should recognize all kinds of callsigns", () => {
      expect(parseCallsign("K2S")).toEqual({
        call: "K2S",
        baseCall: "K2S",
        prefix: "K2",
        ituPrefix: "K",
        digit: "2",
      })
      expect(parseCallsign("9A4Y")).toEqual({
        call: "9A4Y",
        baseCall: "9A4Y",
        prefix: "9A4",
        ituPrefix: "9A",
        digit: "4",
      })
      expect(parseCallsign("TM1NOCOVID")).toEqual({
        call: "TM1NOCOVID",
        baseCall: "TM1NOCOVID",
        prefix: "TM1",
        ituPrefix: "TM",
        digit: "1",
      })
      expect(parseCallsign("R1155RW")).toEqual({
        call: "R1155RW",
        baseCall: "R1155RW",
        extendedPrefix: "R1155",
        prefix: "R1",
        ituPrefix: "R",
        digit: "1",
      })
      expect(parseCallsign("TM40PARTY")).toEqual({
        call: "TM40PARTY",
        baseCall: "TM40PARTY",
        prefix: "TM4",
        extendedPrefix: "TM40",
        ituPrefix: "TM",
        digit: "4",
      })
      expect(parseCallsign("YV5/TM1NOCOVID")).toEqual({
        call: "YV5/TM1NOCOVID",
        baseCall: "TM1NOCOVID",
        prefix: "YV5",
        ituPrefix: "YV",
        digit: "5",
        preindicator: "YV5",
      })
    })

    it("should handle special exceptions (see README)", () => {
      expect(parseCallsign("D9K")).toEqual({
        call: "D9K",
        baseCall: "D9K",
        prefix: "D9",
        ituPrefix: "D9",
        digit: "",
      })

      expect(parseCallsign("H2T")).toEqual({
        call: "H2T",
        baseCall: "H2T",
        prefix: "H2",
        ituPrefix: "H2",
        digit: "",
      })

      expect(parseCallsign("C6AFO")).toEqual({
        call: "C6AFO",
        baseCall: "C6AFO",
        prefix: "C6",
        ituPrefix: "C6",
        digit: "",
      })

      expect(parseCallsign("5UAIHM")).toEqual({
        call: "5UAIHM",
        baseCall: "5UAIHM",
        prefix: "5UAIHM",
        ituPrefix: "5UAIHM",
        digit: "",
      })
    })
  })
})
