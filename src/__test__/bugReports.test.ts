import { check } from '../check'
import { bugReports } from './fixtures/bugReports'

const truncate = (len: number) => (str: string) =>
	str.slice(0, len) + (str.length > len ? '...' : '')
const toSingleLine = (str: string) => truncate(30)(str).replace(/\n/g, '\\n')

for (const { date, cases } of bugReports) {
	describe(date, () => {
		for (const { src, trg, expected } of cases) {
			it(`${expected.join(', ')} (${toSingleLine(src)})`, () => {
				expect(check(src, trg, '')).toStrictEqual(expected)
			})
		}
	})
}
