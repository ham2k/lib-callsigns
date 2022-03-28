const { parseCallsign } = require("./parseCallsign")

describe("parseCallsign", () => {
  it("should recognize simple callsigns", () => {
    expect(parseCallsign("N0CALL")).toEqual({
      callsign: "N0CALL",
      operator: "N0CALL",
      prefix: "N0",
    })
  })

  it("should recognize prefix modifiers with zone numbers", () => {
    expect(parseCallsign("YV5/N0CALL")).toEqual({
      callsign: "YV5/N0CALL",
      operator: "N0CALL",
      prefix: "YV5",
      premodifier: "YV5",
    })
    expect(parseCallsign("V5/N0CALL")).toEqual({
      callsign: "V5/N0CALL",
      operator: "N0CALL",
      prefix: "V5",
      premodifier: "V5",
    })
    expect(parseCallsign("9A5/N0CALL")).toEqual({
      callsign: "9A5/N0CALL",
      operator: "N0CALL",
      prefix: "9A5",
      premodifier: "9A5",
    })
  })

  it("should recognize prefix modifiers without zones", () => {
    expect(parseCallsign("YV/N0CALL")).toEqual({
      callsign: "YV/N0CALL",
      operator: "N0CALL",
      prefix: "YV0",
      premodifier: "YV",
      postmodifier: undefined,
    })
  })

  it("should recognize US & Canada suffix modifiers", () => {
    // Only the US & Canada use callsign suffixes (AFAIK), because:
    // * the operator is using their license in the other country,
    // * they are operating from a different area denoted not only by zone number, like Alaska, Hawaii, or Yukon

    expect(parseCallsign("N0CALL/KH6")).toEqual({
      callsign: "N0CALL/KH6",
      operator: "N0CALL",
      prefix: "KH6",
      postmodifiers: ["KH6"],
    })

    expect(parseCallsign("N0CALL/KH")).toEqual({
      callsign: "N0CALL/KH",
      operator: "N0CALL",
      prefix: "KH0",
      postmodifiers: ["KH"],
    })

    expect(parseCallsign("VE0CALL/K6")).toEqual({
      callsign: "VE0CALL/K6",
      operator: "VE0CALL",
      prefix: "K6",
      postmodifiers: ["K6"],
    })

    expect(parseCallsign("K0CALL/CY")).toEqual({
      callsign: "K0CALL/CY",
      operator: "K0CALL",
      prefix: "CY0",
      postmodifiers: ["CY"],
    })

    expect(parseCallsign("K0CALL/VE")).toEqual({
      callsign: "K0CALL/VE",
      operator: "K0CALL",
      prefix: "VE0",
      postmodifiers: ["VE"],
    })

    expect(parseCallsign("K0CALL/VE5")).toEqual({
      callsign: "K0CALL/VE5",
      operator: "K0CALL",
      prefix: "VE5",
      postmodifiers: ["VE5"],
    })

    expect(parseCallsign("VE2CALL/VY0")).toEqual({
      callsign: "VE2CALL/VY0",
      operator: "VE2CALL",
      prefix: "VY0",
      postmodifiers: ["VY0"],
    })
  })

  it("should recognize prefixes with numbers and zones", () => {
    expect(parseCallsign("V67C")).toEqual({
      callsign: "V67C",
      operator: "V67C",
      prefix: "V67",
    })
  })

  it("should recognize prefixes with numbers and zones and modifier zones", () => {
    expect(parseCallsign("V67C/9")).toEqual({
      callsign: "V67C/9",
      operator: "V67C",
      prefix: "V69",
      postmodifiers: ["9"],
    })
  })

  it("should recognize suffix qualifiers", () => {
    expect(parseCallsign("N0CALL/P")).toEqual({
      callsign: "N0CALL/P",
      operator: "N0CALL",
      prefix: "N0",
      postmodifiers: ["P"],
      qualifiers: ["P"],
    })
  })

  it("should recognize suffix modifier with numbers alone", () => {
    expect(parseCallsign("N0CALL/1")).toEqual({
      callsign: "N0CALL/1",
      operator: "N0CALL",
      prefix: "N1",
      postmodifiers: ["1"],
    })
  })

  it("should recognize multiple suffix modifiers", () => {
    expect(parseCallsign("N0CALL/1/QRP/P")).toEqual({
      callsign: "N0CALL/1/QRP/P",
      operator: "N0CALL",
      prefix: "N1",
      postmodifiers: ["1", "QRP", "P"],
      qualifiers: ["QRP", "P"],
    })
  })

  it("should handle bad suffix modifiers", () => {
    expect(parseCallsign("N0CALL/YV")).toEqual({
      callsign: "N0CALL/YV",
      operator: "N0CALL",
      prefix: "N0",
      postmodifiers: ["YV"],
    })
  })

  it("should recognize prefixed and suffixed modifiers", () => {
    expect(parseCallsign("YV/N0CALL/P")).toEqual({
      callsign: "YV/N0CALL/P",
      operator: "N0CALL",
      prefix: "YV0",
      premodifier: "YV",
      postmodifiers: ["P"],
      qualifiers: ["P"],
    })
  })

  it("should recognize bad callsigns", () => {
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
    expect(parseCallsign("VE1SPECIAL1000")).toEqual({
      callsign: "VE1SPECIAL1000",
      operator: "VE1SPECIAL1000",
      prefix: "VE1",
    })

    expect(parseCallsign("9N4N100")).toEqual({
      callsign: "9N4N100",
      operator: "9N4N100",
      prefix: "9N4",
    })

    expect(parseCallsign("9N4N0N0N0")).toEqual({
      callsign: "9N4N0N0N0",
      operator: "9N4N0N0N0",
      prefix: "9N4",
    })
  })

  it("should recognize all kinds of callsigns", () => {
    expect(parseCallsign("K2S")).toEqual({
      callsign: "K2S",
      operator: "K2S",
      prefix: "K2",
    })
    expect(parseCallsign("9A4Y")).toEqual({
      callsign: "9A4Y",
      operator: "9A4Y",
      prefix: "9A4",
    })
    expect(parseCallsign("TM1NOCOVID")).toEqual({
      callsign: "TM1NOCOVID",
      operator: "TM1NOCOVID",
      prefix: "TM1",
    })
    expect(parseCallsign("TM40PARTY")).toEqual({
      callsign: "TM40PARTY",
      operator: "TM40PARTY",
      prefix: "TM40",
    })
    expect(parseCallsign("YV5/TM1NOCOVID")).toEqual({
      callsign: "YV5/TM1NOCOVID",
      operator: "TM1NOCOVID",
      prefix: "YV5",
      premodifier: "YV5",
    })
  })
})
