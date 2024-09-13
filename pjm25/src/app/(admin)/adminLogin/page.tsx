"use client";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';  // Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // Bootstrap JavaScript (includes Popper.js)
interface AdminLogin {
  email: string;
  password: string;
}

export default function Page() {
  const router = useRouter();
  const [adminLogin, setAdminLogin] = useState<AdminLogin>({ email: '', password: '' });

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (adminLogin.email == 'duyanh2005@gmail.com' && adminLogin.password =='duyanh2005@gmail.com') {
      alert('Đăng nhập thành công');
      try {
        await axios.post('http://localhost:8080/admin', adminLogin);
        localStorage.setItem('admin', JSON.stringify(adminLogin)); 
        router.push('/admin/admin'); 
      } catch (error) {
        console.error("Error logging in admin:", error);
      }
    } else {
      alert('Đăng nhập thất bại, vui lòng thử lại');
      setAdminLogin({ email: '', password: '' }); // Reset form on failure
    }
  };


  // Handle input changes
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminLogin({ ...adminLogin, [name]: value });
  };

  return (
    <div>
      <section className="vh-100" style={{ backgroundColor: 'black', color: 'white' }}>
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-9 col-lg-6 col-xl-5">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="img-fluid"
                alt="Sample image"
              />
            </div>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <form onSubmit={handleSubmit}>
                <b className="mb-4 opacity-70" style={{ color: "hsl(218, 81%, 85%)" }}>
                  <h1>Shop KenTa.vn</h1>
                  <p>Nơi mà bạn có thể lựa chọn<br />cho mình những bộ trang phục ưng ý nhất</p>
                  <p>Đăng nhập admin</p>
                </b>

                {/* Email input */}
                <div className="form-outline mb-4">
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Enter a valid email address"
                    name="email"
                    onChange={handleInput}
                    value={adminLogin.email}
                    required
                  />
                  <label className="form-label">Email address</label>
                </div>

                {/* Password input */}
                <div className="form-outline mb-3">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Enter password"
                    name="password"
                    onChange={handleInput}
                    value={adminLogin.password}
                    required
                  />
                  <label className="form-label">Password</label>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <a href="/login" className="text-body">Quay trở lại đăng nhập người dùng tại đây</a>
                </div>

                <div className="text-center text-lg-start mt-4 pt-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
