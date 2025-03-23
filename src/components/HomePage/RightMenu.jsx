import React from 'react'


const RightMenu = () => {

    const people = [
        { id: 1, name: 'Tran Hoang Long', followers: '1000 followers', avatar: 'https://placehold.co/40x40' },
        { id: 2, name: 'User1', followers: '7 followers', avatar: 'https://placehold.co/40x40' },
        { id: 3, name: 'TuiKiCuc3508', followers: '78 followers', avatar: 'https://placehold.co/40x40' },
        { id: 4, name: 'User2', followers: '100 followers', avatar: 'https://placehold.co/40x40' },
        { id: 5, name: 'User23', followers: '69 followers', avatar: 'https://placehold.co/40x40' },
        { id: 6, name: 'User234', followers: '8386 followers', avatar: 'https://placehold.co/40x40' }
    ];

    const trends = [
        {id: 1, hashtag: '#Weekend', posts: 1}
    ];

    return (
        <div className="col-lg-3 bg-light p-3 d-none d-lg-block">
            <div className='card mb-4 shadow p-3 mb-4'>
                <h5 className='fw-bold'>People you may know</h5>
                <ul className='list-unstyled'>
                    {people.map((person) => (
                        <li key={person.id} className='d-flex align-items-center justify-content-between mb-3'>
                            <div className='d-flex align-items-center'>
                                <img 
                                    src={person.avatar} 
                                    alt={person.name} 
                                    className='me-3 rounded-circle'
                                    style={{ width: '40px', height: '40px' }}
                                />
                                <div>
                                    <span className='fw-bold d-block'>{person.name}</span>
                                    <small className='text-muted'>{person.followers}</small>
                                </div>
                            </div>
                            <button className='btn btn-outline-primary btn-sm'>Follow</button>
                        </li>        
                    ))}
                </ul>
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