import { useContext, useState } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { chatContext, generalContext, messagesContext } from '../App'
import '../styles/Chat.css'
import Header from './chat/Header';
import Message from './chat/Message';
import MessageInput from './chat/MessageInput';
import { DateTime } from 'luxon';
import { checkLocalStorage, loadingParams } from '../assets/constants'
import Loading from './Loading'
import ImagePreview from './chat/ImagePreview';
import { useNavigate } from 'react-router-dom'
import EmptyChat from './chat/EmptyChat';

const Chat = () => {

    const [fileInputState, setFileInputState] = useState('');
    const [previewSource, setPreviewSource] = useState('');
    const [selectedFile, setSelectedFile] = useState<Blob | null>(null);

    const navigate = useNavigate()
    const { chatData } = useContext(chatContext);
    const { messages } = useContext(messagesContext)
    const { openChat, isOpenForTheFirstTime } = useContext(generalContext)
    if(!checkLocalStorage()) {
        navigate('/')
        return <></>
    }
    const userId = JSON.parse(localStorage.getItem('idWeText') || "");

    const isLoading = messages.length && messages[0].sender._id === '';
    const isEmpty = chatData.id === '' && isOpenForTheFirstTime

    const LoadingSection = () =>
        loadingParams.map((params, index) => {
            return(
                <Loading {...params} key={index}/>
            );
        })

    const messagesSection = () =>
        <ScrollableFeed>
            {messages.length ? messages.map(({sender, content, createdAt, _id, image}) => {
                const formattedTime = DateTime.fromISO(createdAt).toLocaleString(DateTime.TIME_SIMPLE);
                return(
                    <Message owner={userId === sender._id} hour={formattedTime} content={content} key={_id} image={image} />
                )
            }) : ''}
        </ScrollableFeed>

    const MessageInputProps = {fileInputState, previewSource, selectedFile, setFileInputState, setPreviewSource, setSelectedFile, chatId: chatData.id }

    return (
        <div className={`chat__container ${openChat && 'show-chat'}`}>
            {isEmpty ? <EmptyChat />
            : <>
                <Header />
                <ImagePreview previewSource={previewSource} setPreviewSource={setPreviewSource} setSelectedFile={setSelectedFile} setFileInputState={setFileInputState}/>
                {isLoading ? <div className='loading__container'>{LoadingSection()}</div> : messagesSection()}
                <MessageInput {...MessageInputProps}/>
            </>}
        </div>
    );
}

export default Chat;