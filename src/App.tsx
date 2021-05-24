import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import './App.css'
import xlsx from 'xlsx'
import { check } from './check'
import { serializeCol } from './serializeCol'

const init = {
	sn: 'Sheet1',
	src: 'eng',
	trg: 'bn-rBD',
	cm: 'Note',
	cmtmp: 'Same as English: {{words}}',
}

const stored: typeof init =
	JSON.parse(localStorage.getItem('form') ?? 'null') ?? init

export const App = () => {
	const { register, watch, handleSubmit } = useForm()

	const changeHandler = (data: any) => {
		localStorage.setItem('form', JSON.stringify(data))
	}

	const sheetName: string = watch('sn') ?? stored.sn

	const srcColHeading: string = watch('src') ?? stored.src
	const trgColHeading: string = watch('trg') ?? stored.trg
	const commentsColHeading: string = watch('cm') ?? stored.cm

	const commentTemplate: string = watch('cmtmp') ?? stored.cmtmp

	const files: FileList = useMemo(
		() => watch('file') ?? ([] as any as FileList),
		[watch],
	)

	const [workbook, setWorkbook] = useState<xlsx.WorkBook | null>(null)

	useEffect(() => {
		if (!files.length) return

		const file = files[0]
		const reader = new FileReader()
		reader.onload = e => {
			const data = new Uint8Array(e.target.result as ArrayBuffer)
			const workbook = xlsx.read(data, { type: 'array' })

			setWorkbook(workbook)
		}

		reader.readAsArrayBuffer(file)
	}, [files])

	const rows = useMemo(() => {
		if (!workbook?.Sheets?.[sheetName]) {
			return []
		}

		const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {})

		return rows
	}, [workbook, sheetName]) as Record<string, string>[]

	const parsed = useMemo(() => {
		if (!workbook) {
			return new Error('Upload a file')
		}

		const cloned = JSON.parse(JSON.stringify(rows)) as typeof rows

		try {
			const headers = xlsx.utils.sheet_to_json(
				workbook.Sheets[sheetName],
				{ header: 1 },
			)[0] as string[]

			if (!headers?.length) {
				return new Error('Sheet not found or has no headers')
			}

			if (
				[srcColHeading, trgColHeading, commentsColHeading].some(
					name => !headers.includes(name),
				)
			) {
				return new Error('Not all headers found')
			}

			return cloned.map(row => {
				const omitted = check(
					row[srcColHeading] ?? '',
					row[trgColHeading] ?? '',
					row[commentsColHeading] ?? '',
				)

				if (omitted.length) {
					row[commentsColHeading] = [
						row[commentsColHeading],
						commentTemplate.replace(
							'{{words}}',
							omitted.map(x => `“${x}”`).join(', '),
						),
					]
						.filter(Boolean)
						.join('\n---\n')
				}

				return row
			})
		} catch (e) {
			console.error(e)

			return e as Error
		}
	}, [
		workbook,
		rows,
		srcColHeading,
		trgColHeading,
		commentsColHeading,
		commentTemplate,
		sheetName,
	])

	;(window as any).parsed = parsed

	return (
		<form onChange={handleSubmit(changeHandler)}>
			<label>
				Sheet name
				<input
					name='sn'
					defaultValue={stored.sn}
					ref={register}
				></input>
			</label>
			<br />
			<br />
			<label>
				Source col heading
				<input
					name='src'
					defaultValue={stored.src}
					ref={register}
				></input>
			</label>
			<br />
			<br />
			<label>
				Target col heading
				<input
					name='trg'
					defaultValue={stored.trg}
					ref={register}
				></input>
			</label>
			<br />
			<br />
			<label>
				Comments col heading
				<input
					name='cm'
					defaultValue={stored.cm}
					ref={register}
				></input>
			</label>
			<br />
			<br />
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
				Upload file (XLSX)
				<input type='file' name='file' ref={register} />
			</label>
			<br />
			<br />
			<hr />
			<br />
			{parsed instanceof Error ? (
				<strong>{parsed.message}</strong>
			) : (
				<textarea
					readOnly
					value={serializeCol([
						commentsColHeading,
						...parsed.map(p => p[commentsColHeading] ?? ''),
					])}
				/>
			)}
		</form>
	)
}
