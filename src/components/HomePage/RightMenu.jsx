import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';


const RightMenu = () => {

    const navigate = useNavigate();
    const [people, setPeople] = useState([]);
    const [friendsRequests, setFriendsRequests] = useState([]);
    const currentUser = localStorage.getItem('user');
    const currentUserId = currentUser ? JSON.parse(currentUser).id : null;


    useEffect(() => {
        const fetchPeople = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8081/api/friends/not-friends?userId=${currentUserId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPeople(data.map(user => ({
                        id: user.id,
                        name: user.fullName,
                        avatar: user.avatar,
                        isFriend: user.status,
                    })));
                } else {
                    console.error('Failed to fetch people:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching people:', error);
            }
        };

        const fetchFriendRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8081/api/friends/requests?userId=${currentUserId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setFriendsRequests(data);
                } else {
                    console.error('Failed to fetch friend requests:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching friend requests:', error);
            }
        };

        fetchFriendRequests();
        fetchPeople();
    }, [currentUserId]);

    const handleSendFriendRequest = async (friendId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8081/api/friends/send-request?userId=${currentUserId}&friendId=${friendId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setPeople(people.map(person =>
                    person.id === friendId ? { ...person, isFriend: 'pending' } : person
                ));
            } else {
                console.error('Failed to send friend request:', response.statusText);
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const handleAcceptRequest = async (friendId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8081/api/friends/accept-request?userId=${currentUserId}&friendId=${friendId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setFriendsRequests(friendsRequests.filter(request => request.id !== friendId));
            } else {
                console.error('Failed to accept friend request:', response.statusText);
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleRejectRequest = async (friendId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8081/api/friends/reject-request?userId=${currentUserId}&friendId=${friendId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setFriendsRequests(friendsRequests.filter(request => request.id !== friendId));
            } else {
                console.error('Failed to reject friend request:', response.statusText);
            }
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };


    const trends = [
        { id: 1, hashtag: '#Weekend', posts: 1 }
    ];

    return (
        <div className="col-lg-3 bg-light p-3 d-none d-lg-block">
            <div className='card mb-4 shadow p-3 mb-4'>
                <h5 className='fw-bold'>People you may know</h5>
                <div className="scrollable">
                    <ul className='list-unstyled'>
                        {people.map((person) => (
                            <li key={person.id} className='d-flex align-items-center justify-content-between mb-3'>
                                <div
                                    className='d-flex align-items-center cursor-pointer'
                                    onClick={() => navigate(`/info-user/${person.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img
                                        src={person.avatar}
                                        alt={person.name}
                                        className='me-3 rounded-circle'
                                        style={{ width: '40px', height: '40px' }}
                                    />
                                    <div>
                                        <span className='fw-bold d-block'>{person.name}</span>
                                    </div>
                                </div>
                                {person.isFriend === 'pending' ? (
                                    <button className='btn btn-outline-secondary btn-sm' disabled>
                                        Pending
                                    </button>
                                ) : (
                                    <button className='btn btn-outline-primary btn-sm' onClick={() => handleSendFriendRequest(person.id)}>
                                        Add Friend
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <hr />

                <h5 className='fw-bold'>Friend Requests</h5>
                <div className="scrollable">
                    <ul className='list-unstyled'>
                        {friendsRequests.map((request) => (
                            <li key={request.id} className='d-flex align-items-center justify-content-between mb-3'>
                                <div
                                    className='d-flex align-items-center cursor-pointer'
                                    onClick={() => navigate(`/info-user/${request.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img
                                        src={request.avatar}
                                        alt={request.fullName}
                                        className='me-3 rounded-circle'
                                        style={{ width: '40px', height: '40px' }}
                                    />
                                    <div>
                                        <span className='fw-bold d-block'>{request.fullName}</span>
                                    </div>
                                </div>
                                <div>
                                    <button className='btn btn-outline-success btn-sm me-2' onClick={() => handleAcceptRequest(request.id)}>
                                        Accept
                                    </button>
                                    <button className='btn btn-outline-danger btn-sm' onClick={() => handleRejectRequest(request.id)}>
                                        Reject
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className='card shadow p-3'>
                <h5 className='fw-bold'>Trend for you</h5>
                <ul className='list-unstyled'>
                    {trends.map((trend) => (
                        <li key={trend.id} className='mb-3'>
                            <span className="fw-bold d-block">{trend.hashtag}</span>
                            {trend.posts > 1
                                ?
                                <small className="text-muted">{trend.posts} posts</small>
                                :
                                <small className="text-muted">{trend.posts} post</small>
                            }
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    )
}

export default RightMenu