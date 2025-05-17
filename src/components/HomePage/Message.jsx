import React, { useEffect, useRef, useState } from 'react'

const Message = ({ show, onClose, onMinimize }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [isMinimized, setIsMinimized] = useState(false);
    const messageEndRef = useRef(null);
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};

    useEffect(() => {
        fetchFriends();
    }, []);

    useEffect(() => {
        if (selectedFriend) {
            fetchConversation(currentUser.id, selectedFriend.id);
        }
    }, [selectedFriend, currentUser.id]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const fetchFriends = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8081/api/friends?userId=${currentUser.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setFriends(data);
                if (data.length > 0) {
                    setSelectedFriend(data[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    const fetchConversation = async (senderId, receiverId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8081/api/messages/conversation?senderId=${senderId}&receiverId=${receiverId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Fetched messages:", data);
                setMessages(data || []);
            }
        } catch (error) {
            console.error('Error fetching conversation:', error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedFriend) return;

        try {
            const token = localStorage.getItem('token');

            const params = new URLSearchParams();
            params.append('senderId', currentUser.id);
            params.append('receiverId', selectedFriend.id);
            params.append('content', newMessage);

            const response = await fetch('http://localhost:8081/api/messages/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Bearer ${token}`,
                },
                body: params
            });

            if (response.ok) {

                fetchConversation(currentUser.id, selectedFriend.id);
                setNewMessage("");
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleMinimize = () => {
        setIsMinimized(true);
        if (onMinimize) onMinimize();
    };

    const handleMaximize = () => {
        setIsMinimized(false);
    };

    if (!show) return null;

    if (isMinimized) {
        return (
            <div
                className="message-minimized"
                onClick={handleMaximize}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    backgroundColor: '#0d6efd',
                    color: 'white',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    zIndex: 1050
                }}
            >
                <i className="fas fa-comment"></i>
            </div>
        );
    }


    return (
        <div className="message-container" style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '350px',
            height: '460px',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1050,
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div className="message-header d-flex align-items-center justify-content-between p-2 mess-color text-white">
                <div className="d-flex align-items-center">
                    {selectedFriend && (
                        <>
                            <img
                                src={selectedFriend.avatar}
                                alt={selectedFriend.fullName}
                                className="rounded-circle me-2"
                                style={{ width: '30px', height: '30px' }}
                            />
                            <span>{selectedFriend.fullName}</span>
                        </>
                    )}
                </div>
                <div>
                    <button className="btn btn-sm text-white" onClick={handleMinimize}>
                        <i className="fas fa-minus"></i>
                    </button>
                    <button className="btn btn-sm text-white" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </div>

            {/* Friend List */}
            <div className="friend-list d-flex overflow-auto border-bottom p-2" style={{ height: '75px', minHeight: '75px' }}>
                {friends.map(friend => (
                    <div
                        key={friend.id}
                        className={`friend-item mx-1 text-center ${selectedFriend?.id === friend.id ? 'selected' : ''}`}
                        onClick={() => setSelectedFriend(friend)}
                        style={{
                            cursor: 'pointer',
                            opacity: selectedFriend?.id === friend.id ? 1 : 0.7
                        }}
                    >
                        <img
                            src={friend.avatar}
                            alt={friend.fullName}
                            className="rounded-circle"
                            style={{
                                width: '40px',
                                height: '40px',
                                border: selectedFriend?.id === friend.id ? '2px solid #0d6efd' : 'none'
                            }}
                        />
                        <div className="small text-truncate" style={{ maxWidth: '50px' }}>
                            {friend.fullName}
                        </div>
                    </div>
                ))}
            </div>

            {/* Messages Area */}
            <div className="messages-area p-2 flex-grow-1" style={{
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {messages.length === 0 ? (
                    <div className="text-center text-muted my-auto">
                        <p>No messages yet</p>
                        <p>Start a conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message-bubble mb-2 ${msg.senderId === currentUser.id ? 'ms-auto' : 'me-auto'}`}
                            style={{
                                maxWidth: '70%',
                                padding: '8px 12px',
                                borderRadius: '18px',
                                backgroundColor: msg.senderId === currentUser.id ? '#da2dbd' : '#f0f0f0',
                                color: msg.senderId === currentUser.id ? 'white' : 'black'
                            }}
                        >
                            {msg.content}
                            <div className="small text-end" style={{
                                opacity: 0.8,
                                fontSize: '0.7rem',
                                marginTop: '3px'
                            }}>
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messageEndRef} />
            </div>

            {/* Message Input */}
            <div className="message-input d-flex p-2 border-top">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                />
                <button className="btn text-white"
                    onClick={sendMessage}
                    style={{ backgroundColor: '#da2dbd' }}
                >
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    )
}

export default Message