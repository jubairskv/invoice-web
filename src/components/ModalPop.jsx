import React from "react";

const Modal = ({ message, onClose }) => {
  return (
    <div className="fixed font-robotoCondensed inset-0  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-1/3 dark:bg-[#313749] dark:text-white shadow-xl">
        <h2 className="font-roboto text-xl font-bold mb-4 dark:text-white">
          Login Error
        </h2>
        <p className="mb-6 text-gray-700 dark:text-white">{message}</p>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
