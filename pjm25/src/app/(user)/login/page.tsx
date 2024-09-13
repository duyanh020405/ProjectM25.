"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';  // Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // Bootstrap JavaScript (includes Popper.js)
export default function Page() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false); // State for success message
  const router = useRouter();
  const [login, setLogin] = useState<{ email: string; password: string }>({
    email: '',
    password: ''
  });

  // Handle input changes
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLogin({
      ...login,
      [name]: value,
    });
  };

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user');
        setData(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Fetch the list of users
      const response = await axios.get('http://localhost:8080/user');  // Fetch users list from the server
      const users = response.data;  // Assuming the response is an array of users
  
      // Check if any user matches the entered credentials
      const matchedUser = users.find(
        (user: { email: string; password: string }) =>
          user.email === login.email && user.password === login.password
      );
  
      if (matchedUser) {
        // Show success message
        setShowSuccessMessage(true);
  
        // Save user data in localStorage and redirect to home
        localStorage.setItem('userOnl', JSON.stringify(matchedUser)); // You can store the user details instead of the login object
        setTimeout(() => {
          setShowSuccessMessage(false);  // Hide the message after 3 seconds
          router.push('/');  // Redirect after 3 seconds
        }, 3000);
  
        // Clear form fields after successful login
        setLogin({
          email: '',
          password: '',
        });
      } else {
        // If no match, alert the user
        alert("Login failed: Incorrect email or password");
      }
    } catch (error) {
      console.error("Login error", error);
      alert("Error during login");
    }
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <section className="background-radial-gradient overflow-hidden">
        <style
          dangerouslySetInnerHTML={{
            __html:
              `
              .background-radial-gradient {
                background-color: hsl(218, 41%, 15%);
                background-image: radial-gradient(650px circle at 0% 0%, hsl(218, 41%, 35%) 15%, hsl(218, 41%, 30%) 35%, hsl(218, 41%, 20%) 75%, hsl(218, 41%, 19%) 80%, transparent 100%), radial-gradient(1250px circle at 100% 100%, hsl(218, 41%, 45%) 15%, hsl(218, 41%, 30%) 35%, hsl(218, 41%, 20%) 75%, hsl(218, 41%, 19%) 80%, transparent 100%);
              }
              #radius-shape-1 {
                height: 220px;
                width: 220px;
                top: -60px;
                left: -130px;
                background: radial-gradient(#44006b, #ad1fff);
                overflow: hidden;
              }
              #radius-shape-2 {
                border-radius: 38% 62% 63% 37% / 70% 33% 67% 30%;
                bottom: -60px;
                right: -110px;
                width: 300px;
                height: 300px;
                background: radial-gradient(#44006b, #ad1fff);
                overflow: hidden;
              }
              .bg-glass {
                background-color: hsla(0, 0%, 100%, 0.9) !important;
                backdrop-filter: saturate(200%) blur(25px);
              }
            `
          }}
        />

        <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
          <div className="row gx-lg-5 align-items-center mb-5">
            <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
              <h1
                className="my-5 display-5 fw-bold ls-tight"
                style={{ color: "hsl(218, 81%, 95%)" }}
              >
                The best chose <br />
                <span style={{ color: "hsl(218, 81%, 75%)" }}>
                  for your business
                </span>
              </h1>
              <p
                className="mb-4 opacity-70"
                style={{ color: "hsl(218, 81%, 85%)" }}
              >
                <h1>Shop KenTa.vn </h1>
                <p>Nơi mà bạn có thể lựa chọn <br />cho mình những bộ trang phục ưng ý nhất</p>
              </p>
            </div>
            <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
              <div
                id="radius-shape-1"
                className="position-absolute rounded-circle shadow-5-strong"
              />
              <div
                id="radius-shape-2"
                className="position-absolute shadow-5-strong"
              />
              <div className="card bg-glass">
                <div className="card-body px-4 py-5 px-md-5">
                  <form onSubmit={handleSubmit}>
                    <h1>Đăng nhập tài khoản tại đây !</h1>

                    {/* Success Message */}
                    {showSuccessMessage && (
                      <div className="text-center mb-4 bg-green-500 text-white py-2 rounded">
                        Đăng nhập thành công!
                      </div>
                    )}

                    <div className="form-outline mb-4">
                      <input
                        type="email"
                        id="form3Example3"
                        name="email"
                        className="form-control"
                        onChange={handleInput}
                        value={login.email}
                      />
                      <label className="form-label" htmlFor="form3Example3">
                        Email address
                      </label>
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        type="password"
                        id="form3Example4"
                        name="password"
                        className="form-control"
                        onChange={handleInput}
                        value={login.password}
                      />
                      <label className="form-label" htmlFor="form3Example4">
                        Password
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-block mb-4"
                    >
                      Sign in
                    </button>
                  </form>
                  <a href="/adminLogin" className="text-body">
                    Bạn là admin? ấn vào đây để đăng nhập
                  </a><br />
                  <a href="/register" className="text-body">
                    Bạn là chưa có tài khoản? ấn vào đây để đăng kí
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
