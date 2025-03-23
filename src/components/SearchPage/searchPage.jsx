import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PeopleContent from "./peopleContent";
import PostsContent from "./postsContent";

function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q"); // Lấy từ khóa tìm kiếm từ URL
    const [activeTab, setActiveTab] = useState("all"); // State để quản lý tab hiện tại

    // Dữ liệu mẫu
    const people = [
        { id: 1, name: "Phan thanh du", img: "https://placehold.co/40x40" },
        { id: 2, name: "Du Phan", img: "https://placehold.co/40x40" },
        { id: 3, name: "Du Du Du", img: "https://placehold.co/40x40" },
        { id: 4, name: "Du dại khờ", img: "https://placehold.co/40x40" },
        { id: 5, name: "Du Phan", img: "https://placehold.co/40x40" },
        { id: 1, name: "Phan thanh du", img: "https://placehold.co/40x40" },
        { id: 2, name: "Du Phan", img: "https://placehold.co/40x40" },
        { id: 3, name: "Du Du Du", img: "https://placehold.co/40x40" },
        { id: 4, name: "Du dại khờ", img: "https://placehold.co/40x40" },
        { id: 5, name: "Du Phan", img: "https://placehold.co/40x40" },
        { id: 1, name: "Phan thanh du", img: "https://placehold.co/40x40" },
        { id: 2, name: "Du Phan", img: "https://placehold.co/40x40" },
        { id: 3, name: "Du Du Du", img: "https://placehold.co/40x40" },
        { id: 4, name: "Du dại khờ", img: "https://placehold.co/40x40" },
        { id: 5, name: "Du Phan", img: "https://placehold.co/40x40" },
    ];

    const posts = [
        {
            id: 1,
            author: {
                name: "TieuLong Dang",
                avatar: "https://placehold.co/40x40",
            },
            timestamp: "Just now",
            content: "This is a nice picture from this #weekend.",
            image: "https://placehold.co/600x300",
            likes: 10,
            comments: [
                {
                    id: 1,
                    user: {
                        name: "User 1",
                        avatar: "https://placehold.co/30x30",
                    },
                    text: "Great post!",
                },
                {
                    id: 2,
                    user: {
                        name: "User 2",
                        avatar: "https://placehold.co/30x30",
                    },
                    text: "Awesome!",
                },
            ],
        },
        {
            id: 2,
            author: {
                name: "Another User",
                avatar: "https://placehold.co/40x40",
            },
            timestamp: "2 hours ago",
            content: "Enjoying the sunny weather!",
            image: "https://placehold.co/600x300",
            likes: 5,
            comments: [
                {
                    id: 3,
                    user: {
                        name: "User 3",
                        avatar: "https://placehold.co/30x30",
                    },
                    text: "Looks fun!",
                },
            ],
        },
    ];

    return (
        <div className="d-flex min-vh-100 bg-light">
            {/* Sidebar */}
            <div className="sidebar p-4" style={{ width: "20%" }}>
                <h2 className="h5 font-weight-bold mb-4">Kết quả tìm kiếm: {query}</h2>
                <div className="mb-4">
                    <ul className="list-unstyled list-menu-search">
                        {[
                            { icon: "filter", text: "Tất cả", tab: "all" },
                            { icon: "file-alt", text: "Bài viết", tab: "posts" },
                            { icon: "user-friends", text: "Mọi người", tab: "people" },
                        ].map((item, index) => (
                            <li key={index} className="my-3">
                                <a
                                    className={`d-flex align-items-center text-dark text-decoration-none ${activeTab === item.tab ? "active" : ""
                                        }`}
                                    href="#"
                                    onClick={() => setActiveTab(item.tab)}
                                >
                                    <i style={{ width: "30px" }} className={`fas fa-${item.icon} mr-2 mx-2 fa-lg`}></i>
                                    {item.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-3 form-content" style={{ width: "80%" }}>
                {/* Hiển thị cả "Mọi người" và "Bài viết" khi tab là "all" */}
                {activeTab === "all" && (
                    <>
                        <PeopleContent people={people} />
                        <PostsContent posts={posts} />
                    </>
                )}

                {/* Hiển thị chỉ "Mọi người" khi tab là "people" */}
                {activeTab === "people" && <PeopleContent people={people} />}

                {/* Hiển thị chỉ "Bài viết" khi tab là "posts" */}
                {activeTab === "posts" && <PostsContent posts={posts} />}
            </div>
        </div >
    );
}

export default SearchPage;