"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { GrLogout } from "react-icons/gr";
import 'bootstrap/dist/css/bootstrap.min.css';  // Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // Bootstrap JavaScript (includes Popper.js)

interface Product {
  id: string;
  name: string;
  img: string;
  description: string;
  quantity: number;
  price: number;
  size: string[];
  category: string;
}

export default function DetailProduct({ params }: { params: { id: string } }) {
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const router = useRouter();
  const [userOnl, setUserOnl] = useState<any>();

  const footerRef = useRef<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/products/${id}`);
        setProduct(response.data);

        const relatedResponse = await axios.get(
          `http://localhost:8080/products?category=${response.data.category}`
        );
        setRelatedProducts(relatedResponse.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const checkUser = () => {
      const user = localStorage.getItem("userOnl");
      if (!user) {
        alert("User not logged in.");
        router.push("/login");
      }
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    const storedUser = localStorage.getItem("userOnl");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser) {
          setUserOnl(parsedUser);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error parsing user:", error);
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, []);

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
  };

  const handleBuyNow = async () => {
    swal({
      title: "Bạn có chắc chắn không?",
      text: "Bạn có chắc chắn muốn mua sản phẩm?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willBuy) => {
      if (willBuy) {
        try {
          const allProductsResponse = await axios.get("http://localhost:8080/products");
          const allProducts = allProductsResponse.data;
          const productToUpdate = allProducts.find((prod: any) => prod.id === id);
  
          if (!productToUpdate) {
            swal("Product not found", { icon: "error" });
            return;
          }
  
          // Check if the product's quantity is sufficient
          if (productToUpdate.quantity <= 0) {
            swal("Out of stock", { icon: "error" });
            return;
          }
  
          // Reduce the product quantity by 1
          productToUpdate.quantity -= 1;
  
          // Update the product quantity on the server
          await axios.patch(`http://localhost:8080/products/${id}`, { quantity: productToUpdate.quantity });
  
          const allUsersResponse = await axios.get("http://localhost:8080/user");
          const allUsers = allUsersResponse.data;
          const currentUser = JSON.parse(localStorage.getItem("userOnl") || "{}");
          const user = allUsers.find((usr: any) => usr.id === currentUser.id);
  
          if (!user) {
            swal("User not found", { icon: "error" });
            return;
          }
  
          // Check if the product already exists in the user's buy array
          const existingProductIndex = user.buy.findIndex((item: any) => item.id === id);
  
          if (existingProductIndex !== -1) {
            // Product exists, update its quantityBuy
            user.buy[existingProductIndex].quantityBuy += 1;
          } else {
            // Product doesn't exist, add it with quantityBuy 1
            user.buy.push({ id, quantityBuy: 1 });
          }
  
          await axios.patch(`http://localhost:8080/user/${user.id}`, { buy: user.buy });
          localStorage.setItem("userOnl", JSON.stringify(user));
          swal("Đã thêm sản phẩm thành công!", { icon: "success" });
        } catch (error) {
          console.error("Có sự cố:", error);
          swal("Có sự cố , thử lại sau", { icon: "error" });
        }
      } else {
        swal("Hoạt động đã bị tạm dừng");
      }
    });
  };
  
  

  const informationUser = () => {
    router.push(`/infor`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Get user name from localStorage
      const user = JSON.parse(localStorage.getItem("userOnl") || "{}");
      
      // Prepare the comment payload
      const payload = {
        comments: {
          User_comment: user.name, // Assuming `user.name` contains the commenter's name
          comment: comment, // The comment text from the state
          idProduct:id
        },
      };

      // Send the POST request to the server
      await axios.post("http://localhost:8080/comments", payload);
      
      alert("Bình luận thành công");
      setComment(""); // Clear the comment input
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };


const handleFavorite = async () => {
  swal({
    title: "Are you sure?",
    text: "Do you want to add this product to your favorites?",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then(async (willLike) => {
    if (willLike) {
      try {
        const allProductsResponse = await axios.get("http://localhost:8080/products");
        const allProducts = allProductsResponse.data;
        const productToLike = allProducts.find((prod: any) => prod.id === id);

        if (!productToLike) {
          swal("Product not found", { icon: "error" });
          return;
        }

        const allUsersResponse = await axios.get("http://localhost:8080/user");
        const allUsers = allUsersResponse.data;
        const currentUser = JSON.parse(localStorage.getItem("userOnl") || "{}");
        const user = allUsers.find((usr: any) => usr.id === currentUser.id);

        if (!user) {
          swal("User not found", { icon: "error" });
          return;
        }

        if (user.like.includes(id)) {
          swal("Already liked this product", { icon: "info" });
          return;
        }

        user.like.push(id);
        await axios.patch(`http://localhost:8080/user/${user.id}`, { like: user.like });

        localStorage.setItem("userOnl", JSON.stringify(user));
        swal("Product liked successfully!", { icon: "success" });
      } catch (error) {
        console.error("Error handling like:", error);
        swal("An error occurred while processing your request.", { icon: "error" });
      }
    } else {
      swal("Your action has been canceled!");
    }
  });
};


  const scrollToFooter = () => {
    footerRef.current.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!product) return <p className="text-center text-gray-600">No product found</p>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl border-2 border-gray-200 rounded-lg shadow-md">
      <div className="fixed top-0 right-0 p-4" style={{display:'flex' , flexDirection:'row'}}>
        <Button>
          <div style={{display:'flex' , flexDirection:'row'}}>
          <FaUserCircle onClick={()=>informationUser(userOnl?.id)} className="text-2xl bg-none" style={{position:'relative',marginTop:5}} />
          <h3 className="text-2xl bg-none">{userOnl?.name}</h3>
          </div>
        </Button>
        <Button>
          <MdOutlineShoppingCart className="text-2xl" />
        </Button>
        <Button onClick={scrollToFooter}>
          <FaSearch href="footer" className="text-2xl" />
        </Button>
        <Button>
        <GrLogout className="text-2xl text-red-600" />
        </Button>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">{product.name}</h1>
      <div className="relative overflow-hidden rounded-lg shadow-lg mb-6">
        <img
          src={product.img}
          alt={product.name}
          style={{ position: "relative", width: 700, height: 600 }}
          className="object-cover w-full h-full h-72 md:h-96"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1">
          <p className="text-lg font-semibold text-gray-800 mb-4">Giá: {product.price} $</p>
          <p className="text-lg font-semibold text-gray-800 mb-4">Số lượng: {product.quantity}</p>
          <p className="text-lg font-semibold text-gray-800 mb-4">Size:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {product.size.map((item: any) => (
              <button
                key={item}
                onClick={() => handleSizeClick(item)}
                className={`px-4 py-2 border-2 rounded-md transition-colors duration-300 ease-in-out ${
                  selectedSize === item
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-200 text-gray-800 border-gray-300"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <p className="text-lg font-semibold text-gray-800 mb-4">Mô tả: {product.description}</p>
          <div className="flex gap-4">
            <button
              onClick={handleFavorite}
              className={`bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out ${
                isFavorite ? "bg-red-700" : ""
              }`}
            >
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </button>
            <button onClick={handleBuyNow} className="w-full bg-blue-700 text-white py-2 px-4 rounded-md">
              Buy now
            </button>
          </div>
        </div>
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="comment" className="block text-gray-700 font-semibold">
              Bình luận:
            </label>
            <textarea
              id="comment"
              name="comment"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
              placeholder="Viết bình luận của bạn..."
              value={comment}
              onChange={handleChange}
            ></textarea>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 ease-in-out"
            >
              Gửi bình luận
            </button>
          </form>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedProducts
          .filter((p) => p.id !== id)
          .map((relatedProduct) => (
            <div key={relatedProduct.id} className="border border-gray-300 rounded-lg p-4 shadow-md">
              <Image src={relatedProduct.img} alt={relatedProduct.name} width={400} height={300} />
              <h3 className="text-lg font-semibold text-gray-900 mt-4">{relatedProduct.name}</h3>
              <p className="text-gray-600 mt-2">$ {relatedProduct.price} </p>
              <button
                className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
                onClick={() => router.push(`/detailProduct/${relatedProduct.id}`)}
              >
                Xem chi tiết
              </button>
            </div>
          ))}
      </div>
      <div>
        {/* Footer */}
  <footer className="text-center text-lg-start bg-body-tertiary text-muted" ref={footerRef}>
    {/* Section: Social media */}
    <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
      {/* Left */}
      <div className="me-5 d-none d-lg-block">
        <span>Get connected with us on social networks:</span>
      </div>
      {/* Left */}
      {/* Right */}
      <div>
        <a href="" className="me-4 text-reset">
          <i className="fab fa-facebook-f" />
        </a>
        <a href="" className="me-4 text-reset">
          <i className="fab fa-twitter" />
        </a>
        <a href="" className="me-4 text-reset">
          <i className="fab fa-google" />
        </a>
        <a href="" className="me-4 text-reset">
          <i className="fab fa-instagram" />
        </a>
        <a href="" className="me-4 text-reset">
          <i className="fab fa-linkedin" />
        </a>
        <a href="" className="me-4 text-reset">
          <i className="fab fa-github" />
        </a>
      </div>
      {/* Right */}
    </section>
    {/* Section: Social media */}
    {/* Section: Links  */}
    <section className="" id="footer">
      <div className="container text-center text-md-start mt-5">
        {/* Grid row */}
        <div className="row mt-3">
          {/* Grid column */}
          <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
            {/* Content */}
            <h6 className="text-uppercase fw-bold mb-4">
              <i className="fas fa-gem me-3" />
              Kenta.com
            </h6>
            <p>
              Shop Kenta là một shop bán quần áo dành cho nam , nơi đây có rất nhiều những sản phẩm
              thích hợp dành cho tất cả mọi người 
            </p>
          </div>
          {/* Grid column */}
          {/* Grid column */}
          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
            {/* Links */}
            <h6 className="text-uppercase fw-bold mb-4">Products</h6>
            <p>
              <a href="#!" className="text-reset">
                Angular
              </a>
            </p>
            <p>
              <a href="#!" className="text-reset">
                React
              </a>
            </p>
            <p>
              <a href="#!" className="text-reset">
                Vue
              </a>
            </p>
            <p>
              <a href="#!" className="text-reset">
                Laravel
              </a>
            </p>
          </div>
          {/* Grid column */}
          {/* Grid column */}
          <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
            {/* Links */}
            <h6 className="text-uppercase fw-bold mb-4">Useful links</h6>
            <p>
              <a href="#!" className="text-reset">
                Pricing
              </a>
            </p>
            <p>
              <a href="#!" className="text-reset">
                Settings
              </a>
            </p>
            <p>
              <a href="#!" className="text-reset">
                Orders
              </a>
            </p>
            <p>
              <a href="#!" className="text-reset">
                Help
              </a>
            </p>
          </div>
          {/* Grid column */}
          {/* Grid column */}
          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
            {/* Links */}
            <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
            <p>
              <i className="fas fa-home me-3" /> New York, NY 10012, US
            </p>
            <p>
              <i className="fas fa-envelope me-3" />
              info@example.com
            </p>
            <p>
              <i className="fas fa-phone me-3" /> + 01 234 567 88
            </p>
            <p>
              <i className="fas fa-print me-3" /> + 01 234 567 89
            </p>
          </div>
          {/* Grid column */}
        </div>
        {/* Grid row */}
      </div>
    </section>
    {/* Section: Links  */}
    {/* Copyright */}
    <div
      className="text-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
    >
      © 2024 Copyright:
      <a className="text-reset fw-bold" href="https://mdbootstrap.com/">
        Kenta.shop
      </a>
    </div>
    {/* Copyright */}
  </footer>
  {/* Footer */}
      </div>
    </div>
  );
}
