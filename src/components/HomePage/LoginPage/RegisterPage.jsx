import React, { useState } from "react";
import Loginicon from "../../../assets/icon/login.png";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || formData.username.length < 3) {
      setError("Tên đăng nhập phải có ít nhất 3 ký tự!");
      return;
    }

    if (!formData.fullName) {
      setError("Họ tên không được để trống!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email không hợp lệ. Phải có định dạng như: abc@abc.abc");
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    const userData = {
      username: formData.username,
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch("http://localhost:8081/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert("Đăng ký thành công!");
        navigate("/login");
      } else {
        const errorData = await response.text();
        setError(`Đăng ký không thành công: ${errorData}`);
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
  <div
    className="d-flex flex-grow-1 justify-content-center align-items-center"
    style={{ minHeight: "calc(100vh - 130px)" }}
  >
    <div className="card p-4 shadow" style={{ width: "22rem" }}>
      <h3 className="text-center mb-3 app-name">Đăng Ký</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tên đăng nhập</label>
          <input type="text" name="username" className="form-control" placeholder="Nhập tên đăng nhập" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Họ tên</label>
          <input type="text" name="fullName" className="form-control" placeholder="Nhập họ tên" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" name="email" className="form-control" placeholder="Nhập email" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Mật khẩu</label>
          <input type="password" name="password" className="form-control" placeholder="Nhập mật khẩu" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Xác nhận mật khẩu</label>
          <input type="password" name="confirmPassword" className="form-control" placeholder="Nhập lại mật khẩu" onChange={handleChange} required />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-secondary w-100 main-color">Đăng ký</button>
      </form>

      <button className="btn btn-outline-secondary w-100 mt-3" onClick={() => navigate("/login")}>
        Quay lại đăng nhập
      </button>
    </div>
  </div>

  {/* Footer sóng dưới */}
  <footer
    style={{
      backgroundImage: `url(${Loginicon})`,
      backgroundSize: "cover",
      height: "130px",
    }}
  ></footer>
</div>
  );
};

export default RegisterPage;
