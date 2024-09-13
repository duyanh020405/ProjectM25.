"use client";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import { IoIosLogOut } from 'react-icons/io';
import Image from "next/image";
import '@/components/css/comment.css'
interface Comment {
    comments: {
        User_comment: string;
        comment: string;
        idProduct: string;
    };
    id: number;
}

const activeStyle = "bg-blue-500 text-white";
const inactiveStyle = "bg-gray-300 text-black";

export default function Page() {
    const [allComments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get('http://localhost:8080/comments');
                console.log("res", response.data);
                if (Array.isArray(response.data)) {
                    setComments(response.data); // Cập nhật trạng thái với mảng bình luận
                } else {
                    throw new Error('Data format is incorrect');
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
                setError('Failed to fetch comments');
            } finally {
                setLoading(false); // Đảm bảo trạng thái loading được cập nhật
            }
        };

        fetchComments();
    }, []);

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

    const logoutAdmin = () => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
        if (confirmed) {
            localStorage.setItem('admin', '');
            router.push('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex justify-center items-center py-8">
                <Image src="/logo.png" alt="Logo" width={300} height={130} />
            </div>

            <div className="text-center opacity-70 mb-8">
                <h1 className="text-3xl font-bold text-hsl(218, 51%, 25%)">Shop KenTa.vn</h1>
                <p>Nơi mà bạn có thể lựa chọn cho mình những bộ trang phục ưng ý nhất</p>
            </div>

            <div className="flex justify-center items-center mb-4">
                <FaRegUserCircle className="mr-2 text-lg" />
                <span className="text-lg">Duy Anh</span>
                <h1>Admin Work in here !</h1>
                <IoIosLogOut onClick={logoutAdmin} className="text-red-500 cursor-pointer ml-2 text-xl" />
            </div>
            <div>
            <div className="container mx-auto border-4">
                <div className="flex" style={{display:'flex' , flexDirection:"row" , gap:100}}>
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
                            className={`block w-full py-2 ${selectedItem === 'Products_Manager' ? activeStyle : inactiveStyle}`} 
                            onClick={() => handleChoice('Products_Manager')}
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
                    <div className="flex-1 border-4 border-black">
    <h1 className="text-2xl font-bold mb-4">Comments</h1>
    {loading && <p>Loading comments...</p>}
    {error && <p className="text-red-500">{error}</p>}
    {!loading && !error && allComments.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
            <thead>
                <tr className="bg-gray-100 border-b">
                    <th className="p-4 text-left">User Comment</th>
                    <th className="p-4 text-left">Comment</th>
                    <th className="p-4 text-left">Product ID</th>
                </tr>
            </thead>
            <tbody>
                {allComments.map((comment) => (
                    <tr key={comment.id} className="border-b">
                        <td className="p-4">{comment.comments.User_comment}</td>
                        <td className="p-4">{comment.comments.comment}</td>
                        <td className="p-4">{comment.comments.idProduct}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    ) : (
        !loading && !error && <p>No comments available.</p>
    )}
</div>

                </div>
                </div>
            </div>
        </div>
    );
}
