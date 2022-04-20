// Basic regexp that identifies a callsign and any pre- and post-indicators.
const EXTENDED_CALLSIGN_REGEXP = /^([A-Z0-9]+\/){0,1}([0-9]{0,1}[A-Z]{1,2}[0-9]+[A-Z][A-Z0-9]*)(\/[A-Z0-9/]+){0,1}$/

const VALID_CALLSIGN_REGEXP = /^(3D[0-9]|[0-9][A-Z][0-9]|[ACDEHJLOPQSTUVXYZ][0-9]|[A-Z]{1,2}[0-9])([A-Z0-9]+)/

/**
 * Parse a callsign into its component parts, including alternate prefixes and multiple indicators.
 *
 * A callsign consists of a prefix, a suffix, and optionally, pre and post indicators.
 *
 * The prefix is usually one or two letters followed by a digits, and it can also include a digit
 * before the first letter.
 *
 * The suffix is normally just letters, but some special callsigns can sometimes include numbers.
 *
 * The full callsign can include pre- and post-indicators, separated by slashes, such as `YV5/N0CALL/P/QRP`
 *
 * It can only have a single pre-modifier, which acts as a replacement prefix (i.e. `YV5/N0CALL` would have a `YV5` prefix)
 *
 * It can have multiple post-indicators, which can either:
 * - Replace the "zone number" in the prefix (i.e. `N0CALL/9` would have an `N9` prefix)
 * - For US and Canadian callsigns, provide an alternate prefix (i.e. `N0CALL/KL` would have an `KL0` prefix)
 * - Provide well-known indicators such as `/P` for "Portable", `/MM` for "Maritime Mobile" or `/R` for "Repeater"
 * - Any other reason, such as denoting operation from specific locations like `/A` for Mount Athos.
 *
 * This parsing function does not attempt to fully validate the callsign, because that would depend
 * on national regulations and usage customs.
 * Some countries allow special callsigns with multiple digits, for example, while
 * others only allow a single digit. This function will not enforce those rules.
 *
 * Please see the companion tests for more details and examples.
 *
 * Returns an object with the following properties:
 * - `call`: the original callsign, including indicators
 * - `baseCall`: the original callsign without any indicators
 * - `prefix`: the prefix of the callsign, including any changes from indicators
 * - `preindicator`: if present, any preindicator
 * - `postindicators`: if present, an array of postindicators
 * - `indicators`: if present, any well-known indicators such as QRP, P, MM, etc.
 *
 * @param {string} callsign
 * @returns {object}
 */
function parseCallsign(callsign, info = {}) {
  callsign = callsign.trim().toUpperCase()

  const callsignParts = callsign.match(EXTENDED_CALLSIGN_REGEXP)
  if (callsignParts) {
    info.call = callsign
    if (callsignParts[1]) {
      info.preindicator = callsignParts[1].slice(0, callsignParts[1].length - 1)
    }

    if (callsignParts[3]) {
      info.postindicators = callsignParts[3].slice(1, callsignParts[3].length).split("/")
    }

    if (callsignParts[2] && callsignParts[2].match(VALID_CALLSIGN_REGEXP)) {
      info.baseCall = callsignParts[2]

      processPrefix(info.preindicator || info.baseCall, info)

      for (const postindicator of info.postindicators || []) {
        processPostindicator(postindicator, info)
      }
    }
  }

  return info
}

// Basic regexp that indentifies the prefix, digit and suffix parts of a callsign.
// except for Eswatini that uses `3DA`
const PREFIX_REGEXP = /^(3D[A-Z0-9]|[0-9][A-Z]|[ACDEHJLOPQSTUVXYZ][0-9]|[A-Z]{1,2})([0-9]{0,1})([0-9]*)/

// Prefixes should be [letter], [letter letter], [digit letter] or [letter digit],
//
// Countries with prefixes that end in a digit
//   The only allocated prefixes that can have a single letter are:
//   B (China), F (France), G (United Kingdom), I (Italy), K (USA), M (UK), N (USA), R (Russia) or W (USA)
//
//   Any other single letter prefix followed by a digit means the prefix includes the digit
//
// Exceptions
//   Eswatini uses 3DA, a [digit letter letter] suffix

function processPrefix(callsign, info = {}) {
  const prefixParts = callsign.match(PREFIX_REGEXP)
  if (prefixParts) {
    info.ituPrefix = prefixParts[1]
    info.digit = prefixParts[2]
    info.prefix = info.ituPrefix + info.digit
    if (prefixParts[3]) info.extendedPrefix = info.prefix + prefixParts[3]
  }

  return info
}

// Regexp for digits
const DIGITS_REGEXP = /^[0-9]+$/

// Countries that allow/require postindicators to override the prefix
//   Includes US, Canada & Peru
const SUFFIXED_COUNTRY_REGEXP = /^([AKNW][LHPG]|V[AEYO]|O[ABC]|CY|K|W|)[0-9]*$/

// List of well known postmodifier indicators
const INDICATOR_REGEXP = /^(QRP|P|M|AM|MM|A[AGE]|KT|R)+$/
// Some of these (A[AGE]|KT) are defined by the FCC [here](from www.law.cornell.edu/cfr/text/47/97.119)

function processPostindicator(indicator, info = {}) {
  if (indicator.match(DIGITS_REGEXP)) {
    // If N0CALL/1, parse prefix from callsign, but replace number
    info.digit = indicator
    info.prefix = info.ituPrefix + info.digit
  } else if (indicator.match(SUFFIXED_COUNTRY_REGEXP)) {
    // If N0CALL/KH6, use indicator as prefix
    processPrefix(indicator, info)
  } else if (indicator.match(INDICATOR_REGEXP)) {
    // List of well known indicators
    // If N0CALL/P, parse prefix from plain callsign
    info.indicators = info.indicators || []
    info.indicators.push(indicator)
  }

  return info
}

module.exports = {
  parseCallsign,
  processPrefix,
}
