import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import './App.css'
import { check } from './check'
import ExcelJS from 'exceljs'
import { Footer } from './components/Footer'

const toLetter = (num: number) => {
	const x = String.fromCodePoint(num + 'A'.codePointAt(0) - 1)

	return !/[^A-Z]/.test(x) ? x : 'A'
}

const toNumber = (str: string) => {
	const x = /\D/.test(str)
		? str.toUpperCase().codePointAt(0) - 'A'.codePointAt(0) + 1
		: Number(str)

	return isNaN(x) ? 1 : x
}

const init = {
	s: 9,
	t: 10,
	c: 11,
	cmtmp: 'Same as English: {{words}}',
	suf: '_untranslated_{{date}}',
}

const stored: typeof init = {
	...init,
	...JSON.parse(localStorage.getItem('form') ?? '{}'),
}

const suffixize = (filename: string, suffix: string) => {
	const [, pre, ext] = filename.match(/^(.+)(\.[^.]+)$/) ?? [
		null,
		filename,
		'',
	]

	return (
		pre +
		suffix.replace(
			'{{date}}',
			new Date().toISOString().replace(/\D/g, ''),
		) +
		ext
	)
}

const flattenRichText = (x: any) => {
	if (typeof x === 'string') {
		return x
	}

	if (x.richText) {
		return x.richText.map(({ text }) => text).join('')
	}

	return String(x)
}

const parseExcelFile = async (
	files: FileList,
	commentTemplate: string,
	suffix: string,
	cols: [number, number, number],
) => {
	if (!files.length) return

	const Col = {
		Src: cols[0],
		Trg: cols[1],
		Comments: cols[2],
	}

	for (const file of files) {
		const reader = new FileReader()

		reader.onloadend = (_event) => {
			const arrayBuffer = reader.result as ArrayBuffer

			const workbook = new ExcelJS.Workbook()

			workbook.xlsx.load(arrayBuffer).then(async (workbook) => {
				workbook.worksheets.forEach((sheet) => {
					sheet.eachRow((row, _rowNumber) => {
						const omitted = check(
							flattenRichText(row.values[Col.Src] ?? ''),
							flattenRichText(row.values[Col.Trg] ?? ''),
							flattenRichText(row.values[Col.Comments] ?? ''),
						)

						if (omitted.length) {
							row.getCell(Col.Comments).value = [
								row.values[Col.Comments],
								commentTemplate.replace(
									'{{words}}',
									omitted.map((x) => `“${x}”`).join(', '),
								),
							]
								.filter(Boolean)
								.join('\n---\n')
						}
					})
				})

				const buf = await workbook.xlsx.writeBuffer({})

				const a = document.createElement('a')
				const outFile = new Blob([buf], {
					type: 'image/jpeg',
				})
				a.href = URL.createObjectURL(outFile)
				a.download = suffixize(file.name, suffix)
				a.click()
			})
		}

		reader.readAsArrayBuffer(file)
	}
}

export const App = () => {
	const { register, watch, handleSubmit } = useForm()

	const changeHandler = (data: any) => {
		data = { ...data }

		data.s = toNumber(data.s)
		data.t = toNumber(data.t)
		data.c = toNumber(data.c)

		localStorage.setItem('form', JSON.stringify(data))
	}

	const commentTemplate: string = watch('cmtmp') ?? stored.cmtmp
	const filenameSuffix: string = watch('suf') ?? stored.suf

	const s: number = Number(toNumber(watch('s') ?? stored.s))
	const t: number = Number(toNumber(watch('t') ?? stored.t))
	const c: number = Number(toNumber(watch('c') ?? stored.c))

	const files: FileList = useMemo(
		() => watch('file') ?? ([] as any as FileList),
		[watch],
	)

	useEffect(() => {
		parseExcelFile(files, commentTemplate, filenameSuffix, [s, t, c])
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [files /* commentTemplate, filenameSuffix */])

	return (
		<>
			<main className='container'>
				<h1>Untranslated Detector</h1>

				<form onChange={handleSubmit(changeHandler)}>
					<label>
						Comments template
						<input
							name='cmtmp'
							defaultValue={stored.cmtmp}
							ref={register}
						/>
					</label>
					<br />
					<br />
					<label>
						Output filename suffix
						<input
							name='suf'
							defaultValue={stored.suf}
							ref={register}
						/>
					</label>
					<br />
					<br />
					<fieldset>
						<legend>Columns</legend>

						<label>
							Source column (eng)
							<input
								type='text'
								name='s'
								defaultValue={toLetter(
									typeof stored.s === 'number'
										? stored.s
										: toNumber(stored.s),
								)}
								ref={register}
							/>
						</label>
						<br />
						<label>
							Target column (e.g. th-rTH)
							<input
								type='text'
								name='t'
								defaultValue={toLetter(
									typeof stored.t === 'number'
										? stored.t
										: toNumber(stored.t),
								)}
								ref={register}
							/>
						</label>
						<br />
						<label>
							Comments column (for output)
							<input
								type='text'
								name='c'
								defaultValue={toLetter(
									typeof stored.c === 'number'
										? stored.c
										: toNumber(stored.c),
								)}
								ref={register}
							/>
						</label>
					</fieldset>

					<br />
					<br />
					<label>
						Upload file (XLSX)
						<input
							type='file'
							name='file'
							multiple
							ref={register}
						/>
					</label>
				</form>
			</main>

			<Footer className='container' />
		</>
	)
}
