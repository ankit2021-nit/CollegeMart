import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import AuthContext from "../../contexts/AuthContext";
import Logo from "./logo.svg";
import SimpleAvatar from "../profile/SimpleAvatar";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [nav, setNav] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = localStorage.getItem('cart');
      if (cart) {
        try {
          const cartItems = JSON.parse(cart);
          const count = cartItems.reduce((total, item) => total + item.quantity, 0);
          setCartCount(count);
        } catch (error) {
          console.error('Error parsing cart:', error);
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  const navItems = [
    { id: 1, text: "Home", path: "/" },
    { id: 2, text: "Products", path: "/products" },
    { id: 3, text: "Add Products", path: "/home/form" },
    { id: 4, text: "Cart", path: "/cart" },
    { id: 5, text: "Contact Us", path: "/contactus" },
  ];

  const handleNav = () => setNav(!nav);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Search query:", searchQuery);
  };

  return (
    <div className="bg-[#925FE2] shadow-lg flex justify-between z-20 items-center h-20 w-full px-6 text-white fixed">
      <div className="flex items-center space-x-2">
        <div className="w-24 max-w-24">
          <img src={Logo} alt="Logo" />
        </div>
      </div>

      <ul className="hidden md:flex space-x-4">
        {navItems.map((item) => (
          <li
            key={item.id}
            className="p-4 hover:bg-white rounded-xl m-2 cursor-pointer duration-300 hover:text-black"
          >
            <Link to={item.path}>{item.text}</Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center space-x-4">
        <form onSubmit={handleSearchSubmit} className="hidden md:flex">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-4 py-2 rounded-lg text-black"
            placeholder="Search..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 text-white rounded-lg"
          >
            Search
          </button>
        </form>

        <div className="block md:hidden" onClick={handleNav}>
          {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
        </div>
      </div>

      <ul
        className={`fixed top-0 left-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500 ${
          nav ? "left-0" : "left-[-100%]"
        } md:hidden`}
      >
        <h1 className="w-full text-3xl font-bold text-[#00df9a] m-4">REACT.</h1>
        {navItems.map((item) => (
          <li
            key={item.id}
            className="p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600"
          >
            <Link to={item.path}>{item.text}</Link>
          </li>
        ))}
        <li className="p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600">
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="px-4 py-2 rounded-lg text-black w-full"
              placeholder="Search..."
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 text-white rounded-lg"
            >
              Search
            </button>
          </form>
        </li>
        <li className="p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600">
          <Link to="/cart" className="flex items-center">
            <AiOutlineShoppingCart className="mr-2" size={20} />
            Cart ({cartCount})
          </Link>
        </li>
      </ul>

      <div className="relative flex items-center space-x-4">
        {/* Cart Icon */}
        <Link to="/cart" className="relative p-2 text-white hover:text-gray-200 transition-colors">
          <AiOutlineShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
        
        {user ? (
          <>
            <button
              id="dropdownDefaultButton"
              onClick={toggleDropdown}
              className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
            >
              <SimpleAvatar user={user} size={32} showGender={true} className="mr-2" />
              <span className="mr-2">{user.name}</span>
              <svg
                className="w-2.5 h-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            {isDropdownOpen && (
              <div
                id="dropdown"
                className="absolute top-full mt-2 z-10 bg-white divide-y divide-gray-100 w-44 rounded-lg shadow dark:bg-gray-700"
              >
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <Link
                      to="/home/profile"
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left flex items-center"
                    >
                      <AiOutlineUser className="mr-2" />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left flex items-center"
                      onClick={logout}
                    >
                      <AiOutlineLogout className="mr-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </>
        ) : (
          <Link
            to="/login"
            className="flex items-center px-5 py-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 text-sm font-medium rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <AiOutlineUser className="mr-2" />
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
