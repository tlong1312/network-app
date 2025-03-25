import React from 'react';
import avatar from '../../assets/icon/avatar.png';

const Personal = () => {
    const posts = [
        {
            id: 1,
            author: 'TieuLong Dang',
            avatar: 'https://placehold.co/40x40',
            timestamp: 'Just now',
            content: 'This is a nice picture from this #weekend.',
            image: 'https://placehold.co/800x300',
            likes: 0,
            commentsCount: 0,
            comments: []
        },
    ];

    return (
        <div className='container-fluid'>
            <div className='container-fluid justify-content-center d-flex align-items-center'>
                <img 
                    src={avatar} 
                    alt='avatar'
                    className='mb-3 mt-3'
                    style={{ width: '100px', height: '100px' }}
                />
                <h3 className='text-center ms-4'>TieuLong Dang</h3>
            </div>

            <div className='container-fluid card p-4 shadow'>
                <div className='container-fluid d-flex gap-4'>
                    <div className='sidebar p-5 shadow' style={{ width: '20%', height: '100vh' }}>
                        <h2 className='d-flex justify-content-center'>Giới thiệu</h2>
                        <h5>Học tại trường Đại học Sài Gòn</h5>
                        <h5>Mối quan hệ: Hẹn hò</h5>
                        <button type='submit' className='btn btn-secondary w-100 main-color search-input'>Cập nhật tiểu sử</button>
                    </div>

                    <div className='sidebar p-3 d-flex justify-content-center shadow' style={{ width: '80%', height: '100vh' }}>
                        <img 
                            src={avatar}
                            alt='avatar'
                            style={{ width: '50px', height: '50px' }} 
                            className='me-3 mt-4'
                        />
                        <div style={{ width: '30rem' }}>
                            <label className='form-label'></label>
                            <input type='text' className='form-control search-input' placeholder='Bạn đang nghĩ gì' />
                        </div>
                    </div>
                </div>
            </div>

            <div className='card shadow p-3 mb-4'>
                {posts.map((post) => (
                    <div key={post.id} className='p-3 mb-3 bg-light rounded shadow-sm'>
                        <div className='d-flex align-items-center mb-2'>
                            <img 
                                src={post.avatar} 
                                alt={post.author} 
                                className='me-3 rounded-circle'
                                style={{ width: '40px', height: '40px' }}    
                            />
                            <div>
                                <span className='fw-bold'>{post.author}</span>
                                <br />
                                <small className='text-muted'>{post.timestamp}</small>
                            </div>
                        </div>
                        <p>{post.content}</p>
                        {post.image && (
                            <img
                                src={post.image}
                                alt='Post'
                                className='img-fluid rounded mb-2'
                            />
                        )}
                        <div className='d-flex mb-3'>
                            <div>
                                <i className='far fa-heart me-2'></i>
                                {post.likes}
                            </div>
                            <div>
                                <i className='far fa-comment me-2 ms-2'></i>
                                {post.commentsCount}  
                            </div>
                        </div>
                        <div className='card shadow bg-light p-3'>
                            <div className='d-flex align-items-center mb-2'>
                                <img
                                    src='https://placehold.co/30x30'
                                    alt='User 1'
                                    className='me-3 rounded-circle'
                                    style={{ width: '30px', height: '30px' }}
                                />
                                <input
                                    type='text'
                                    className='form-control me-2'
                                    placeholder='Add Comment...'
                                />
                                <button className='btn btn-outline-secondary'>
                                    Comment
                                </button>
                            </div>                            
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Personal;