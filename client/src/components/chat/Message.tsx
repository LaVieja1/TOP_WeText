/* eslint-disable @typescript-eslint/no-unused-vars */
import '../../styles/chat/Message.css';

const Message = ({ message = '', hour = '', owner = false, content = '', image = '' }) => {
    return (
        <div className={`message__container main__container ${owner ? 'right' : 'left'}`}>
            {image.length > 0 && <img src={image}></img>}
            <div>{content}</div>
            <div className='message_hour'>{hour}</div>
        </div>
    );
}

export default Message;