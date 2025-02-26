import React, {useEffect, useState} from "react";

function Messages() {

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetch('/messages')
        .then((r) => r.json())
        .then((messageData) => {setMessages(messageData)})
    }, []);

    return (
        <div>
          {messages.map((message) => (
              <div key={message.id}>
                <p>From: {message.sender.username}</p>
                <p>{message.content}</p>
              </div>    
            )
          )}
        </div>
    );
}

export default Messages;