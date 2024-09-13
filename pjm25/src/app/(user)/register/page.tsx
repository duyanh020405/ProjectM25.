"use client"
import axios from 'axios';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';  // Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // Bootstrap JavaScript (includes Popper.js)
import { FaAddressBook } from 'react-icons/fa';
export default function Page() {
  const generateRandomId = () => Math.random().toString(36).substr(2, 9);
  const [newUser, setNewUser] = useState({
    id: generateRandomId(), 
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phone :'',
    card: [],
    like:[],
    buy: [],
    blocked: false,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidEmail(newUser.email)) {
      alert('Vui lòng nhập đúng định dạng gmail');
      return;
    }

    if (newUser.password.length < 8) {
      alert('Password phải trên 8 chữ số.');
      return;
    }
    if (newUser.address.length < 8) {
      alert('Password phải trên 8 chữ số.');
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      alert('Passwords chưa đúng , vui lòng thử lại');
      return;
    }
    axios.post('http://localhost:8080/user',newUser)
    alert("Tạo tài khoản thành công")

    setNewUser({
      id: generateRandomId(), 
      name: '',
      email: '',
      password: '',
      phone :'',
      confirmPassword: '',
      address: '',
      card: [],
      buy: [],
      like:[],
      blocked: false,
    });
  };

  return (
    <div>
      <section className="vh-100" style={{ backgroundColor: '#eee' }}>
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card text-black" style={{ borderRadius: 25 }}>
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                      
                      <b className="mb-4 opacity-70" style={{ color: "hsl(218, 81%, 85%)" }}>
                  <h1>Shop KenTa.vn</h1>
                  <p>
                    Nơi mà bạn có thể lựa chọn <br />
                    cho mình những bộ trang phục ưng ý nhất
                  </p>
                   <h3>Đăng kí tài khoản</h3>
                </b>
                      <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-user fa-lg me-3 fa-fw" />
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="text"
                              id="formName"
                              name="name"
                              className="form-control"
                              value={newUser.name}
                              onChange={handleInput}
                              required
                            />
                            <label className="form-label" htmlFor="formName">
                              Your Name
                            </label>
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-envelope fa-lg me-3 fa-fw" />
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="email"
                              id="formEmail"
                              name="email"
                              className="form-control"
                              value={newUser.email}
                              onChange={handleInput}
                              required
                            />
                            <label className="form-label" htmlFor="formEmail">
                              Your Email
                            </label>
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-map-pin fa-lg me-3 fa-fw text-gray-500" />
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="text"
                              id="formText"
                              name="address"
                              className="form-control"
                              value={newUser.address}
                              onChange={handleInput}
                              required
                            />
                            <label className="form-label" htmlFor="formEmail">
                              Your address
                            </label>
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-phone-alt fa-lg me-3 fa-fw text-gray-500" />
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="text"
                              id="formText"
                              name="phone"
                              className="form-control"
                              value={newUser.phone}
                              onChange={handleInput}
                              required
                            />
                            <label className="form-label">
                              Your phone
                            </label>
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-lock fa-lg me-3 fa-fw" />
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="password"
                              id="formAdress"
                              name="password"
                              className="form-control"
                              value={newUser.password}
                              onChange={handleInput}
                              required
                            />
                            <label className="form-label" htmlFor="formPassword">
                              Password
                            </label>
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-key fa-lg me-3 fa-fw" />
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="password"
                              id="formConfirmPassword"
                              name="confirmPassword"
                              className="form-control"
                              value={newUser.confirmPassword}
                              onChange={handleInput}
                              required
                            />
                            <label className="form-label" htmlFor="formConfirmPassword">
                              Repeat your password
                            </label>
                          </div>
                        </div>

                        <div className="form-check d-flex justify-content-center mb-5">
                          <input
                            className="form-check-input me-2"
                            type="checkbox"
                            defaultValue=""
                            id="formTerms"
                            required
                          />
                          <label className="form-check-label" htmlFor="formTerms">
                            I agree to all statements in <a href="#!">Terms of service</a>
                          </label>
                        </div>

                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                          <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                          >
                            Register
                          </button>
                        </div>
                      </form>
                    </div>

                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                      <img
                        src="https://dony.vn/wp-content/uploads/2021/08/mau-thiet-ke-shop-quan-ao-nam-dep-2.jpg"
                        className="img-fluid"
                        alt="Sample image"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
