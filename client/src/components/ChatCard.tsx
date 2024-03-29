import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { chatContext, generalContext, messagesContext } from '../App';
import { API, checkLocalStorage, updateUnseenMessages } from "../assets/constants";
import '../styles/ChatCard.css';
import Contact from "./Contact";

interface ChatCard_props {
    picture: string,
    name: string,
    chatId: string,
    lastMessage: string | boolean,
    unseen: {_id: string, chat: string, sender: string}[],
    hour: string,
    senderId: string,
}

const ChatCard = ({picture, name, chatId, lastMessage, unseen, hour, senderId}: ChatCard_props) => {
    const { setChatData, setChats } = useContext(chatContext)
    const { setMessages, idUnseenMessages, setIdUnseenMessages } = useContext(messagesContext)
    const { setOpenChat, socket, setIsOpenForTheFirstTime } = useContext(generalContext)
    const userId = JSON.parse(localStorage.getItem('idWeText') || "");
    const isOwner = userId === senderId

    const navigate = useNavigate()

    const retrieveChatData = async() => {
        if (!socket) return;
        setIsOpenForTheFirstTime(false);
        setChats(prevChats => {
            const chat = {...prevChats[chatId]}
            const updatedChat = {...chat, unseen: []}
            return { ...prevChats, [chatId]: updatedChat }
        });
        setMessages([{
            sender: {
                _id: '',
                image: '',
                name: ''
            },
            chat: {
                _id: '',
                name: '',
                pictureUrl: ''
            },
            content: '',
            _id: '',
            createdAt: '',
            image: ''
        }]);
        setOpenChat(true);
        setChatData({image: picture, name, id: chatId})
        if(!checkLocalStorage()) {
            navigate('/')
            return undefined
        }
        const token = JSON.parse(localStorage.getItem('token') || '');
        if(idUnseenMessages.length){
            updateUnseenMessages(idUnseenMessages, setIdUnseenMessages, token);
        }
        const response = await fetch(`${API}/message/${chatId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({unseenMessages: unseen})
        });
        const messages = await response.json()
        if(!messages) {
            navigate('/')
            return;
        }
        setMessages(messages)
        socket.emit('join chat', chatId)
    }

    const LastMessage = () => {
        if(typeof lastMessage === 'string') {
            return (
                lastMessage.length
                ? lastMessage
                : <div><svg className='photo__msg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>image</title><path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" /></svg>Imagen</div>
            )
        }
        return ''
    }

    return (
        <div className='chat__card-container main__container' onClick={retrieveChatData}>
            <Contact picture={picture}/>
            <section className='chat__data'>
                <h3 className='chat__card-name'>{name}</h3>
                <div className="last-msg__container">
                    {isOwner && 'vos: '}{LastMessage()}
                </div>
            </section>
            <section className='chat__extra-data'>
                <span className='chat__hour'>{hour}</span>
                {unseen.length !== 0 && <div className='new__messages-number'>{unseen.length}</div>}
            </section>
        </div>
    );
}

export default ChatCard;