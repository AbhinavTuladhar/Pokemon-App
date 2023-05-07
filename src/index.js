//index.js
// importing the react and react-dom package

import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

const rootElement = document.querySelector('#root')
ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
, rootElement)
// ReactDOM.render(<App />, rootElement)