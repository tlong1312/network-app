import React from "react";
import Loginicon from "../../../assets/icon/login.png";

const Login = () => {
  return (
    <div className="d-flex flex-column vh-100">
      {/* Nội dung chính */}
      <div className="container-fluid flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="row w-100">
          {/* Cột bên trái */}
          <div className="col-lg-6 d-flex flex-column justify-content-center align-items-center text-center" style={{ height: "75vh" }}>
            <h1 className="app-name">Network App</h1>  
            <h4 className="mt-2">
              Giúp bạn kết nối và chia sẻ với mọi người <br />
              cuộc sống của bạn.
            </h4>
          </div>

          {/* Cột bên phải - Form Đăng Nhập */}
          <div className="col-lg-6 d-flex justify-content-center align-items-center">
            <div className="card p-4 shadow" style={{ width: "22rem" }}>
              <h3 className="text-center mb-3 app-name">Đăng Nhập</h3>
              <form>
                <div className="mb-3">
                  <label className="form-label">Email/Số điện thoại</label>
                  <input type="text" className="form-control" placeholder="Nhập email/số điện thoại" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mật khẩu</label>
                  <input type="password" className="form-control" placeholder="Nhập mật khẩu" />
                </div>
                <button type="submit" className="btn btn-secondary w-100 main-color">Đăng nhập</button>
              </form>
              
              {/* Nút Đăng Ký */}
              <button className="btn btn-outline-secondary w-100 mt-3">Đăng Ký</button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="h-100"
       style={{
          backgroundImage: `url(${Loginicon})`,
          backgroundSize: "cover",  
          height: "130px",
        }}>
      </footer>
    </div>
  );
};

export default Login;
