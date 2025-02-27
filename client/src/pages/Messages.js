import React, {useEffect, useState} from "react";
import { useHistory } from "react-router-dom";

function Messages({user}) {

    const [messages, setMessages] = useState([]);
    const navigate = useHistory();

    useEffect(() => {

        if (!user) return;
        const user_id = user.id;

        fetch('/messages')
        .then((r) => r.json())
        .then((messageData) => {
            const recentMessages = {};

            messageData.forEach((message) => {
                const otherUserId =
                    message.sender_id === user_id
                        ? message.recipient_id
                        : message.sender_id;
                if (
                    !recentMessages[otherUserId] ||
                    new Date(message.timestamp) > new Date(recentMessages[otherUserId].timestamp)
                ) {
                    recentMessages[otherUserId] = message;
                }
            });
            setMessages(Object.values(recentMessages));
        })
    }, [user]);

    if (!user) return <p>Loading messages...</p>;

    return (
        <div>
            {messages.map((message) => {
                const otherUserId =
                    message.sender_id === user.id
                        ? message.recipient_id
                        : message.sender_id;

                return (
                <div key={message.id} 
                onClick={() => navigate.push(`/conversation/${otherUserId}`)} 
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