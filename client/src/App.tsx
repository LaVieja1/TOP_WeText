import { createContext} from 'react'
import './App.css'
import { chat, chatContext_types, chat_object, generalContext_type, message, messagesContext_type, unseenMessage } from './TypeScript/typesApp';

export const chatContext = createContext<chatContext_types>({
  chats: {
    users: [],
    lastMsg: { content: '' }
  },
  user: {
      image: '',
      name: '',
      _id: ''
  },
  chatData: {
      name: '',
      image: '',
      id: '',
  },
  setUser: () => false,
  setChatData: () => false,
  setChats: () => { },
});

export const messagesContext = createContext<messagesContext_type>({
  messages: [],
  idUnseenMessages: [],
  setIdUnseenMessages: () => [],
  setMessages: () => [],
});

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
