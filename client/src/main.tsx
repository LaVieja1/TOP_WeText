import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Authentication from './components/Authentication'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Authentication />,
  },
  {
    path: '/chats',
    element: <App />
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
