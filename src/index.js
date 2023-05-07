//index.js
// importing the react and react-dom package

import React from 'react'
import ReactDOM from 'react-dom'
import './style.css'
import './index.css'
import App from './App'

const rootElement = document.querySelector('#root')
ReactDOM.render(<App />, rootElement)