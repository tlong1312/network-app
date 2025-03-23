import React, { useState } from "react";

const PeopleContent = ({ people }) => {
    const [showAll, setShowAll] = useState(false);
    const displayedPeople = showAll ? people : people.slice(0, 5);

    return (
        <div className="content d-flex flex-column p-3 rounded-lg shadow-sm mb-4">
            <h2 className="h5 font-weight-bold mb-4">Mọi người</h2>
            <div className="list-group">
                {displayedPeople.map((person) => (
                    <div key={person.id} className="d-flex justify-content-between list-user align-items-center mb-1">
                        <div className="d-flex align-items-center info-user">
                            <img
                                alt={`Profile picture of ${person.name}`}
                                className="rounded-circle mr-3"
                                src={person.img}
                                style={{ width: "40px", height: "40px" }}
                            />
                            <span className="font-weight-medium mx-2 ">{person.name}</span>
                        </div>
                        <button className="btn btn-add-friend btn-sm">Thêm bạn bè</button>
                    </div>
                ))}
            </div>
            {people.length > 5 && (
                <button
                    className="btn btn-outline-secondary btn-block mt-4 mx-auto"
                    onClick={() => setShowAll(!showAll)}
                >
                    {showAll ? "Ẩn bớt" : "Xem tất cả"}
                </button>
            )}
        </div>
    );
};

export default PeopleContent;