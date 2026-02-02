import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { FluentProvider, webDarkTheme } from '@fluentui/react-components'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/api'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FluentProvider theme={webDarkTheme}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </FluentProvider>
  </StrictMode>,
)
