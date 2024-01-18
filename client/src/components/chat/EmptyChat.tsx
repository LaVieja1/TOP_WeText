import '../../styles/chat/EmptyChat.css';
import messages from '../../assets/images/Messages.png';

const EmptyChat = () => {
    return (
        <div className='empty-chat__container'>
            <img src={messages} alt='' />
            Selecciona un chat para ver la conversación
        </div>
    );
}

export default EmptyChat;