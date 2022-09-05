// used with `test` - can't use `g` flag or becomes stateful
const WORD_REGEX = /([\p{Letter}\p{Mark}]+)/u

const STRIP_REGEX = /%\d\$\w|<[^>]+>/g
const EXCLUDE_REGEX = /[%${}[\]#:<>]/
const MIN_LENGTH_ANY_CASE = 2
const MIN_LENGTH_LOWER_CASE = 3

export function check(src: string, trg: string, comment: string) {
	const strippedSrc = src.replace(STRIP_REGEX, '\x1e') // record separator
	const strippedTrg = trg.replace(STRIP_REGEX, '\x1f') // unit separator
	// record separator and unit separator are arbitrary, but must
	// a) never be present in translatable content,
	// b) not match WORD_REGEX,
	// c) be different from each other to avoid false matches

	const srcSepsAndWords = strippedSrc.split(WORD_REGEX)

	const iter = srcSepsAndWords.entries()[Symbol.iterator]()

	let dupes: string[] = []

	while (true) {
		let n = iter.next()

		if (n.done) break

		const [idx, seg] = n.value

		if (idx % 2 === 0) {
			// is separator
			continue
		}

		if (strippedTrg.toLowerCase().includes(seg.toLowerCase())) {
			let strs = [seg]

			while (true) {
				n = iter.next()

				if (n.done) break

				// prettier-ignore
				const [/* idx */, nextSeg] = n.value;

				if (
					strippedTrg
						.toLowerCase()
						.includes((strs.join('') + nextSeg).toLowerCase())
				) {
					strs.push(nextSeg)
				} else {
					break
				}
			}

			let last = ''

			while (last === '') {
				last = strs.pop()
			}

			if (WORD_REGEX.test(last)) {
				strs.push(last)
			}

			dupes.push(strs.join(''))
		}
	}

	return [...new Set(dupes)].filter((dupe) => {
		const meetsMinLength =
			dupe.length >= MIN_LENGTH_LOWER_CASE ||
			(dupe !== dupe.toLowerCase() && dupe.length >= MIN_LENGTH_ANY_CASE)

		return (
			meetsMinLength &&
			!EXCLUDE_REGEX.test(dupe) &&
			!comment.includes(dupe)
		)
	})
}
