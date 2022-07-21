import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import './App.css'
import { check } from './check'
import ExcelJS from 'exceljs'

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
							row.values[Col.Src] ?? '',
							row.values[Col.Trg] ?? '',
							row.values[Col.Comments] ?? '',
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
		localStorage.setItem('form', JSON.stringify(data))
	}

	const commentTemplate: string = watch('cmtmp') ?? stored.cmtmp
	const filenameSuffix: string = watch('suf') ?? stored.suf

	const s: number = Number(watch('s') ?? stored.s)
	const t: number = Number(watch('t') ?? stored.t)
	const c: number = Number(watch('c') ?? stored.c)

	const files: FileList = useMemo(
		() => watch('file') ?? ([] as any as FileList),
		[watch],
	)

	useEffect(() => {
		parseExcelFile(files, commentTemplate, filenameSuffix, [s, t, c])
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [files /* commentTemplate, filenameSuffix */])

	return (
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
				<input name='suf' defaultValue={stored.suf} ref={register} />
			</label>
			<br />
			<br />
			<label>
				Column numbers
				<input
					type='number'
					name='s'
					defaultValue={stored.s}
					ref={register}
				/>
				<input
					type='number'
					name='t'
					defaultValue={stored.t}
					ref={register}
				/>
				<input
					type='number'
					name='c'
					defaultValue={stored.c}
					ref={register}
				/>
			</label>
			<br />
			<br />
			<label>
				Upload file (XLSX)
				<input type='file' name='file' multiple ref={register} />
			</label>
		</form>
	)
}
