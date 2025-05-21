import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PeopleContent from "./peopleContent";
import PostsContent from "./postsContent";

function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");
    const [activeTab, setActiveTab] = useState("all");

    const [people, setPeople] = useState([]);
    const [posts, setPosts] = useState([]);

    // ✅ Lấy userId từ localStorage (lưu khi login)
    const currentUserId = localStorage.getItem("userId");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (query && token) {
            fetch(`http://localhost:8081/api/search?q=${query}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error("Request failed: " + res.status);
                    return res.json();
                })
                .then(data => {
                    setPeople(data.users || []);
                    setPosts(data.posts || []);
                })
                .catch(err => {
                    console.error("Lỗi gọi API:", err);
                });
        }
    }, [query]);

    return (
        <div className="d-flex min-vh-100 bg-light">
            {/* Sidebar */}
            <div className="sidebar p-4" style={{ width: "20%" }}>
                <h2 className="h5 font-weight-bold mb-4">Kết quả tìm kiếm: {query}</h2>
                <ul className="list-unstyled list-menu-search">
                    {[
                        { icon: "filter", text: "Tất cả", tab: "all" },
                        { icon: "file-alt", text: "Bài viết", tab: "posts" },
                        { icon: "user-friends", text: "Mọi người", tab: "people" },
                    ].map((item, index) => (
                        <li key={index} className="my-3">
                            <a
                                href="#"
                                className={`d-flex align-items-center text-dark text-decoration-none ${activeTab === item.tab ? "active" : ""}`}
                                onClick={() => setActiveTab(item.tab)}
                            >
                                <i className={`fas fa-${item.icon} me-2 fa-lg`} style={{ width: "30px" }}></i>
                                {item.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main content */}
            <div className="p-3 form-content" style={{ width: "80%" }}>
                {activeTab === "all" && (
                    <>
                        <PeopleContent people={people} currentUserId={currentUserId} />
                        <PostsContent posts={posts} setPosts={setPosts} />
                    </>
                )}
                {activeTab === "people" && <PeopleContent people={people} currentUserId={currentUserId} />}
                {activeTab === "posts" && <PostsContent posts={posts} setPosts={setPosts} />}
            </div>
        </div>
    );
}

export default SearchPage;
