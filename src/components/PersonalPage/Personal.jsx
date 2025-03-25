import React from 'react'
import avatar from '../../assets/icon/avatar.png'

const Personal = () => {
  // const dummyPosts = [
  //   {
  //     id: 1,
  //     avatar: 'https://placehold.co/40x40',
  //     author: 'User 1',
  //     timestamp: '2 giờ trước',
  //     content: 'Đây là một bài viết mẫu.',
  //     image: 'https://placehold.co/500x300',
  //     likes: 10,
  //     commentsCount: 2,
  //     comments: ['Bình luận 1', 'Bình luận 2']
  //   }
  // ];
  return (
    <div className='container-fluid'>
      <div className='container-fluid justify-content-center d-flex align-items-center'>
        <img 
        src={avatar} 
        alt="avatar"
        className='mb-3 mt-3'
        style = {{width: '100px', height: '100px'}}
        />
        <h3 className='text-center ms-4'>TieuLong Dang</h3>
      </div>
     
      <div className='container-fluid card p-4 shadow'>
        <div className='container-fluid d-flex gap-4'>
          <div className='sidebar p-5 shadow' style={{width: "20%", height: "100vh"}}>
            <h2 className='d-flex justify-content-center'>Giới thiệu</h2>
            <h5>Học tại trường Đại học Sài Gòn</h5>
            <h5>Mối quan hệ: Hẹn hò</h5>
            <button type="submit" className="btn btn-secondary w-100 main-color search-input">Cập nhật tiểu sử</button>
          </div>
       
          <div className='sidebar p-3 d-flex flex-column align-items-center shadow' style={{width: "80%", height: "100vh"}}>
            <div className='d-flex justify-content-center'>
              <img 
                src={avatar}
                alt="avatar"
                style={{ width: "50px", height: "50px" }} 
                className="me-3 mt-4 "
              />
              <div style={{width: "30rem" }}>
                <label className="form-label"></label>
                <input type="text" className="form-control search-input " placeholder="Bạn đang nghĩ gì" />
              </div>
            </div>
            <div className='card mt-4 p-3 shadow' style={{width: "90%", height: "90%"}}>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Personal