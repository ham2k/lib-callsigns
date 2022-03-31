// Basic regexp that identifies a callsign and any pre- and post-modifiers.
const EXTENDED_CALLSIGN_REGEXP = /^([A-Z0-9]+\/){0,1}([0-9]{0,1}[A-Z]{1,2}[0-9]+[A-Z][A-Z0-9]*)(\/[A-Z0-9/]+){0,1}$/

/**
 * Parse a callsign into its component parts, including alternate prefixes and multiple postmodifiers.
 *
 * A callsign consists of a prefix, a suffix, and optionally, pre and post modifiers.
 *
 * The prefix is usually one or two letters followed by a digits, and it can also include a digit
 * before the first letter.
 *
 * The suffix is normally just letters, but some special callsigns can sometimes include numbers.
 *
 * The full callsign can include pre- and post-modifiers, separated by slashes, such as `YV5/N0CALL/P/QRP`
 *
 * It can only have a single pre-modifier, which acts as a replacement prefix (i.e. `YV5/N0CALL` would have a `YV5` prefix)
 *
 * It can have multiple post-modifiers, which can either:
 * - Replace the "zone number" in the prefix (i.e. `N0CALL/9` would have an `N9` prefix)
 * - For US and Canadian callsigns, provide an alternate prefix (i.e. `N0CALL/KL` would have an `KL0` prefix)
 * - Provide well-known qualifiers such as `/P` for "Portable", `/MM` for "Maritime Mobile" or `/R` for "Repeater"
 * - Any other reason, such as denoting operation from specific locations like `/A` for Mount Athos.
 *
 * This parsing function does not attempt to fully validate the callsign, because that would depend
 * on National regulations and customs. Some countries allow special callsigns with multiple digits, for example, while
 * others only allow a single digit. This function will not enforce those rules.
 *
 * Please see the companion tests for more details and examples.
 *
 * Returns an object with the following properties:
 * - `callsign`: the original callsign, including modifiers
 * - `operator`: the original callsign without any modifiers
 * - `prefix`: the prefix of the callsign, including any changes from modifiers
 * - `premodifier`: if present, any premodifier
 * - `postmodifiers`: if present, an array of postmodifiers
 * - `qualifiers`: if present, any well-known modifiers such as QRP, P, MM, etc.
 *
 * @param {string} callsign
 * @returns {object}
 */
function parseCallsign(callsign) {
  const info = {}
  callsign = callsign.trim().toUpperCase()

  const modifierParts = callsign.match(EXTENDED_CALLSIGN_REGEXP)
  if (modifierParts) {
    info.callsign = callsign

    if (modifierParts[1]) {
      info.premodifier = modifierParts[1].slice(0, modifierParts[1].length - 1)
    }

    if (modifierParts[3]) {
      info.postmodifiers = modifierParts[3].slice(1, modifierParts[3].length).split("/")
    }

    info.operator = modifierParts[2]

    processPrefix(info.premodifier || info.operator, info)

    for (const postmodifier of info.postmodifiers || []) {
      processPostModifier(postmodifier, info)
    }
  }

  return info
}

// Basic regexp that indentifies the prefix, digit and suffix parts of a callsign.
const PREFIX_REGEXP = /^([0-9]{0,1}[A-Z]{1,2})([0-9]{0,1})([0-9]{0,1})([A-Z0-9]*)$/

// Countries with prefixes that end in a digit
//   The only allocated prefixes that can have a single letter are: B (China), F (France), G (United Kingdom), I (Italy), K (USA), M (UK), N (USA), R (Russia) or W (USA)
//   Any other single letter prefix followed by a digit means the prefix includes the digit
//   Plus, Fiji uses 3D2
const TRAILING_DIGIT_PREFIXES_LOOKUP = {
  "3D": true,
  A: true,
  C: true,
  D: true,
  E: true,
  H: true,
  J: true,
  L: true,
  O: true,
  P: true,
  Q: true,
  S: true,
  T: true,
  U: true,
  V: true,
  X: true,
  Y: true,
  Z: true,
}

function processPrefix(callsign, info = {}) {
  const prefixParts = callsign.match(PREFIX_REGEXP)
  if (prefixParts) {
    info.ituPrefix = prefixParts[1]
    if (TRAILING_DIGIT_PREFIXES_LOOKUP[info.ituPrefix]) {
      info.ituPrefix = info.ituPrefix + prefixParts[2]
      info.digit = prefixParts[3] ? prefixParts[3] : ""
    } else {
      info.digit = prefixParts[2] ? prefixParts[2] : ""
    }

    // if (info.ituPrefix === "3D" && info.digit) {
    //   // Special case: Fiji uses 3D2 without a separator digit
    //   info.ituPrefix = info.ituPrefix + info.digit
    //   info.digit = prefixParts[3] ? prefixParts[3] : ""
    // }

    info.prefix = info.ituPrefix + info.digit
  }

  return info
}

// Regexp for digits
const DIGITS_REGEXP = /^[0-9]+$/

// Countries that allow postmodifiers to override the prefix
//   Includes US, Canada & Peru
const SUFFIXED_COUNTRY_REGEXP = /^([AKNW][LHP]|V[AEYO]|O[ABC]|CY|K|W|)[0-9]*$/

// List of well known postmodifier qualifiers
const QUALIFIER_REGEXP = /^(QRP|P|M|AM|MM|AE|AG|R)+$/

function processPostModifier(modifier, info = {}) {
  if (modifier.match(DIGITS_REGEXP)) {
    // If N0CALL/1, parse prefix from callsign, but replace number
    info.digit = modifier
    info.prefix = info.ituPrefix + info.digit
  } else if (modifier.match(SUFFIXED_COUNTRY_REGEXP)) {
    // If N0CALL/KH6, use modifier as prefix
    processPrefix(modifier, info)
  } else if (modifier.match(QUALIFIER_REGEXP)) {
    // List of well known qualifiers
    // If N0CALL/P, parse prefix from plain callsign
    info.qualifiers = info.qualifiers || []
    info.qualifiers.push(modifier)
  }

  return info
}

module.exports = {
  parseCallsign,
  processPrefix,
}
