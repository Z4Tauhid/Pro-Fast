import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import Router from './Router/Router.jsx'
import App from './App.jsx'
import Aos from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
import AuthProvider from './Provider/AuthProvider.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


Aos.init()
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <QueryClientProvider client={queryClient}>

    <AuthProvider>

      <div className='font-urbanist'>
        <RouterProvider router={Router}></RouterProvider>
      </div>

    </AuthProvider>

    </QueryClientProvider>

    

    
    
  </StrictMode>,
)
