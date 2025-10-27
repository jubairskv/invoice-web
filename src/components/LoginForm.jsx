import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FaUser, FaLock } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from "react-router-dom";

// Validation schema
const validationSchema = Yup.object({
  userName: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginForm = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Formik
      initialValues={{
        userName: "",
        password: "",
        rememberMe: false,
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values);
        onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="w-full max-w-md font-robotoCondensed">
          <div className="mb-6 dark:bg-[#161D31] dark:text-white">
            <label className="block text-gray-700 text-sm font-bold mb-2 dark:bg-[#161D31] dark:text-white">
              User Name
            </label>
            <div className="relative dark:bg-[#161D31] dark:text-white">
              <Field
                name="userName"
                type="text"
                placeholder="Enter User Name"
                className="w-full px-3 py-2 border dark:bg-[#161D31] dark:text-white rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {errors.userName && touched.userName && (
              <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2 dark:bg-[#161D31] dark:text-white">
              Password
            </label>
            <div className="relative dark:bg-[#161D31] dark:text-white">
              <Field
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter User Password"
                className="w-full px-3 py-2 dark:bg-[#161D31] dark:text-white border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FiEyeOff className="rounded-md dark:bg-[#161D31]" />
                ) : (
                  <FiEye className="rounded-md dark:bg-[#161D31]" />
                )}
              </div>
            </div>
            {errors.password && touched.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          

          {/* <div className="mb-6 flex items-center dark:bg-[#161D31] dark:text-white">
            <Field
              name="rememberMe"
              type="checkbox"
              className="mr-2"
            />
            <label
              htmlFor="rememberMe"
              className="text-sm text-gray-700 dark:bg-[#161D31] dark:text-white"
            >
              Remember Me
            </label>
          </div> */}

          {/* <div className="mb-6 text-sm text-blue-500 cursor-pointer">
            <Link to="/forgotpassword">Forgot Password?</Link>
          </div> */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
