import React from 'react'
import LeftMenu from './LeftMenu'
import MainContent from './MainContent'
import RightMenu from './RightMenu'

const HomePage = () => {
  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <LeftMenu />
        <MainContent />
        <RightMenu />
      </div>
    </div>
  )
}

export default HomePage