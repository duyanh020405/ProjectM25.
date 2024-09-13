// src/app/contact/page.tsx
"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('http://localhost:8080/contacts', formData);
      setResponseMessage(`Đã gửi thành công tin nhắn : ${response.data.message}`);
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      router.push('/');
    } catch (error) {
      setResponseMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Liên Hệ Với Chúng Tôi</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-lg font-medium text-gray-700">Tên</label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập tên của bạn"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập email của bạn"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-lg font-medium text-gray-700">Tin Nhắn</label>
            <textarea
              id="message"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Nhập tin nhắn của bạn"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi'}
          </button>
          {responseMessage && (
            <p className="mt-4 text-center text-green-600">{responseMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
