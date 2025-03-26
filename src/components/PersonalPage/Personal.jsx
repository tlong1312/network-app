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
          <div className='sidebar p-4 shadow' style={{width: "20%", height: "100vh"}}>
            <h2 className='d-flex justify-content-center'>Giới thiệu</h2>
            <h6>Học tại trường Đại học Sài Gòn</h6>
            <h6>Mối quan hệ: Hẹn hò</h6>
            <h6>Đang sống tại Thành phố Hồ Chí Minh</h6>
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
            <div className='card mt-4 p-3 shadow d-flex' style={{width: "90%", height: "90%"}}>
              <div className='d-flex mt-3 ms-3'>
                <img 
                  src={avatar}
                  alt="avatar"
                  style={{ width: "50px", height: "50px" }}
                />
                <div className='d-flex flex-column ms-3 mt-1'>
                  <h6>TieuLong Dang</h6>
                  <small className='text-muted'>2 giờ trước</small>
                </div>
              </div>
              <p className='mt-1 mb-1'>Đây là một bài viết mẫu.</p>
              <img
                src="https://placehold.co/800x300"
                alt="Post"
                className='img-fluid rounded '
              />


              <div className='mt-3 d-flex'>
                <img
                  src="https://placehold.co/50x50"
                  alt="Post"
                  className='rounded-circle'
                  style={{ width: "50px", height: "50px" }}
                />
                <div className='flex-column'>
                  <h5 className='ms-2'>TieuLong Dang</h5>
                  <h6 className='ms-4 mt-2'>So cool</h6>
                </div>
              </div>


              <div className="mt-auto d-flex align-items-end">
                <img 
                  src={avatar}
                  alt="avatar"
                  className='ms-2'
                  style={{ width: "50px", height: "50px" }}
                />
                <label className="form-label"></label>
                <input type="text" className="form-control ms-3" style={{width:"90%"}} placeholder="Bình luận" />
                <button type="submit" className="btn btn-secondary ms-3 main-color">Đăng</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Personal