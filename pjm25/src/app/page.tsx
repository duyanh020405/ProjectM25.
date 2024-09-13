"use client"
import { GrLogout } from "react-icons/gr";
import 'bootstrap/dist/css/bootstrap.min.css';  // Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // Bootstrap JavaScript (includes Popper.js)
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import logo from "../app/logo.png";
import { Button } from "@/components/ui/button";
import img1 from "@/img/img1.png";
import img2 from "@/img/664dda14edbfae2d6d29f459b05993b3.jpg";
import img3 from "@/img/1.jpg";
import img4 from "@/img/img5.jpg";
import s1 from "@/components/img2/ban-ve-thiet-ke-shop-thoi-trang-1.jpg";
import s2 from "@/components/img2/phoi-ao-thun-nam-voi-quan-au.webp";
import s3 from "@/components/img2/quan-ao-doi-nam-nu-thu-dong.jpg";
import s4 from "@/components/img2/shop-ban-quan-ao-nam-gia-re-tphcm-min.jpg";
import s5 from "@/components/img2/t.jpg";
import s6 from "@/components/img2/thiet-ke-shop-quan-ao-nu-nho-dep-1.jpg";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
};

type Message = {
  text: string;
  href: string;
};

export default function RotatingMessages() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userOnl, setUserOnl] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const messages: Message[] = [
    { text: "Free ship toàn quốc với các sản phẩm trên 500k", href: "" },
    { text: "Sản phẩm được bảo hành", href: "" },
    { text: "Đổi trả sản phẩm sau 7 ngày", href: "" },
    { text: "Hotline mua hàng : (098) 786 4321", href: "" },
  ];

  const images = [s1, s2, s3, s4, s5, s6];
  const adImages = [img1, img2, img3, img4, img1, img2, img3];
  
  useEffect(() => {
    const storedUser = localStorage.getItem("userOnl");
  
    if (!storedUser) {
      router.push("/login");
    } else {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser) {
          setUserOnl(parsedUser);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        router.push("/login");  // Nếu parse lỗi, điều hướng về trang đăng nhập
      }
    }
  }, []);

  const informationUser =(id:any)=>{
  // Chuyển hướng đến trang /infor với id là tham số
  router.push(`/infor`);
  }
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/products");
        setProducts(response.data);
      } catch (error) {
        setError("Error fetching products");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [messages.length]);

  useEffect(() => {
    const autoRotate = setInterval(nextImage, 3000);
    return () => clearInterval(autoRotate);
  }, []);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterProductsByCategory(category);
  };

  const filterProductsByCategory = (category: string) => {
    if (category) {
      const filtered = products.filter((product) =>
        (product.category ? product.category.toLowerCase() : "").includes(category.toLowerCase())
      );
      setProducts(filtered);
    } else {
      axios
        .get("http://localhost:8080/products")
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    }
  };

  const resetFilters = () => {
    setSelectedCategory("");
    axios
      .get("http://localhost:8080/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error resetting filters:", error);
      });
  };

  const filteredProducts = useMemo(() => 
    products.filter((product) =>
      (product.name ? product.name.toLowerCase() : "").includes(searchTerm)
    ), [products, searchTerm]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const viewDetails = (productId: number) => {
    router.push(`/detailProduct/${productId}`);
  };

  //footer
  const footerRef = useRef<any>(null);

  const scrollToFooter = () => {
    footerRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  // contact
  const contact =()=>{
    router.push('/ContactEmail')
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="flex justify-center items-center py-8">
        <Image src={logo} alt="Logo" width={300} height={130} />
      </div>

      <div className="text-center opacity-70 mb-8">
        <h1 className="text-3xl font-bold text-hsl(218, 51%, 25%)">Shop KenTa.vn</h1>
        <p>Nơi mà bạn có thể lựa chọn cho mình những bộ trang phục ưng ý nhất</p>
      </div>

      <div className="mt-12 flex justify-center items-center relative">
        <button
          onClick={prevImage}
          className="absolute left-0 px-4 py-2 bg-gray-300 rounded-full opacity-50 hover:opacity-80"
          aria-label="Previous Image"
        >
          <GrLinkPrevious />
        </button>
        <div className="overflow-hidden max-w-screen-lg">
          <Image
            src={images[currentImageIndex]}
            alt="Rotating image"
            width={1500}
            height={600}
            className="object-cover w-full h-500"
          />
        </div>
        <button
          onClick={nextImage}
          className="absolute right-0 px-4 py-2 bg-gray-300 rounded-full opacity-50 hover:opacity-80"
          aria-label="Next Image"
        >
          <GrLinkNext />
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-4">
      <Select onValueChange={handleCategoryChange} value={selectedCategory}>
  <SelectTrigger className="w-44 bg-black text-white">
    <SelectValue placeholder="Chọn loại áo khoác" />
  </SelectTrigger>
  <SelectContent className="bg-black text-white">
    <SelectItem value="Áo khoác nỉ">Áo nỉ</SelectItem>
    <SelectItem value="Áo khoác dù">Áo dù</SelectItem>
    <SelectItem value="Áo khoác kaki">Áo kaki</SelectItem>
    <SelectItem value="Playzer nam">Playzer nam</SelectItem>
  </SelectContent>
</Select>

<Select onValueChange={handleCategoryChange} value={selectedCategory}>
  <SelectTrigger className="w-44 bg-black text-white">
    <SelectValue placeholder="Chọn loại áo thun" />
  </SelectTrigger>
  <SelectContent className="bg-black text-white">
    <SelectItem value="Áo thun ngắn tay">Áo thun ngắn</SelectItem>
    <SelectItem value="Áo thun dài tay">Áo thun dài</SelectItem>
    <SelectItem value="Áo thun polo">Áo thun polo</SelectItem>
  </SelectContent>
</Select>

<Select onValueChange={handleCategoryChange} value={selectedCategory}>
  <SelectTrigger className="w-44 bg-black text-white">
    <SelectValue placeholder="Chọn loại áo sơ mi" />
  </SelectTrigger>
  <SelectContent className="bg-black text-white">
    <SelectItem value="Áo sơ mi ngắn tay">Áo sơ mi ngắn tay</SelectItem>
    <SelectItem value="Áo sơ mi dài ta">Áo sơ mi dài tay</SelectItem>
  </SelectContent>
</Select>

<Select onValueChange={handleCategoryChange} value={selectedCategory}>
  <SelectTrigger className="w-44 bg-black text-white">
    <SelectValue placeholder="Chọn loại quần " />
  </SelectTrigger>
  <SelectContent className="bg-black text-white">
    <SelectItem value="Quần jean">Quần jean</SelectItem>
    <SelectItem value="Quần kaki">Quần kaki</SelectItem>
    <SelectItem value="Quần vải">Quần vải</SelectItem>
    <SelectItem value="Quần short">Quần short</SelectItem>
  </SelectContent>
</Select>

        <Button onClick={resetFilters} className="bg-red-500">
          Reset
        </Button>
      </div>
      <br /><br />

      <h4>Tìm kiếm sản phẩm :</h4>
      <Input
        type="text"
        placeholder="Tìm kiếm sản phẩm"
        value={searchTerm}
        onChange={handleSearch}
        className="my-4 px-4 py-2 border rounded-lg shadow-sm w-80"
        style={{position:'relative',width:'500px'}}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          currentProducts.map((product:any) => (
            <div
              key={product.id}
              className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <Image
                src={product.img || ""}
                alt={product.name}
                width={300}
                height={200}
                className="object-cover w-full h-48 mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">Name :{product.name}</h2>
              <p className="text-lg font-bold mb-2">Price : {product.price}$</p>
              <Button onClick={() => viewDetails(product.id)} className="w-full bg-red-700 text-white">
                Xem chi tiết
              </Button>
              <Button onClick={() => viewDetails(product.id)} className="w-full bg-blue-700 text-white">
                Buy now
              </Button>
              <Button onClick={() => viewDetails(product.id)} className="w-full bg-yellow-700 text-white">Bình luận sản phẩm </Button>
            </div>
          ))
        )}
      </div>
      <div className="flex justify-center mt-6">
        <Button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-full mx-2"
        >
          Previous
        </Button>
        <Button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastProduct >= filteredProducts.length}
          className="px-4 py-2 bg-gray-300 rounded-full mx-2"
        >
          Next
        </Button>
      </div>


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
      <>
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
</>
<div className="fixed bottom-0 w-full bg-blue-500 text-white py-4" style={{position:'relative',height:60}}>
        <p className="text-center">{messages[currentMessageIndex].text} <button onClick={contact}>/ Contact by your email . Click here!</button></p>
        
</div>

      
    </div>
  );
}
