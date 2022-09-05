import { FC, HtmlHTMLAttributes } from 'react'
import buildInfo from '../buildInfo.json'
// import { Tooltip } from './Tooltip'

const Tooltip: FC<{ title: string }> = ({ title, children }) => {
	return <span title={title}>{children}</span>
}

export const Footer: FC<HtmlHTMLAttributes<HTMLElement>> = ({
	...htmlProps
}) => {
	// just redirect for now

	return (
		<footer {...htmlProps}>
			<hr />
			<div className='footer-text'>
				<small>
					Version{' '}
					<Tooltip title={buildInfo.ts}>
						<code className='build-info'>{buildInfo.hash}</code>
					</Tooltip>
				</small>
			</div>
		</footer>
	)
}
