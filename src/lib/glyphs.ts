/**
 * Arrows, pinned to text presentation.
 *
 * U+2192 and its relatives carry Unicode's Emoji property. None of the three self-hosted
 * families contains them, so iOS resolves the fallback to Apple Color Emoji and renders a
 * blue rounded square — which at the Interlude's display size arrived as a 9rem emoji tile
 * where a hairline arrow belonged. Desktop never showed it, because the desktop fallback
 * chain reaches a text font first.
 *
 * U+FE0E (VARIATION SELECTOR-15) requests text presentation explicitly and sends the
 * fallback to a text font on every platform. Both it and the arrows are written as escapes
 * rather than pasted characters: VS15 is invisible and zero-width, so in markup it is
 * impossible to see and trivial to drop during an edit.
 */
const TEXT = '\uFE0E'

export const ARROW_UP = `\u2191${TEXT}`
export const ARROW_DOWN = `\u2193${TEXT}`
export const ARROW_RIGHT = `\u2192${TEXT}`
export const ARROW_UP_RIGHT = `\u2197${TEXT}`
export const ARROW_BOTH_WAYS = `\u2194${TEXT}`
