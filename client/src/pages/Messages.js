import React, {useEffect, useState, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user";

function Messages() {

    const {user} = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [messageContent, setMessageContent] = useState('');
    const [recipient, setRecipient] = useState('');
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    useEffect(() => {

        if (user.message) {
            navigate('/');
            return;
        }

        fetch('/messages')
        .then((r) => r.json())
        .then((messageData) => {
            if (user.message) {
                navigate('/');
                return;
            }
            const recentMessages = {};

            messageData.forEach((message) => {
                const otherUserId =
                    message.sender.id === user.id
                        ? message.recipient.id
                        : message.sender.id;
                if (
                    !recentMessages[otherUserId] ||
                    new Date(message.timestamp) > new Date(recentMessages[otherUserId].timestamp)
                ) {
                    recentMessages[otherUserId] = message;
                }
            });
            setMessages(Object.values(recentMessages));
        })
    }, [user, navigate]);

    function handleSubmit(e) {
        e.preventDefault()
        const timestamp = new Date().toISOString();
        const messageData = {
            recipient,
            content: messageContent,
            sender_id: user.id,
            timestamp
        };
        if (messageData.content === '') {
            setMessage('Message cannot be blank, please try again')
            return
        }
        console.log(messageData)

        fetch('/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData),
        })
        .then((r) => r.json())
        .then((newMessage) => {
            setMessageContent('');
            setRecipient('');
            setMessage('');
            setMessages((prevMessages) => [newMessage, ...prevMessages])
        })      
        .catch((error) => {
            console.error("Error sending message:", error);
            setMessage('Recipient not found')
        })
    }

    if (!user) return <p>Loading messages...</p>;

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>New Message</h2>
                <label>Recipient:
                    <input 
                    type='text' 
                    id='recipient' 
                    name='recipient'
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    ></input>
                </label>
                <br/>
                <label>Message:
                    <input 
                    type='text' 
                    id='content' 
                    name='content'
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    ></input>
                </label>
                <p style={{color:'red'}}>{message}</p>
                <br/>
                <button type='submit'>Send</button>
            </form>
            <br/>
            <h2>Conversations</h2>
            {messages.map((message) => {
                return (
                <div key={message.id} 
                onClick={() => navigate(`/conversation/${message.sender.id === user.id ? message.recipient.id : message.sender.id}`)} 
                style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                    <p>From: {message.sender.username}</p>
                    <p>To: {message.recipient.username}</p>
                    <p>{message.content}</p>
                </div>    
                );
            })}
        </div>
    );
}

export default Messages;