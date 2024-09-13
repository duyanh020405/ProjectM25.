// pages/confirmPurchase.tsx
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import swal from "sweetalert";

interface User {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  img: string;
  price: number;
  quantity: number;
  size: string[];
  description: string;
}

export default function ConfirmPurchase() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Fetch user and product information from localStorage or state
    const storedUser = JSON.parse(localStorage.getItem("userOnl") || "{}");
    const storedProduct = JSON.parse(localStorage.getItem("productToBuy") || "{}");

    if (storedUser && storedProduct) {
      setUser(storedUser);
      setProduct(storedProduct);
    } else {
      router.push("/"); // Redirect to homepage or another page if data is not available
    }
  }, [router]);

  const handleConfirm = async () => {
    try {
      // Proceed with purchase logic here
      const response = await axios.post("http://localhost:8080/confirmPurchase", {
        userId: user?.id,
        productId: product?.id,
        quantity: 1, // or based on selected quantity
      });

      if (response.status === 200) {
        swal("Purchase Confirmed", "Your purchase has been confirmed successfully!", "success");
        localStorage.removeItem("productToBuy");
        router.push("/"); // Redirect to homepage or another page after successful purchase
      } else {
        swal("Error", "There was an error confirming your purchase. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error confirming purchase:", error);
      swal("Error", "There was an error confirming your purchase. Please try again.", "error");
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("productToBuy");
    router.push("/"); // Redirect to homepage or another page if purchase is canceled
  };

  if (!user || !product) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl border-2 border-gray-200 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Confirm Purchase</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">User Information</h2>
        <p className="text-gray-700">Name: {user.name}</p>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Product Information</h2>
        <img src={product.img} alt={product.name} className="w-48 h-48 object-cover mb-4" />
        <p className="text-gray-700">Name: {product.name}</p>
        <p className="text-gray-700">Price: ${product.price}</p>
        <p className="text-gray-700">Quantity: {product.quantity}</p>
        <p className="text-gray-700">Size: {product.size}</p>
        <p className="text-gray-700">Description: {product.description}</p>
      </div>
      <div className="flex gap-4">
        <button onClick={handleConfirm} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Confirm Purchase
        </button>
        <button onClick={handleCancel} className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700">
          Cancel
        </button>
      </div>
    </div>
  );
}
