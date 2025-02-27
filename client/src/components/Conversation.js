import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import {io} from "socket.io-client";

const socket = io("http://localhost:5555", {
    transports: ["websocket"],
  });


function Conversation({user}) {

    const { otherId } = useParams();
    const userId = user.id;
    const [messages, setMessages] = useState([]);
    const [messageContent, setMessageContent] = useState('');

    useEffect(() => {
        fetch('/messages')
        .then((r) => r.json())
        .then((messageData) => {
            const relevantMessages = []
            messageData.forEach((message) => {
                if (
                    (message.recipient_id === userId || message.sender_id === userId) &&
                    (message.recipient_id === parseInt(otherId) || message.sender_id === parseInt(otherId))
                ) {relevantMessages.push(message)}
            });
            relevantMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            setMessages(relevantMessages)
        });

        socket.on('message', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            socket.off('message');
        };

    }, [userId, otherId]);


    const handleSendMessage = (e) => {
        e.preventDefault();

        if (messageContent.trim()) {
            const newMessage = {
                sender_id: userId,
                recipient_id: parseInt(otherId),
                content: messageContent,
                timestamp: '',
                sender: user
            };
            console.log(newMessage)

            socket.emit('message', newMessage);

            setMessages((prevMessages) => [...prevMessages, newMessage]);
            
            setMessageContent('');
        }
    };


    return (
        <div>
            {messages.map((message) => (
                <div key={message.id}>
                    {message.timestamp} {message.sender.username}: {message.content}
                </div>
            ))}
            <form onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Type a message"
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );


}

export default Conversation;