"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdBadge, faUser, faEnvelope, faLock, faBell } from '@fortawesome/free-solid-svg-icons';
import '../../../components/css/infor.css'
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  alertEnabled: boolean; // Added to handle alert preference
  // Add other user properties here
}

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [showAlert, setShowAlert] = useState<boolean>(false); // To manage alert state

  useEffect(() => {
    const storedUser = localStorage.getItem("userOnl");
    if (storedUser) {
      try {
        const userData: User = JSON.parse(storedUser);
        setUser(userData);
        setFormData(userData);
        setShowAlert(userData.alertEnabled); // Initialize alert state
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleAlertToggle = () => {
    setShowAlert((prev) => !prev);
    if (user) {
      // Update the alert preference on the server and in localStorage
      const updatedUser = { ...user, alertEnabled: !showAlert };
      localStorage.setItem("userOnl", JSON.stringify(updatedUser));
      axios.patch(`http://localhost:8080/user/${user.id}`, { alertEnabled: !showAlert });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      try {
        // Update the user on the server
        await axios.patch(`http://localhost:8080/user/${user.id}`, formData);
        
        // Update user in localStorage
        localStorage.setItem("userOnl", JSON.stringify({ ...user, ...formData }));
        
        // Update state
        setUser((prev) => (prev ? { ...prev, ...formData } : null));
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl border border-gray-200 rounded-lg shadow-lg bg-white">
      <div className="flex items-center mb-6">
        <img
          src="https://th.bing.com/th/id/R.8e2c571ff125b3531705198a15d3103c?rik=gzhbzBpXBa%2bxMA&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fuser-png-icon-big-image-png-2240.png&ehk=VeWsrun%2fvDy5QDv2Z6Xm8XnIMXyeaz2fhR3AgxlvxAc%3d&risl=&pid=ImgRaw&r=0" // Replace with actual path to user image
          alt="User Profile"
          className="w-24 h-24 rounded-full object-cover mr-4 border border-gray-300 shadow-sm"
        />
        <h1 className="text-4xl font-bold text-gray-900">Thông tin người dùng</h1>
      </div>
      {user ? (
        <div className="space-y-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faUser} className="text-blue-500" />
                <label htmlFor="name" className="block text-gray-700 font-semibold">Tên:</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-red-500" />
                <label htmlFor="email" className="block text-gray-700 font-semibold">Email:</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faLock} className="text-yellow-500" />
                <label htmlFor="password" className="block text-gray-700 font-semibold">Password:</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleEditToggle}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faIdBadge} className="text-blue-500" />
                <p className="text-lg font-semibold text-gray-800">ID: {user.id}</p>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faUser} className="text-green-500" />
                <p className="text-lg font-semibold text-gray-800">Tên: {user.name}</p>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-red-500" />
                <p className="text-lg font-semibold text-gray-800">Email: {user.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faLock} className="text-yellow-500" />
                <p className="text-lg font-semibold text-gray-800">Password: {user.password}</p>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <label className="flex items-center">
                  <FontAwesomeIcon icon={faBell} className="text-gray-700 mr-2" />
                  <span className="text-gray-700 mr-2">Enable Alerts:</span>
                  <input
                    type="checkbox"
                    checked={showAlert}
                    onChange={handleAlertToggle}
                    className="toggle-checkbox"
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <button
                onClick={handleEditToggle}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out mt-4"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-600">No user data available</p>
      )}
    </div>
  );
}
