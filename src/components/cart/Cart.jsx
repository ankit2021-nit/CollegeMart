import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import AuthContext from '../../contexts/AuthContext';
import Navbar from '../new-home-page/navbar';

const Cart = () => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        calculateTotal(parsedCart);
      } catch (error) {
        console.error('Error parsing cart data:', error);
        setCartItems([]);
      }
    }
    setLoading(false);
  }, []);

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotal(sum);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    setTotal(0);
  };

  const handleCheckout = () => {
    if (!user) {
      alert('Please login to checkout');
      return;
    }
    // Implement checkout logic here
    alert('Checkout functionality coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link to="/home" className="flex items-center text-purple-600 hover:text-purple-700">
                <FaArrowLeft className="mr-2" />
                Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 flex items-center"
              >
                <FaTrash className="mr-2" />
                Clear Cart
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <FaShoppingCart className="mx-auto text-6xl text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">Add some products to get started!</p>
              <Link
                to="/products"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Cart Items ({cartItems.length})</h2>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <img
                            src={item.image || 'https://via.placeholder.com/80'}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">{item.name}</h3>
                            <p className="text-gray-600 text-sm">{item.description}</p>
                            <p className="text-purple-600 font-semibold">₹{item.price}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">₹{item.price * item.quantity}</p>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>Free</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span>₹{total}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                  >
                    Proceed to Checkout
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Secure checkout powered by College Mart
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
