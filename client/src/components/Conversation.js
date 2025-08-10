import React, {useEffect, useState, useContext} from "react";
import { useParams, useNavigate } from "react-router-dom";
import {io} from "socket.io-client";
import { UserContext } from "../context/user";
import { BACKEND_URL } from '../config';

const socket = io("http://localhost:5555", {
    transports: ["websocket"],
  });


function Conversation() {
    
    const {user} = useContext(UserContext);
    const { otherId } = useParams();
    const [messages, setMessages] = useState([]);
    const [messageContent, setMessageContent] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        if (user.message) {
            navigate('/');
            return;
        }
        if (user.id && otherId) {
            fetch(`${BACKEND_URL}/messages`)
            .then((r) => r.json())
            .then((messageData) => {
                const relevantMessages = []
                messageData.forEach((message) => {
                    if (
                        (message.recipient.id === user.id || message.sender.id === user.id) &&
                        (message.recipient.id === parseInt(otherId) || message.sender.id === parseInt(otherId))
                    ) {relevantMessages.push(message)}
                });
                relevantMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                if (relevantMessages.length === 0) {
                    navigate('/messages')
                }
                setMessages(relevantMessages)
            });

            socket.on('message', (newMessage) => {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });

            return () => {
                socket.off('message');
            };
        };

        }, [user.id, otherId, navigate, user.message]);

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).replace(",", "");
    };


    const handleSendMessage = (e) => {
        e.preventDefault();

        if (messageContent.trim()) {
            const newMessage = {
                id: Date.now(), // Temporary ID
                sender_id: user.id,
                recipient_id: parseInt(otherId),
                content: messageContent,
                timestamp: new Date().toISOString(),
                sender: user
            };

            socket.emit('message', newMessage);
            
            setMessageContent('');
        }
    };


    return (
        <div>
            {messages.map((message) => (
                <div key={message.id}>
                    {formatTimestamp(message.timestamp)} {message.sender.username}: {message.content}
                </div>
            ))}
            <form onSubmit={handleSendMessage}>
                <input
                    type="text"
                    name="message"
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