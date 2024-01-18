import { DateTime } from 'luxon'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { chatContext } from '../App'
import { checkLocalStorage } from '../assets/constants'
import '../styles/MessagesList.css'
import { unseenMessage, user_type } from '../TypeScript/typesApp';
import AddButton from './AddButton'
import ChatCard from './ChatCard'
import HeaderMain from './HeaderMain'

const MessagesList = () => {
    const navigate = useNavigate()
    const { chats } = useContext(chatContext);
    if(!checkLocalStorage()) {
        navigate('/')
        return <></>
    }
    const userId = JSON.parse(localStorage.getItem('idWeText') || "");

    const convertTimeStamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const currentDate = new Date();

        // Extraer day, month and year of both date
        const messageDay = date.getDate();
        const messageMonth = date.getMonth();
        const messageYear = date.getFullYear();

        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const daysDifference = (currentYear - messageYear) * 365 + (currentMonth - messageMonth) * 30 + (currentDay - messageDay);

        if (daysDifference === 0) {
            return DateTime.fromISO(timestamp).toLocaleString(DateTime.TIME_SIMPLE);
        }
        if (daysDifference === 1) {
            return 'ayer'
        }
        const dateTime = DateTime.fromISO(timestamp);

        return dateTime.toFormat("MM-dd-yyyy");
    }

    return (
        <section className='message__list main__container'>
            <HeaderMain />
            <AddButton text={'Añadir usuario'} />
                {Object.keys(chats).length ? Object.keys(chats).map((key) => {
                    const chat = chats[key]
                    const {_id, users, updatedAt} = chat
                    const lastMessage = chat.lastMsg ? chat.lastMsg.content : false
                    //Just send message == object, otherwise string
                    let senderId = chat.lastMsg ? chat.lastMsg.sender : ''
                    senderId = typeof senderId === 'object' ? senderId._id : senderId
                    const friendData = users.filter((user: user_type) => user._id !== userId)
                    const {name, pictureUrl} = friendData[0]
                    //Ids of unseen messages
                    const unseen = chat.unseen
                    .filter((msg: unseenMessage) => msg.sender !== userId)
                    .map((msg: unseenMessage) => msg._id)
                    //Format time
                    const formattedTime = convertTimeStamp(updatedAt)
                        return (
                            <ChatCard key={`ChatCard-${_id}`} name={name} picture={pictureUrl} chatId={_id} lastMessage={lastMessage} unseen={unseen} hour={formattedTime} senderId={senderId} />
                        );
                }) : 'No hay chats'}
        </section>
    );
}

export default MessagesList;