import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const ComingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <div className="max-w-lg w-full mx-auto">
        <div className="mb-8 flex justify-center items-center bg-gray-200 rounded-full w-24 h-24">
          <svg
            className="w-16 h-16 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 16h.01M12 16h.01M16 16h.01M9 12h6M12 8h.01M12 12h.01M12 20h.01M8 20h.01M16 20h.01"
            ></path>
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Coming Soon!</h1>
        <p className="text-lg text-gray-600 mb-6">We&apos;re working hard to get our website ready. Stay tuned!</p>
        <div className="flex justify-center space-x-4 mb-8">
          <a href="#" className="text-blue-600 hover:text-blue-800 transition">
            <FaFacebookF size={24} />
          </a>
          <a href="#" className="text-blue-500 hover:text-blue-700 transition">
            <FaTwitter size={24} />
          </a>
          <a href="#" className="text-pink-600 hover:text-pink-800 transition">
            <FaInstagram size={24} />
          </a>
          <a href="#" className="text-blue-700 hover:text-blue-900 transition">
            <FaLinkedinIn size={24} />
          </a>
        </div>

      </div>
    </div>
  );
};

export default ComingSoon;
