// components/Admin/Dashboard.jsx
import React from 'react';

// Phải có export default
// components/Admin/Dashboard.jsx
const Dashboard = () => {
    const total = {
        soBaiDaDang: 1200,
        soBaiViPham: 45,
        soBaiChoDuyet: 80,
        soTaiKhoanDaDangKy: 5000
      };
    return (
        <div className="dashboard">
          <div className=" d-flex justify-content-start container-fluid" style={{height:"80vh"}}>
            <div>
              <h5>Số bài đã đăng trên hệ thống: {total.soBaiDaDang}</h5>
              <h5>Số bài vi phạm: {total.soBaiViPham}</h5>
              <h5>Số bài chờ duyệt: {total.soBaiChoDuyet}</h5>
              <h5>Số tài khoản đã đăng ký: {total.soTaiKhoanDaDangKy}</h5>
            </div>
          </div>
        </div>
    );
};

export default Dashboard;