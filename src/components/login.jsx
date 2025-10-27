import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./ModalPop";
import LoginForm from "./LoginForm";
import Logo from "../assets/Data.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle form submission with Formik
  const handleFormSubmit = (values) => {
    try {
      // Password validation
      if (!values.password || values.password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long.");
        setShowModal(true);
        return;
      }

      if (!values.userName || values.userName.length < 3) {
        setErrorMessage("Username must be at least 3 characters long.");
        setShowModal(true);
        return;
      }

      // Check for common weak passwords
      const weakPasswords = [
        "password",
        "123456",
        "12345678",
        "qwerty",
        "abc123",
        "password123",
      ];
      if (weakPasswords.includes(values.password.toLowerCase())) {
        setErrorMessage(
          "Password is too weak. Please choose a stronger password."
        );
        setShowModal(true);
        return;
      }

      // Check if password contains at least one number
      if (!/\d/.test(values.password)) {
        setErrorMessage("Password must contain at least one number.");
        setShowModal(true);
        return;
      }

      // Check if password contains at least one letter
      if (!/[a-zA-Z]/.test(values.password)) {
        setErrorMessage("Password must contain at least one letter.");
        setShowModal(true);
        return;
      }

      // If all validations pass, create session
      const sessionData = {
        isLoggedIn: true,
        userName: values.userName,
        password: values.password,
        loginTime: new Date().toISOString(),
        rememberMe: values.rememberMe,
      };

      localStorage.setItem("session", JSON.stringify(sessionData));

      // Redirect to main application
      navigate("/invoice-web/home");
    } catch {
      setErrorMessage("An error occurred during login. Please try again.");
      setShowModal(true);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen font-robotoCondensed bg-color-white">
      <div className="w-full lg:w-[50%] h-[40vh] lg:h-full flex flex-col justify-center items-center overflow-hidden">
        <img
          src={Logo}
          alt="logo"
          className="w-full h-full object-contain lg:object-cover max-w-md lg:max-w-none"
        />
      </div>

      <div className="mx-auto my-auto px-4 dark:bg-slate-900 dark:text-white py-2 sm:w-[40%] md:w-[40%] lg:w-[40%] xl:w-[40%]">
        <div className="flex flex-col items-start mb-10">
          <h1 className="font-roboto font-bold dark:bg-slate-900 dark:text-white text-4xl text-wrap text-start p-0 sm:p-16 md:p-0 lg:p-0 mt-10">
            Welcome to Edstruments !
          </h1>
          <p className="pt-2 text-color-dark-gray text-wrap sm:text-wrap text-start">
            Manage operations seamlessly on one platform.
          </p>
        </div>
        <div className="absolute top-4  dark:text-white right-36">
          {/* <ThemeToggle /> */}
        </div>
        <LoginForm onSubmit={handleFormSubmit} />
      </div>

      {showModal && (
        <Modal message={errorMessage} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default Login;
