import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { ToastContainer} from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/UserContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      
        <AuthProvider>
          <DataProvider>
        <ToastContainer
    position="top-center"
    autoClose={2000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick={false}
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="colored"
    
    />

    <App />
    </DataProvider>
       </AuthProvider>
    
  </StrictMode>,
)
