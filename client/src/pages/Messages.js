import React, {useEffect, useState, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user";
import { BACKEND_URL } from '../config';
import io from 'socket.io-client';

function Messages() {

    const {user} = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [messageContent, setMessageContent] = useState('');
    const [recipient, setRecipient] = useState('');
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [pollingInterval, setPollingInterval] = useState(null);

    useEffect(() => {
        // Set up SocketIO connection with better error handling
        const newSocket = io(BACKEND_URL, {
            transports: ['polling'], // Use polling only
            timeout: 5000,
            forceNew: true
        });
        setSocket(newSocket);

        // Debug SocketIO connection
        newSocket.on('connect', () => {
            console.log('SocketIO connected:', newSocket.id);
        });

        newSocket.on('disconnect', (reason) => {
            console.log('SocketIO disconnected:', reason);
        });

        newSocket.on('connect_error', (error) => {
            console.warn('SocketIO connection failed, will use HTTP fallback:', error.message);
        });

        // Set a timeout to disable SocketIO if connection fails
        const connectionTimeout = setTimeout(() => {
            if (!newSocket.connected) {
                console.log('SocketIO connection timeout, starting HTTP polling fallback');
                newSocket.disconnect();
                setSocket(null);
                startHttpPolling();
            }
        }, 3000);

        // Listen for real-time messages
        newSocket.on('message', (messageData) => {
            console.log('📨 Received message via SocketIO:', messageData);
            console.log('👤 Current user ID:', user.id);
            console.log('🎯 Message involves user?', 
                messageData.sender.id === user.id || messageData.recipient_id === user.id);
            
            // Only update if this message involves the current user
            if (messageData.sender.id === user.id || messageData.recipient_id === user.id) {
                setMessages(prevMessages => {
                    console.log('📋 Updating message list, previous count:', prevMessages.length);
                    const recentMessages = {};
                    
                    // Add existing messages to recentMessages
                    prevMessages.forEach(msg => {
                        const otherUserId = msg.sender.id === user.id ? msg.recipient.id : msg.sender.id;
                        recentMessages[otherUserId] = msg;
                    });
                    
                    // Add new message
                    const otherUserId = messageData.sender.id === user.id ? messageData.recipient_id : messageData.sender.id;
                    recentMessages[otherUserId] = messageData;
                    
                    const newMessages = Object.values(recentMessages);
                    console.log('📋 New message list count:', newMessages.length);
                    return newMessages;
                });
            }
        });

        if (user.message) {
            navigate('/');
            return;
        }

        fetch(`${BACKEND_URL}/messages`, {
            credentials: 'include'
        })
        .then((r) => {
            if (!r.ok) {
                throw new Error(`HTTP error! status: ${r.status}`);
            }
            return r.json();
        })
        .then((messageData) => {
            if (user.message) {
                navigate('/');
                return;
            }
            const recentMessages = {};

            // Check if messageData is an array before using forEach
            if (Array.isArray(messageData)) {
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
            } else {
                console.error('Expected array of messages, got:', messageData);
                setMessages([]);
            }
        })
        .catch((error) => {
            console.error('Error fetching messages:', error);
            setMessages([]);
        });

        // Start HTTP polling if SocketIO fails completely
        const startHttpPolling = () => {
            console.log('🔄 Starting HTTP polling for real-time updates');
            const interval = setInterval(() => {
                fetch(`${BACKEND_URL}/messages`, {
                    credentials: 'include'
                })
                .then((r) => {
                    if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
                    return r.json();
                })
                .then((messageData) => {
                    if (Array.isArray(messageData)) {
                        const recentMessages = {};
                        messageData.forEach((message) => {
                            const otherUserId = message.sender.id === user.id ? message.recipient.id : message.sender.id;
                            if (!recentMessages[otherUserId] || new Date(message.timestamp) > new Date(recentMessages[otherUserId].timestamp)) {
                                recentMessages[otherUserId] = message;
                            }
                        });
                        setMessages(Object.values(recentMessages));
                    }
                })
                .catch((error) => {
                    console.error('HTTP polling error:', error);
                });
            }, 3000); // Poll every 3 seconds
            
            setPollingInterval(interval);
        };

        // Cleanup function
        return () => {
            clearTimeout(connectionTimeout);
            if (newSocket) {
                newSocket.disconnect();
            }
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
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

        if (!socket || !socket.connected) {
            console.log('SocketIO not connected, falling back to HTTP');
            // Fallback to HTTP if SocketIO is not connected
            fetch(`${BACKEND_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(messageData),
            })
            .then((r) => {
                if (!r.ok) {
                    throw new Error(`HTTP error! status: ${r.status}`);
                }
                return r.json();
            })
            .then((newMessage) => {
                setMessageContent('');
                setRecipient('');
                setMessage('Message sent!');
                // Update local state
                setMessages(prevMessages => {
                    const recentMessages = {};
                    prevMessages.forEach(msg => {
                        const otherUserId = msg.sender.id === user.id ? msg.recipient.id : msg.sender.id;
                        recentMessages[otherUserId] = msg;
                    });
                    const otherUserId = newMessage.sender.id === user.id ? newMessage.recipient.id : newMessage.sender.id;
                    recentMessages[otherUserId] = newMessage;
                    return Object.values(recentMessages);
                });
            })
            .catch((error) => {
                console.error('Error sending message via HTTP:', error);
                setMessage('Failed to send message. Please try again.');
            });
            return;
        }

        // Use SocketIO for real-time messaging
        console.log('Sending message via SocketIO:', messageData);
        socket.emit('message', messageData);
        
        setMessageContent('');
        setRecipient('');
        setMessage('Message sent!');
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
                // Defensive checks for sender and recipient
                if (!message.sender || !message.recipient) {
                    return null;
                }
                return (
                <div key={message.id} 
                className="message-container fade-in"
                onClick={() => navigate(`/conversation/${message.sender.id === user.id ? message.recipient.id : message.sender.id}`)}>
                    <div className="message-header">
                        <h4>From: {message.sender.username || 'Unknown'}</h4>
                        <h4>To: {message.recipient.username || 'Unknown'}</h4>
                    </div>
                    <p className="message-content">{message.content}</p>
                </div>    
                );
            })}
        </div>
    );
}

export default Messages;