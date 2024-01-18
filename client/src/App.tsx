import { createContext} from 'react'
import './App.css'
import { generalContext_type } from './TypeScript/typesApp';

export const generalContext = createContext<generalContext_type>({
  openChat: false,
  openSearch: false,
  socket: null,
  updateChats: false,
  isOpenForTheFirstTime: false,
  isDark: false,
  setIsDark: () => false,
  setIsOpenForTheFirstTime: () => false,
  setUpdateChats: () => false,
  setOpenSearch: () => false,
  setOpenChat: () => false,
});

function App() {

  return (
    <>
    </>
  )
}

export default App
