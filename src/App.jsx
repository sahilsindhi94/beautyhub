import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import AppRoutes from './routes/AppRoutes'
import AuthSync from './components/auth/AuthSync'
import { isClerkConfigured } from './auth/clerkConfig'

function App() {
  return (
    <BrowserRouter>
      {isClerkConfigured && <AuthSync />}
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
