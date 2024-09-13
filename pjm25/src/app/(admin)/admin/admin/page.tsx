"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoIosLogOut } from "react-icons/io";
import Image from "next/image";
import logo from '@/app/logo.png'
import { FaRegUserCircle } from "react-icons/fa";
import { TiThMenu } from 'react-icons/ti';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';  // Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // Bootstrap JavaScript (includes Popper.js)

export default function Page() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<string>('');

  // Style for selected button
  const activeStyle = "bg-blue-500 text-white";
  const inactiveStyle = "bg-gray-300 text-black";

  // Handle admin logout
  const logoutAdmin = () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (confirmed) {
      try {
        // Call to logout API to clear session or token on the backend
         axios.delete('http://localhost:8080/admin'); 
        // Optionally, clear admin data from local storage
        localStorage.removeItem('admin');
        // Redirect to login page
        router.push('/login');
      } catch (error) {
        console.error("Error during logout", error);
      }
    }
  };

  // Handle button click and save the selected choice
  const handleChoice = (item: string) => {
    setSelectedItem(item);
    localStorage.setItem('choiceManager', JSON.stringify(item));
    router.push(`/admin/${item}`);
  };

  // Restore selected choice on page load from localStorage
  useEffect(() => {
    const storedItem = localStorage.getItem('choiceManager');
    if (storedItem) {
      setSelectedItem(JSON.parse(storedItem));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Logo Section */}
      <div className="flex justify-center items-center py-8">
        <Image src={logo} alt="Logo" width={300} height={130} />
      </div>

      {/* Header Section */}
      <div className="text-center opacity-70 mb-8">
        <h1 className="text-3xl font-bold" style={{ color: "hsl(218, 51%, 25%)" }}>Shop KenTa.vn</h1>
        <p>Nơi mà bạn có thể lựa chọn cho mình những bộ trang phục ưng ý nhất</p>
      </div>

      {/* Admin Info and Logout */}
      <div className="flex justify-center items-center mb-4">
        <FaRegUserCircle className="mr-2 text-lg" />
        <span className="text-lg">Duy Anh</span>
        <IoIosLogOut onClick={logoutAdmin} className="text-red-500 cursor-pointer ml-2 text-xl" />
      </div>

      {/* Sidebar Section */}
      <div className="container mx-auto">
        <div className="flex">
          <div className="bg-gray-800 text-white p-4 w-[300px]">
            <h2 className="text-lg mb-4"><TiThMenu /> Mục lựa chọn : </h2>
            {/* Admin Button */}
            <button
              className={`block w-full mb-4 py-2 ${selectedItem === 'admin' ? activeStyle : inactiveStyle}`} 
              onClick={() => handleChoice('admin')}
            >
              Admin
            </button>
            {/* User Management Button */}
            <button
              className={`block w-full mb-4 py-2 ${selectedItem === 'User_Management' ? activeStyle : inactiveStyle}`} 
              onClick={() => handleChoice('User_Management')}
            >
              User Management
            </button>
            {/* Create Products Button */}
            <button
              className={`block w-full py-2 ${selectedItem === 'createProducts' ? activeStyle : inactiveStyle}`} 
              onClick={() => handleChoice('createProducts')}
            >
              Create Products
            </button>
            <br />
            <button
              className={`block w-full py-2 ${selectedItem === 'Products_Manger' ? activeStyle : inactiveStyle}`} 
              onClick={() => handleChoice('Products_Manger')}
            >
              Products Manager
            </button>
            <br />
            <button
              className={`block w-full py-2 ${selectedItem === 'comment' ? activeStyle : inactiveStyle}`} 
              onClick={() => handleChoice('comment')}
            >
              Comments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
