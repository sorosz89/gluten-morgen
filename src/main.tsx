import { FluentProvider } from '@fluentui/react-components'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { zeroGlutenTheme } from './theme.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FluentProvider theme={zeroGlutenTheme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </FluentProvider>
  </StrictMode>,
)
