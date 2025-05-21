import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PeopleContent = ({ people }) => {
    const [friendStatuses, setFriendStatuses] = useState({});
    const navigate = useNavigate();

    // ✅ Lấy user từ localStorage và lấy ra id
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = currentUser?.id;

    // Gọi API để lấy trạng thái bạn bè của từng người
    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token || !currentUserId) return;
                    
                const validPeople = people.filter(p => parseInt(p.id) !== parseInt(currentUserId));
                const promises = validPeople.map(person =>
                    fetch(`http://localhost:8081/api/friends/status?userId=${currentUserId}&friendId=${person.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                        .then(res => res.ok ? res.json() : null)
                        .catch(() => null)
                );

                const results = await Promise.all(promises);
                const statusMap = {};
                validPeople.forEach((person, idx) => {
                    if (results[idx]) statusMap[person.id] = results[idx];
                });

                setFriendStatuses(statusMap);
            } catch (error) {
                console.error("Lỗi khi lấy trạng thái bạn bè:", error);
            }
        };

        if (people.length > 0 && currentUserId) {
            fetchStatuses();
        }
    }, [people, currentUserId]);

    // Xử lý kết bạn / huỷ kết bạn / chấp nhận kết bạn
    const handleFriendAction = async (type, friendId) => {
        console.log("handleFriendAction called with:", { type, friendId, currentUserId });

        if (!currentUserId || !friendId) {
            console.error("❌ Thiếu currentUserId hoặc friendId", { currentUserId, friendId });
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ Token không tồn tại");
            return;
        }

        const urlMap = {
            add: `http://localhost:8081/api/friends/send-request?userId=${currentUserId}&friendId=${friendId}`,
            unfriend: `http://localhost:8081/api/friends/unfriend?userId=${currentUserId}&friendId=${friendId}`,
            accept: `http://localhost:8081/api/friends/accept-request?userId=${currentUserId}&friendId=${friendId}`,
        };

        try {
            const res = await fetch(urlMap[type], {
                method: type === "unfriend" ? "DELETE" : "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("❌ API call failed:", res.status, errorText);
                return;
            }

            // Cập nhật UI ngay
            setFriendStatuses(prev => ({
                ...prev,
                [friendId]: {
                    status:
                        type === "add"
                            ? "pending"
                            : type === "accept"
                                ? "accepted"
                                : "none",
                    isReceiver: false,
                },
            }));
        } catch (error) {
            console.error("❌ Lỗi gửi yêu cầu bạn bè:", error);
        }
    };

    // Hiển thị nút kết bạn phù hợp theo trạng thái
    const renderFriendButton = (userId) => {
        if (parseInt(userId) === parseInt(currentUserId)) return null;

        const statusObj = friendStatuses[userId] || { status: "none", isReceiver: false };

        switch (statusObj.status) {
            case "accepted":
                return (
                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleFriendAction("unfriend", userId)}
                    >
                        unfriend
                    </button>
                );
            case "pending":
                return statusObj.isReceiver ? (
                    <>
                        <button
                            className="btn btn-outline-success btn-sm me-2"
                            onClick={() => handleFriendAction("accept", userId)}
                        >
                            Accept Friends
                        </button>
                        <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleFriendAction("unfriend", userId)}
                        >
                            Decline
                        </button>
                    </>
                ) : (
                    <button className="btn btn-secondary btn-sm" disabled>
                        Pending
                    </button>
                );
            default:
                return (
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleFriendAction("add", userId)}
                    >
                        Add Friend
                    </button>
                );
        }
    };

    return (
        <div className="content d-flex flex-column p-3 rounded-lg shadow-sm mb-4">
            <h2 className="h5 font-weight-bold mb-4">Mọi người</h2>
            <div className="list-group">
                {people.map((person) => (
                    <div
                        key={person.id}
                        className="d-flex justify-content-between list-user align-items-center mb-2"
                    >
                        <div
                            className="d-flex align-items-center info-user cursor-pointer"
                            onClick={() => navigate(`/info-user/${person.id}`)}
                        >
                            <img
                                alt={`Avatar of ${person.username}`}
                                src={person.avatar || "https://placehold.co/40x40"}
                                className="rounded-circle me-3"
                                style={{ width: "40px", height: "40px" }}
                            />
                            <span className="fw-semibold">{person.username}</span>
                        </div>
                        {renderFriendButton(person.id)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PeopleContent;
