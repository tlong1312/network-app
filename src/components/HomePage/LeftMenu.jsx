import React from 'react'

import icon from '../../assets/icon/avatar.png'
import friendIcon from '../../assets/icon/friends.png'
import groupIcon from '../../assets/icon/groups.png'
import settingIcon from '../../assets/icon/setting.png'


const LeftMenu = () => {

    const userName = 'TieuLong Dang';

    return (
        <div className="col-lg-2 bg-light p-3 d-none d-lg-block">
            <ul className="list-unstyled">
                {/* Profile */}
                <li className="d-flex align-items-center mb-3">
                    <a href="#" className="text-decoration-none text-dark cursor-pointer">
                        <img
                            src={icon}
                            alt="profile"
                            className="me-3"
                            style={{ width: '40px', height: '40px' }}
                        />
                        <span>{userName}</span>
                    </a>
                </li>

                {/* Friends */}
                <li className="d-flex align-items-center mb-3">
                    <a href="#" className="text-decoration-none text-dark cursor-pointer">
                        <img
                            src={friendIcon}
                            alt="friends"
                            className="me-3"
                            style={{ width: '40px', height: '40px' }}
                        />
                        <span>Friends</span>
                    </a>
                </li>


                {/* Groups */}
                <li className="d-flex align-items-center mb-3">
                    <a href="#" className="text-decoration-none text-dark cursor-pointer">
                        <img
                            src={groupIcon}
                            alt="groups"
                            className="me-3"
                            style={{ width: '40px', height: '40px' }}
                        />
                        <span>Groups</span>
                    </a>
                </li>

                <hr />

                {/* Setting */}
                <li className="d-flex align-items-center">
                    <a href="#" className="text-decoration-none text-dark cursor-pointer">
                        <img
                            src={settingIcon}
                            alt="setting"
                            className="me-3"
                            style={{ width: '40px', height: '40px' }}
                        />
                        <span>Setting</span>
                    </a>
                </li>
            </ul>
        </div>
    )
}

export default LeftMenu