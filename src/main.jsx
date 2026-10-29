import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom' // 1. Cambiamos la importación

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './estilos.css'

import App from './App.jsx'
import { ReservasProvider } from './context/ReservasContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter> {/* 2. Cambiamos el componente aquí */}
      <ReservasProvider>
        <App />
      </ReservasProvider>
    </HashRouter>
  </React.StrictMode>
)