import React from 'react'
import avatar from '../../assets/icon/avatar.png'

const Personal = () => {
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
      <div className='container-fluid'>
        
      </div>
    </div>
  )
}

export default Personal