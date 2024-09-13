"use client";
import 'bootstrap/dist/css/bootstrap.min.css';  // Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // Bootstrap JavaScript (includes Popper.js)
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import { IoIosLogOut } from 'react-icons/io';
import Image from "next/image";
import logo from "@/app/logo.png";
interface Product {
  id: string;
  name: string;
  price: number;
  img: string;
  size: string[];  // Updated to array of strings
  quantity: number;
  category: string;
  description: string;
}

interface Errors {
  name?: string;
  price?: string;
  img?: string;
  quantity?: string;
  description?: string;
  size?: string;
}

const sizeOptions = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];

export default function Page() {
  const generateRandomId = () => Math.random().toString(36).substr(2, 9);

  const [newType, setNewType] = useState<string>('');
  const [showNewTypeInput, setShowNewTypeInput] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);  // State for selected sizes

  const [newProduct, setNewProduct] = useState<Product>({
    id: generateRandomId(),
    name: '',
    price: 0,
    img: '',
    size: [],  // Updated to array
    quantity: 0,
    category: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prevSizes =>
      prevSizes.includes(size) ? prevSizes.filter(s => s !== size) : [...prevSizes, size]
    );
  };

  useEffect(() => {
    setNewProduct(prev => ({ ...prev, size: selectedSizes }));
  }, [selectedSizes]);

  const validateForm = (): boolean => {
    let valid = true;
    let tempErrors: Errors = {};

    if (!newProduct.name) {
      valid = false;
      tempErrors.name = 'Tên sản phẩm là bắt buộc';
    }
    if (!newProduct.price || newProduct.price <= 0) {
      valid = false;
      tempErrors.price = 'Giá sản phẩm phải lớn hơn 0';
    }
    if (!newProduct.img) {
      valid = false;
      tempErrors.img = 'Hình ảnh sản phẩm là bắt buộc';
    }
    if (!newProduct.quantity || newProduct.quantity <= 0) {
      valid = false;
      tempErrors.quantity = 'Số lượng phải lớn hơn 0';
    }
    if (!newProduct.description) {
      valid = false;
      tempErrors.description = 'Mô tả sản phẩm là bắt buộc';
    }
    if (newProduct.size.length === 0) {
      valid = false;
      tempErrors.size = 'Vui lòng chọn ít nhất một kích thước';
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (showNewTypeInput && newType !== '') {
      newProduct.category = newType;
    }

    axios
      .post('http://localhost:8080/products', newProduct)
      .then(() => {
        alert('Thêm sản phẩm mới thành công!');
        setNewProduct({
          id: generateRandomId(),
          name: '',
          price: 0,
          img: '',
          size: [],
          quantity: 0,
          category: '',
          description: '',
        });
        setSelectedSizes([]); // Reset sizes after submission
      })
      .catch((error) => console.error('Lỗi khi thêm sản phẩm:', error));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'new') {
      setShowNewTypeInput(true);
    } else {
      setShowNewTypeInput(false);
      setNewProduct((prev) => ({ ...prev, category: value }));
    }
  };

  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<string>('');

  const activeStyle = "bg-blue-500 text-white";
  const inactiveStyle = "bg-gray-300 text-black";

  const logoutAdmin = () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (confirmed) {
      localStorage.setItem('admin', '');
      router.push('/login');
    }
  };

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      try {
        const parsedAdmin = JSON.parse(adminData);
        if (parsedAdmin.email !== 'duyanh2005@gmail.com') {
          router.push('/login');
        }
      } catch (error) {
        console.error("Error parsing admin data from localStorage", error);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }

    const storedItem = localStorage.getItem('choiceManager');
    if (storedItem) {
      setSelectedItem(JSON.parse(storedItem));
    }
  }, [router]);

  const handleChoice = (item: string) => {
    setSelectedItem(item);
    localStorage.setItem('choiceManager', JSON.stringify(item));
    router.push(`/admin/${item}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-center items-center py-8">
        <Image src={logo} alt="Logo" width={300} height={130} />
      </div>

      <div className="text-center opacity-70 mb-8">
        <h1 className="text-3xl font-bold text-hsl(218, 51%, 25%)">Shop KenTa.vn</h1>
        <p>Nơi mà bạn có thể lựa chọn cho mình những bộ trang phục ưng ý nhất</p>
      </div>

      <div className="flex justify-center items-center mb-4">
        <FaRegUserCircle className="mr-2 text-lg" />
        <span className="text-lg">Duy Anh</span>
        <IoIosLogOut onClick={logoutAdmin} className="text-red-500 cursor-pointer ml-2 text-xl" />
      </div>

      <div className="container mx-auto">
        <div className="flex">
          <div className="bg-gray-800 text-white p-4 w-[300px]">
            <h2 className="text-lg mb-4">{selectedItem}</h2>
            <button 
                className={`block w-full mb-4 py-2 ${selectedItem === 'admin' ? activeStyle : inactiveStyle}`} 
                onClick={() => handleChoice('admin')}
              >
                Admin
            </button>
            <button 
              className={`block w-full mb-4 py-2 ${selectedItem === 'User_Management' ? activeStyle : inactiveStyle}`} 
              onClick={() => handleChoice('User_Management')}
            >
              User Management
            </button>
            <button 
              className={`block w-full py-2 ${selectedItem === 'createProducts' ? activeStyle : inactiveStyle}`} 
              onClick={() => handleChoice('createProducts')}
            >
              Create Products
            </button>
            <br />
            <button
              className={`block w-full py-2 ${selectedItem === 'createProducts' ? activeStyle : inactiveStyle}`} 
              onClick={() => handleChoice('Products_Manger')}
            >
              Products Manager
            </button>
            <br />
            <button
              className={`block w-full py-2 ${selectedItem === 'createProducts' ? activeStyle : inactiveStyle}`} 
              onClick={() => handleChoice('comment')}
            >
              Comments
            </button>
          </div>

          <div className="flex-1 bg-white p-6 rounded-lg shadow-md ml-8">
            <h1 className="text-2xl font-semibold mb-4">Tạo sản phẩm mới:</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="productName" className="block text-gray-700 mb-2">Tên sản phẩm</label>
                <input
                  type="text"
                  id="productName"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProduct.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="productImg" className="block text-gray-700 mb-2">Link hình ảnh sản phẩm</label>
                <input
                  type="text"
                  id="productImg"
                  name="img"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProduct.img}
                  onChange={handleChange}
                />
                {errors.img && <p className="text-red-500 text-sm">{errors.img}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="productPrice" className="block text-gray-700 mb-2">Giá sản phẩm</label>
                <input
                  type="number"
                  id="productPrice"
                  name="price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProduct.price}
                  onChange={handleChange}
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="productQuantity" className="block text-gray-700 mb-2">Số lượng</label>
                <input
                  type="number"
                  id="productQuantity"
                  name="quantity"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProduct.quantity}
                  onChange={handleChange}
                />
                {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="productDescription" className="block text-gray-700 mb-2">Mô tả sản phẩm</label>
                <textarea
                  id="productDescription"
                  name="description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={newProduct.description}
                  onChange={handleChange}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Kích thước</label>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`px-4 py-2 rounded-md border ${selectedSizes.includes(size) ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {errors.size && <p className="text-red-500 text-sm">{errors.size}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="category" className="block text-gray-700 mb-2">Danh mục sản phẩm</label>
                <select
                  id="category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProduct.category}
                  onChange={handleCategoryChange}
                >
                  <option value="">Chọn danh mục </option>
                  <option value="Áo nỉ">Áo nỉ</option>
                  <option value="Áo dù">Áo dù</option>
                  <option value="Ao kaki">Áo kaki</option>
                  <option value="Playze nam">Playze nam</option>
                  <option value="Áo thun ngắn">Áo thun ngắn</option>
                  <option value="Áo thun dài">Áo thun dài</option>
                  <option value="Áo thun polo">Áo thun polo</option>
                   <option value="Áo sơ mi ngắn tay">Áo sơ mi ngắn tay</option>
                  <option value="Áo sơ mi dài tay">Áo sơ mi dài tay</option>
                  <option value="Quần short kaki">Quần short kaki</option>
                  <option value="Quần jean">Quần jean</option>
                  <option value="Quần kaki">Quần kaki</option>
                  <option value="Quần vải">Quần vải</option>
                  <option value="new">Thêm loại mới</option>
                </select>
                {showNewTypeInput && (
                  <input
                    type="text"
                    className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên danh mục mới"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                  />
                )}
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Thêm sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
