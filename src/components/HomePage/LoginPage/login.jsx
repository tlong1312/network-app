import React from "react";
import Loginicon from "../../../assets/icon/login.png";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const naviage = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reponse = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (reponse.ok) {
        const data = await reponse.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.role === "ROLE_ADMIN") {
          naviage("/admin");
        } else if (data.role === "ROLE_USER") {
          naviage("/");
        }

      } else {
        setError("Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.");
      }
    } catch (err) {
      console.error("Lỗi khi đăng nhập:", err);
      setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  }

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
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    value={username}
                    className="form-control"
                    placeholder="Nhập username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mật khẩu</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="btn btn-secondary w-100 main-color">Đăng nhập</button>
              </form>

              {/* Nút Đăng Ký */}
              <button className="btn btn-outline-secondary w-100 mt-3" onClick={() => naviage("/RegisterPage")}>Đăng Ký</button>
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
