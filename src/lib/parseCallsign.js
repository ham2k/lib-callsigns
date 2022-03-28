const MODIFIER_REGEXP = /^([A-Z0-9]+\/){0,1}([0-9]{0,1}[A-Z]{1,2}[0-9]+[A-Z][A-Z0-9]*)(\/[A-Z0-9/]+){0,1}$/
const PREFIX_REGEXP = /^([0-9]{0,1}[A-Z]{1,2}[0-9]{0,1})([0-9]+)([A-Z0-9]*)$/
const NUMBERS_REGEXP = /^[0-9]+$/
const SUFFIXED_COUNTRY_REGEXP = /^([AKNW][LHP]|V[AEYO]|CY|K|W)[0-9]*$/
const QUALIFIER_REGEXP = /^(QRP|P|M|AM|MM|AE|AG|R)+$/

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

  const modifierParts = callsign.match(MODIFIER_REGEXP)
  if (modifierParts) {
    info.callsign = callsign

    if (modifierParts[1]) {
      info.premodifier = modifierParts[1].slice(0, modifierParts[1].length - 1)
    }

    if (modifierParts[3]) {
      info.postmodifiers = modifierParts[3].slice(1, modifierParts[3].length).split("/")
    }

    info.operator = modifierParts[2]

    let prefixLetters, prefixNumber

    if (info.premodifier) {
      // If YV5/N0CALL, then YV5 is the prefix
      const prefixParts = info.premodifier.match(PREFIX_REGEXP)
      prefixNumber = prefixParts && prefixParts[2] ? prefixParts[2] : "0"
      prefixLetters = prefixParts ? prefixParts[1] : info.premodifier
      info.prefix = prefixLetters + prefixNumber
    } else {
      const prefixParts = info.operator.match(PREFIX_REGEXP)
      if (prefixParts) {
        prefixLetters = prefixParts[1]
        prefixNumber = prefixParts[2]
        info.prefix = prefixLetters + prefixNumber
      }
    }

    for (const postmodifier of info.postmodifiers || []) {
      if (postmodifier.match(NUMBERS_REGEXP)) {
        // If N0CALL/1, parse prefix, but replace number
        prefixNumber = postmodifier
        info.prefix = prefixLetters + prefixNumber
      } else if (postmodifier.match(SUFFIXED_COUNTRY_REGEXP)) {
        // If N0CALL/KH6, use postmodifier as prefix
        const prefixParts = postmodifier.match(PREFIX_REGEXP)
        prefixLetters = prefixParts ? prefixParts[1] : postmodifier
        prefixNumber = prefixParts ? prefixParts[2] : "0"
        info.prefix = prefixLetters + prefixNumber
      } else if (postmodifier.match(QUALIFIER_REGEXP)) {
        // If N0CALL/P, parse prefix from plain callsign
        info.qualifiers = info.qualifiers || []
        info.qualifiers.push(postmodifier)
      }
    }
  }

  return info
}

module.exports = {
  parseCallsign,
}
