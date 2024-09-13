"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';

// Types for Product
interface Product {
    id: string;
    name: string;
    price: string;
    img: string;
    size: string[];
    quantity: string;
    category: string;
    description: string;
}

const EditProductPage = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const router = useRouter();

    // Fetch product data on client-side
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8080/products/${id}`);
                if (!response.ok) throw new Error('Failed to fetch product data');
                const data = await response.json();
                setProduct(data);
                setSelectedSizes(data.size); // Initialize selected sizes from the fetched product
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        fetchProduct();
    }, [id]);

    // Handle Update
    const handleUpdateProduct = async (updatedProduct: Product) => {
        try {
            await axios.put(`http://localhost:8080/products/${id}`, updatedProduct);
            Swal.fire('Success', 'Product updated successfully', 'success');
            router.push('/products'); // Redirect after successful update
        } catch (error) {
            Swal.fire('Error', 'Failed to update product', 'error');
            console.error('Error updating product:', error);
        }
    };

    // Handle form submit
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (product) {
            handleUpdateProduct({ ...product, size: selectedSizes });
        }
    };

    // Handle size button click
    const handleSizeClick = (size: string) => {
        setSelectedSizes(prevSizes => 
            prevSizes.includes(size) 
                ? prevSizes.filter(s => s !== size) 
                : [...prevSizes, size]
        );
    };

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProduct(prev => ({
            ...prev!,
            [e.target.name]: e.target.value
        }));
    };

    const sizeOptions = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
            {product ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                            type="text"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input
                            type="text"
                            name="img"
                            value={product.img}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Size</label>
                        <div className="flex flex-wrap gap-2">
                            {sizeOptions.map(size => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => handleSizeClick(size)}
                                    className={`px-4 py-2 border rounded-md ${selectedSizes.includes(size) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Quantity</label>
                        <input
                            type="text"
                            name="quantity"
                            value={product.quantity}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Update Product
                        </button>
                    </div>
                </form>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default EditProductPage;
