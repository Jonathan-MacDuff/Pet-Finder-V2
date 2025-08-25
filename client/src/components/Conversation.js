import React, {useEffect, useState, useContext} from "react";
import { useParams, useNavigate } from "react-router-dom";
import {io} from "socket.io-client";
import { UserContext } from "../context/user";
import { BACKEND_URL } from '../config';

function Conversation() {
    
    const {user} = useContext(UserContext);
    const { otherId } = useParams();
    const [messages, setMessages] = useState([]);
    const [messageContent, setMessageContent] = useState('');
    const [socket, setSocket] = useState(null);
    const [pollingInterval, setPollingInterval] = useState(null);
    const [lastMessageId, setLastMessageId] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        if (user.message) {
            navigate('/');
            return;
        }

        // Initialize SocketIO for real-time conversation updates
        const newSocket = io(BACKEND_URL, {
            transports: ["polling"],
            timeout: 5000,
            forceNew: true
        });
        setSocket(newSocket);

        newSocket.on('connect_error', (error) => {
            console.warn('Conversation SocketIO failed, starting HTTP polling:', error.message);
            setTimeout(() => {
                if (!newSocket.connected) {
                    newSocket.disconnect();
                    setSocket(null);
                    startHttpPolling();
                }
            }, 3000);
        });

        if (user.id && otherId) {
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
                const relevantMessages = []
                // Check if messageData is an array before using forEach
                if (Array.isArray(messageData)) {
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
                    setMessages(relevantMessages);
                    // Set last message ID for polling
                    if (relevantMessages.length > 0) {
                        setLastMessageId(relevantMessages[relevantMessages.length - 1].id);
                    }
                } else {
                    console.error('Expected array of messages, got:', messageData);
                    setMessages([]);
                }
            })
            .catch((error) => {
                console.error('Error fetching conversation:', error);
                setMessages([]);
            });
        }

        // Listen for real-time messages
        newSocket.on('message', (newMessage) => {
            console.log('💬 Conversation received message:', newMessage);
            console.log('👤 Current user ID:', user.id, 'Other user ID:', otherId);
            console.log('📧 Message from:', newMessage.sender.id, 'to:', newMessage.recipient_id);
            
            // Only add messages relevant to this conversation
            const isRelevant = (newMessage.sender.id === parseInt(otherId) && newMessage.recipient_id === user.id) ||
                               (newMessage.sender.id === user.id && newMessage.recipient_id === parseInt(otherId));
            
            console.log('🎯 Message relevant to conversation?', isRelevant);
            
            if (isRelevant) {
                console.log('➕ Adding message to conversation');
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
        });

        // Start HTTP polling if SocketIO fails
        const startHttpPolling = () => {
            console.log('🔄 Starting HTTP polling for conversation updates');
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
                        const relevantMessages = messageData.filter((message) => 
                            (message.recipient.id === user.id || message.sender.id === user.id) &&
                            (message.recipient.id === parseInt(otherId) || message.sender.id === parseInt(otherId))
                        );
                        
                        relevantMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                        
                        // Only update if we have new messages
                        if (relevantMessages.length > 0) {
                            const newestId = relevantMessages[relevantMessages.length - 1].id;
                            if (newestId !== lastMessageId) {
                                console.log('🆕 Found new messages via polling');
                                setMessages(relevantMessages);
                                setLastMessageId(newestId);
                            }
                        }
                    }
                })
                .catch((error) => {
                    console.error('Conversation polling error:', error);
                });
            }, 2000); // Poll every 2 seconds for conversation
            
            setPollingInterval(interval);
        };

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
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
            // Find recipient username from existing messages
            const recipientUsername = messages.length > 0 
                ? (messages[0].sender.id === user.id ? messages[0].recipient.username : messages[0].sender.username)
                : 'Unknown';
                
            const messageData = {
                recipient: recipientUsername,
                content: messageContent,
                sender_id: user.id,
                timestamp: new Date().toISOString()
            };

            // Try SocketIO first, fallback to HTTP
            if (socket && socket.connected) {
                socket.emit('message', messageData);
                setMessageContent('');
            } else {
                // HTTP fallback
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
                    // Add to local state
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                })
                .catch((error) => {
                    console.error('Error sending message:', error);
                });
            }
        }
    };


    return (
        <div className="container">
            {messages.map((message) => (
                <div key={message.id} className="conversation-message fade-in">
                    <div className="sender-name">{message.sender.username}</div>
                    <p className="message-text">{message.content}</p>
                    <div className="timestamp">{formatTimestamp(message.timestamp)}</div>
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