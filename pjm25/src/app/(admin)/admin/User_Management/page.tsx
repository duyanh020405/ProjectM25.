"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { TiThMenu } from "react-icons/ti";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";
import Image from "next/image";
import logo from "@/app/logo.png";
import ConfirmationModal from "@/components/ConfirmationModal";
import swal from "sweetalert";

export default function Page() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage, setUsersPerPage] = useState<number>(5);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string>("name");

  const activeStyle = "bg-blue-500 text-white";
  const inactiveStyle = "bg-gray-300 text-black";

  const logoutAdmin = () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (confirmed) {
      localStorage.setItem("admin", "");
      router.push("/login");
    }
  };
  ///////////////////////
  const handleBlockToggle = async () => {
    if (currentUser) {
      swal({
        title: "Are you sure?",
        text: currentUser.block
          ? "Do you want to unblock this user?"
          : "Do you want to block this user?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willToggle) => {
        if (willToggle) {
          try {
            await axios.patch(`http://localhost:8080/user/${currentUser.id}`, {
              block: !currentUser.block,
            });
  
            setUsers(
              users.map((user) =>
                user.id === currentUser.id
                  ? { ...user, block: !currentUser.block }
                  : user
              )
            );
  
            // Hiển thị thông báo thành công với SweetAlert
            swal("Success!", currentUser.block ? "User has been unblocked!" : "User has been blocked!", {
              icon: "success",
            });
            closeModal();
          } catch (error) {
            console.error("Error updating user block status:", error);
            swal("Error!", "Failed to update user status. Please try again.", {
              icon: "error",
            });
          }
        } else {
          swal("Cancelled", "No changes were made to the user's status.", "info");
        }
      });
    }
  };
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/user", {
          params: {
            page: currentPage,
            limit: usersPerPage,
            sortColumn,
            sortDirection,
            searchTerm,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [currentPage, usersPerPage, sortColumn, sortDirection, searchTerm]);

  const handleChoice = (item: string) => {
    setSelectedItem(item);
    localStorage.setItem("choiceManager", JSON.stringify(item));
    router.push(`/admin/${item}`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReset = () => {
    setSearchTerm("");
  };

  const openModal = (user: any) => {
    setCurrentUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentUser(null);
  };

  

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSort = (column: string) => {
    setSortColumn(column);
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc"
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log(filteredUsers);
  };

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-center items-center py-8">
        <Image src={logo} alt="Logo" width={300} height={130} />
      </div>

      <div className="text-center opacity-70 mb-8">
        <h1 className="text-3xl font-bold text-hsl(218, 51%, 25%)">
          Shop KenTa.vn
        </h1>
        <p>
          Nơi mà bạn có thể lựa chọn cho mình những bộ trang phục ưng ý nhất
        </p>
      </div>

      <div className="flex justify-center items-center mb-4">
        <FaRegUserCircle className="mr-2 text-lg" />
        <span className="text-lg">Duy Anh</span>

        <IoIosLogOut
          onClick={logoutAdmin}
          className="text-red-500 cursor-pointer ml-2 text-xl"
        />
      </div>

      <div className="container mx-auto">
        <div
          className="flex"
          style={{ display: "flex", flexDirection: "row", gap: 50 }}
        >
          <div className="bg-gray-800 text-white p-4 w-[300px]">
            <h2 className="text-lg mb-4">
              <TiThMenu />
              Mục lựa chọn :
            </h2>
            <button
              className={`block w-full mb-4 py-2 ${
                selectedItem === "admin" ? activeStyle : inactiveStyle
              }`}
              onClick={() => handleChoice("admin")}
            >
              Admin
            </button>
            <button
              className={`block w-full mb-4 py-2 ${
                selectedItem === "User_Management" ? activeStyle : inactiveStyle
              }`}
              onClick={() => handleChoice("Products_Manger")}
            >
              Products Manager
            </button>
            <button
              className={`block w-full mb-4 py-2 ${
                selectedItem === "Products_Manger" ? activeStyle : inactiveStyle
              }`}
              onClick={() => handleChoice("User_Management")}
            >
              User Management
            </button>
            <button
              className={`block w-full py-2 ${
                selectedItem === "createProducts" ? activeStyle : inactiveStyle
              }`}
              onClick={() => handleChoice("createProducts")}
            >
              Create Products
            </button>
            <br />
            <button
              className={`block w-full py-2 ${selectedItem === 'comment' ? activeStyle : inactiveStyle}`} 
              onClick={() => handleChoice('comment')}
            >
              Comments
            </button>
          </div>

          <div className="relative border border-black p-4 w-[1000px] h-[600px] overflow-auto bg-white">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="border p-2 w-full"
              />
              <button
                onClick={handleReset}
                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
              >
                Reset
              </button>
            </div>

            <table className="min-w-full border-collapse border border-gray-300 text-left table-auto">
              <thead>
                <tr>
                  <th
                    className="border border-gray-300 px-4 py-2 cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Name{" "}
                    {sortColumn === "name" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    className="border border-gray-300 px-4 py-2 cursor-pointer"
                    onClick={() => handleSort("email")}
                  >
                    Email{" "}
                    {sortColumn === "email" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Password</th>
                  <th className="border border-gray-300 px-4 py-2">Phone</th>
                  <th className="border border-gray-300 px-4 py-2">Address</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user: any) => (
                    <tr className="hover:bg-gray-200">
                      <td className="border border-gray-300 px-4 py-2">
                        {user.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {user.email}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={user.password}
                            readOnly
                            className="border p-2 w-full"
                            style={{ fontFamily: "monospace" }}
                          />
                          <button
                            onClick={togglePasswordVisibility}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          >
                            {showPassword ? (
                              <AiFillEyeInvisible />
                            ) : (
                              <AiFillEye />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {user.phone}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {user.address}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          onClick={() => openModal(user)}
                          className={`py-1 px-2 rounded ${
                            user.block
                              ? "bg-red-500 text-white"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {user.block ? "Blocked" : "Active"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex justify-center mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="py-2 px-4 bg-blue-500 text-white rounded"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="mx-4">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="py-2 px-4 bg-blue-500 text-white rounded"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && currentUser && (
        <ConfirmationModal
          isOpen={modalOpen}
          onClose={closeModal}
          onConfirm={handleBlockToggle}
          userName={`Are you sure you want to ${
            currentUser.block ? "unblock" : "block"
          } ${currentUser.name}?`}
        />
      )}
    </div>
  );
}
