import { useState } from "react";
import "../../../App.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || formData.username.length < 3) {
      alert("Tên đăng nhập phải có ít nhất 3 ký tự!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Email không hợp lệ. Phải có định dạng như: abc@abc.abc");
      return;
    }

    if (formData.password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    if(formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }

    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    }

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
      } else {
        const errorData = await response.text();
        alert(`Đăng ký không thành công: ${errorData}`);;
      }
    } catch (error) {
      alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      console.error("Lỗi khi đăng ký:", error);
    }
  };

  return (
    <div className="register-container">
      {/* Sóng tím trên */}
      <svg className="wave-top" viewBox="0 0 1440 320">
        <path
          fill="#e6b3ff"
          d="M0,192L60,186.7C120,181,240,171,360,144C480,117,600,75,720,96C840,117,960,203,1080,213.3C1200,224,1320,160,1380,128L1440,96V0H0Z"
        ></path>
      </svg>

      {/* Form đăng ký */}
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>ĐĂNG KÝ</h2>
        <input type="text" name="username" placeholder="Tên đăng nhập" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Xác nhận mật khẩu" onChange={handleChange} required />
        <button type="submit">Đăng ký</button>
        <button type="button">Quay lại</button>
      </form>

      

      {/* Sóng tím dưới */}
      <svg className="wave-bottom" viewBox="0 0 1440 320">
        <path
          fill="#e6b3ff"
          d="M0,128L60,149.3C120,171,240,213,360,213.3C480,213,600,171,720,154.7C840,139,960,149,1080,149.3C1200,149,1320,139,1380,133.3L1440,128V320H0Z"
        ></path>
      </svg>
    </div>
  );
};

export default RegisterPage;
