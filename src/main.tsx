
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SharedDataProvider } from './context/SharedDataContext.tsx'

createRoot(document.getElementById("root")!).render(
  <SharedDataProvider>
    <App />
  </SharedDataProvider>
);
