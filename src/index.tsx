import React from 'react'
import ReactDOM from 'react-dom'
import 'chota/dist/chota.css' // can't use .min.css due to CRA transpiling bug
import './index.css'
import './styles/index.css'
import { App } from './App'

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root'),
)
