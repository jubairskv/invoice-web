import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  FaBuilding,
  FaFileInvoice,
  FaCalendarAlt,
  FaChevronDown,
  FaPlus,
  FaSignOutAlt,
} from "react-icons/fa";
import { VscSend } from "react-icons/vsc";
import { TbMessage } from "react-icons/tb";
import { FiUpload, FiCheck } from "react-icons/fi";
import { pdfjs } from "react-pdf";
import PdfComponent from "./pdfcomp";
import { Player } from "@lottiefiles/react-lottie-player";
import FileCheck from "../assets/File Search.json";
import invoice from "../assets/Jubair K.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// Enhanced validation schema with comprehensive validation
const validationSchema = Yup.object({
  vendor: Yup.string()
    .required("Vendor is required")
    .min(2, "Vendor name must be at least 2 characters"),
  purchaseOrderNumber: Yup.string()
    .required("Purchase Order Number is required")
    .matches(/^PO-\d{4}-\d{3}$/, "PO Number must be in format PO-YYYY-XXX"),
  invoiceNumber: Yup.string()
    .required("Invoice Number is required")
    .matches(/^INV-\d{3}$/, "Invoice Number must be in format INV-XXX"),
  totalAmount: Yup.number()
    .required("Total Amount is required")
    .min(0.01, "Amount must be greater than 0")
    .max(999999.99, "Amount cannot exceed $999,999.99"),
  invoiceDueDate: Yup.string()
    .required("Invoice Due Date is required")
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in MM/DD/YYYY format"),
  invoiceDescription: Yup.string()
    .required("Invoice Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
  invoiceDate: Yup.string()
    .required("Invoice Date is required")
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in MM/DD/YYYY format"),
  paymentTerms: Yup.string().required("Payment Terms is required"),
  glPostDate: Yup.string()
    .required("GL Post Date is required")
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in MM/DD/YYYY format"),
  lineAmount: Yup.number()
    .required("Line Amount is required")
    .min(0.01, "Amount must be greater than 0")
    .max(999999.99, "Amount cannot exceed $999,999.99"),
  account: Yup.string().required("Account is required"),
  description: Yup.string()
    .required("Description is required")
    .min(5, "Description must be at least 5 characters")
    .max(200, "Description cannot exceed 200 characters"),
  department: Yup.string().required("Department is required"),
  location: Yup.string().required("Location is required"),
  comments: Yup.string().max(1000, "Comments cannot exceed 1000 characters"),
});

// Dummy data for form population
const dummyData = {
  fileName: invoice,
  vendor: "A-1 Exterminators",
  purchaseOrderNumber: "PO-2024-001",
  invoiceNumber: "INV-001",
  totalAmount: 1250.0,
  invoiceDueDate: "12/31/2024",
  invoiceDescription:
    "Monthly pest control services for office building - comprehensive treatment",
  invoiceDate: "12/01/2024",
  paymentTerms: "Net 30",
  glPostDate: "12/15/2024",
  lineAmount: 1250.0,
  account: "Office Supplies",
  description: "Professional pest control services for office building",
  department: "Facilities",
  location: "Main Office",
  comments:
    "Regular monthly service - all areas treated including kitchen and storage areas",
};

function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Vendor Details");
  const [expenseToggle, setExpenseToggle] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showClearDataPopup, setShowClearDataPopup] = useState(false);
  const autoSaveTimeoutRef = useRef(null);

  const tabs = ["Vendor Details", "Invoice Details", "Comments"];

  // Load saved file info on component mount
  useEffect(() => {
    const savedFileInfo = loadSavedFileInfo();
    if (savedFileInfo) {
      // Create a mock file object from saved info
      const mockFile = {
        name: savedFileInfo.name,
        size: savedFileInfo.size,
        type: savedFileInfo.type,
        lastModified: savedFileInfo.lastModified,
        isRestored: true, // Flag to indicate this is a restored file
      };

      // Set the uploaded file state
      setUploadedFile(mockFile);

      // If it's the assets PDF, use the imported file URL
      if (savedFileInfo.name === "Jubair K.pdf") {
        setFileUrl(invoice);
        console.log("Assets PDF restored successfully");
      } else if (savedFileInfo.data) {
        // For uploaded files with base64 data, recreate the file URL
        setFileUrl(savedFileInfo.data);
        console.log("Uploaded file restored successfully:", savedFileInfo.name);
      } else {
        // Fallback for files without data
        console.log(
          "File info restored but no data available:",
          savedFileInfo.name
        );
        setFileUrl(null);
      }

      console.log("File state restored from localStorage");
    }
  }, []);

  // Load saved data from localStorage on component mount
  const loadSavedData = () => {
    try {
      const savedData = localStorage.getItem("invoiceFormData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log("Loaded data from localStorage:", parsedData);
        return parsedData;
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      // Clear corrupted data
      localStorage.removeItem("invoiceFormData");
    }
    return {};
  };

  // Load saved file info from localStorage
  const loadSavedFileInfo = () => {
    try {
      const savedFileInfo = localStorage.getItem("invoiceFileInfo");
      if (savedFileInfo) {
        const parsedFileInfo = JSON.parse(savedFileInfo);
        console.log("Loaded file info from localStorage:", parsedFileInfo);
        return parsedFileInfo;
      }
    } catch (error) {
      console.error("Error loading file info from localStorage:", error);
      // Clear corrupted data
      localStorage.removeItem("invoiceFileInfo");
    }
    return null;
  };

  // Save data to localStorage
  const saveData = (values) => {
    try {
      localStorage.setItem("invoiceFormData", JSON.stringify(values));
      console.log("Data saved to localStorage:", values);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  // Auto-save data to localStorage
  const autoSaveData = (values) => {
    try {
      // Only save if there's actual data to save
      const hasData = Object.values(values).some(
        (value) => value && value.toString().trim() !== ""
      );

      if (hasData) {
        localStorage.setItem("invoiceFormData", JSON.stringify(values));
        console.log("Auto-saved data to localStorage");
      }
    } catch (error) {
      console.error("Error auto-saving to localStorage:", error);
    }
  };

  // Save file information to localStorage
  const saveFileInfo = (file) => {
    try {
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onload = function (e) {
        const fileInfo = {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          data: e.target.result, // Base64 data
        };
        localStorage.setItem("invoiceFileInfo", JSON.stringify(fileInfo));
        console.log("File info and data saved to localStorage:", fileInfo.name);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error saving file info to localStorage:", error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("session");
    localStorage.removeItem("invoiceFormData");
    localStorage.removeItem("invoiceFileInfo");
    navigate("/");
  };

  // Handle PDF file upload
  const handleFileUpload = (event, setFieldValue) => {
    const file = event.target.files[0];
    console.log("File selected:", file);

    if (!file) {
      console.log("No file selected");
      return;
    }

    // Check file type
    if (file.type !== "application/pdf") {
      console.log("Invalid file type:", file.type);
      alert("Please select a valid PDF file");
      // Reset the file input
      event.target.value = "";
      return;
    }

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      console.log("File too large:", file.size);
      alert("File size must be less than 10MB");
      // Reset the file input
      event.target.value = "";
      return;
    }

    console.log("PDF file uploaded successfully");

    // Set the uploaded file
    setUploadedFile(file);

    // Create file URL for viewing
    const url = URL.createObjectURL(file);
    setFileUrl(url);

    // Save file information and data to localStorage
    saveFileInfo(file);

    // Auto-populate some form fields based on filename
    const fileName = file.name.replace(".pdf", "");
    if (setFieldValue) {
      setFieldValue("invoiceNumber", fileName);
    }
  };

  // Clear uploaded file and reset file input
  const clearUploadedFile = () => {
    setUploadedFile(null);
    // Clean up the file URL to free memory (only if it's not the assets PDF)
    if (fileUrl && fileUrl !== invoice) {
      URL.revokeObjectURL(fileUrl);
    }
    setFileUrl(null);
    // Clear file info from localStorage
    localStorage.removeItem("invoiceFileInfo");
    // Reset the file input to allow re-upload
    const fileInput = document.getElementById("pdf-upload");
    if (fileInput) {
      fileInput.value = "";
    }
    console.log("Uploaded file cleared");
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e, setFieldValue) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    console.log("Files dropped:", files);

    if (!files || !files[0]) {
      console.log("No files dropped");
      return;
    }

    const file = files[0];

    // Check file type
    if (file.type !== "application/pdf") {
      console.log("Invalid file type dropped:", file.type);
      alert("Please drop a valid PDF file");
      return;
    }

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      console.log("File too large:", file.size);
      alert("File size must be less than 10MB");
      return;
    }

    console.log("PDF file dropped successfully");

    // Set the uploaded file
    setUploadedFile(file);

    // Create file URL for viewing
    const url = URL.createObjectURL(file);
    setFileUrl(url);

    // Save file information and data to localStorage
    saveFileInfo(file);

    // Auto-populate some form fields based on filename
    const fileName = file.name.replace(".pdf", "");
    if (setFieldValue) {
      setFieldValue("invoiceNumber", fileName);
    }
  };

  // Populate form with dummy data and upload PDF file
  const populateDummyData = (setFieldValue) => {
    // Populate form fields
    Object.keys(dummyData).forEach((key) => {
      setFieldValue(key, dummyData[key]);
    });

    // Create a mock file object from the assets PDF
    const mockFile = {
      name: "Jubair K.pdf",
      size: 199 * 1024, // Approximate size in bytes (199KB)
      type: "application/pdf",
      lastModified: Date.now(),
    };

    // Set the uploaded file state
    setUploadedFile(mockFile);

    // Create file URL for viewing (using the imported PDF)
    setFileUrl(invoice);

    // Save file information to localStorage
    saveFileInfo(mockFile);

    console.log("Dummy data populated and PDF file uploaded from assets");
  };

  // Clear saved data from localStorage and reset form
  const clearSavedData = (setFieldValue) => {
    // Clear localStorage data
    localStorage.removeItem("invoiceFormData");
    localStorage.removeItem("invoiceFileInfo");

    // Clear uploaded file
    clearUploadedFile();

    // Reset all form fields to empty
    if (setFieldValue) {
      const formFields = [
        "fileName",
        "vendor",
        "purchaseOrderNumber",
        "invoiceNumber",
        "totalAmount",
        "invoiceDueDate",
        "invoiceDescription",
        "invoiceDate",
        "paymentTerms",
        "glPostDate",
        "lineAmount",
        "account",
        "description",
        "department",
        "location",
        "comments",
      ];

      formFields.forEach((field) => {
        setFieldValue(field, "");
      });
    }

    // Show popup notification
    setShowClearDataPopup(true);

    // Hide popup after 3 seconds
    setTimeout(() => {
      setShowClearDataPopup(false);
    }, 3000);

    console.log("All data cleared successfully");
  };

  return (
    <Formik
      initialValues={{
        fileName: "",
        vendor: "",
        purchaseOrderNumber: "",
        invoiceNumber: "",
        totalAmount: "",
        invoiceDueDate: "",
        invoiceDescription: "",
        invoiceDate: "",
        paymentTerms: "",
        glPostDate: "",
        lineAmount: "",
        account: "",
        description: "",
        department: "",
        location: "",
        comments: "",
        ...loadSavedData(),
      }}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={(values, { setSubmitting, setStatus, setFieldValue }) => {
        try {
          // Validate that line amount doesn't exceed total amount
          if (values.lineAmount > values.totalAmount) {
            setStatus({ error: "Line Amount cannot exceed Total Amount" });
            setSubmitting(false);
            return;
          }

          // Validate date formats and logic
          const invoiceDate = new Date(values.invoiceDate);
          const dueDate = new Date(values.invoiceDueDate);
          const glPostDate = new Date(values.glPostDate);

          if (dueDate < invoiceDate) {
            setStatus({
              error: "Invoice Due Date cannot be before Invoice Date",
            });
            setSubmitting(false);
            return;
          }

          if (glPostDate < invoiceDate) {
            setStatus({ error: "GL Post Date cannot be before Invoice Date" });
            setSubmitting(false);
            return;
          }

          // Save data to localStorage
          saveData(values);

          // Clear any previous errors
          setStatus({
            success:
              "Invoice submitted successfully! Data has been saved to localStorage.",
          });
          setSubmitting(false);

          // Show success message and auto-populate form
          setTimeout(() => {
            // Show popup notification
            setShowSuccessPopup(true);
            // Auto-populate form with saved data
            const savedData = loadSavedData();
            Object.keys(savedData).forEach((key) => {
              setFieldValue(key, savedData[key]);
            });
            // Clear uploaded file to start fresh
            clearUploadedFile();

            // Hide popup after 5 seconds
            setTimeout(() => {
              setShowSuccessPopup(false);
            }, 5000);
          }, 100);
        } catch (error) {
          console.error("Submission error:", error);
          setStatus({
            error: "An error occurred while submitting. Please try again.",
          });
          setSubmitting(false);
        }
      }}
    >
      {({ errors, touched, setFieldValue, values, isSubmitting }) => {
        // Auto-save data when form values change (debounced)
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
        }

        autoSaveTimeoutRef.current = setTimeout(() => {
          autoSaveData(values);
        }, 1000); // Debounce auto-save by 1 second

        return (
          <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-8">
                  <button className="text-blue-600 hover:text-blue-800 mr-3 text-lg">
                    ←
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Create New Invoice
                  </h1>

                  {/* Tabs Section */}
                  <div className="flex justify-center ml-[500px] space-x-8">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative pb-3 text-base transition-colors ${
                          activeTab === tab
                            ? "text-sky-500 font-bold"
                            : "text-gray-600 font-normal hover:text-gray-900"
                        }`}
                      >
                        {tab}
                        {activeTab === tab && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FaSignOutAlt className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Success Popup Notification */}
            {showSuccessPopup && (
              <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-in">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Success!</p>
                  <p className="text-sm">
                    Invoice submitted successfully! Data has been saved to
                    localStorage.
                  </p>
                </div>
                <button
                  onClick={() => setShowSuccessPopup(false)}
                  className="text-green-200 hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Clear Data Popup Notification */}
            {showClearDataPopup && (
              <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-in">
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Data Cleared!</p>
                  <p className="text-sm">
                    All form data and uploaded files have been cleared
                    successfully.
                  </p>
                </div>
                <button
                  onClick={() => setShowClearDataPopup(false)}
                  className="text-red-200 hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}

            <div className="flex min-h-screen">
              {/* Left Panel - Invoice Upload */}
              <div className="w-[50%] bg-gray-200 p-8">
                <div
                  className={`bg-white border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
                    isDragOver
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-400 hover:border-blue-500"
                  }`}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, setFieldValue)}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {isDragOver
                      ? "Drop PDF Here"
                      : uploadedFile
                      ? "Upload Another Invoice"
                      : "Upload Your Invoice"}
                  </h2>
                  <p className="text-black mb-8 text-lg">
                    {isDragOver
                      ? "Release to upload"
                      : uploadedFile
                      ? "Drop another PDF or click upload"
                      : "To auto-populate fields and save time"}
                  </p>

                  {uploadedFile ? (
                    <div className="mb-6">
                      {/* Success indicator */}
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <FiCheck className="w-5 h-5 text-white" />
                        </div>
                        <span className="ml-2 text-green-600 font-semibold">
                          PDF Uploaded Successfully
                        </span>
                      </div>

                      {/* File info */}
                      <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {uploadedFile.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                if (fileUrl) {
                                  window.open(fileUrl, "_blank");
                                }
                              }}
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                            >
                              View PDF
                            </button>
                            <button
                              onClick={clearUploadedFile}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                      <PdfComponent fileUrl={fileUrl} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Player
                        src={FileCheck}
                        autoplay
                        loop
                        className="w-72 h-72"
                      />
                    </div>
                  )}

                  <div className="flex flex-col items-center">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, setFieldValue)}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label
                      htmlFor="pdf-upload"
                      className="bg-white border-2 border-gray-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors mb-4 flex items-center justify-center cursor-pointer w-48 shadow-lg"
                      onClick={() => {
                        // Clear the file input first to ensure it opens properly
                        const fileInput = document.getElementById("pdf-upload");
                        if (fileInput) {
                          fileInput.value = "";
                          // Use setTimeout to ensure the reset happens before opening dialog
                          setTimeout(() => {
                            fileInput.click();
                          }, 10);
                        }
                      }}
                    >
                      <FiUpload className="w-5 h-5 mr-2 text-black" />
                      {uploadedFile ? "Upload Another" : "Upload File"}
                    </label>

                    <div className="flex items-center gap-2 text-gray-500 mb-4">
                      <p className="text-sm">
                        <span className="font-semibold text-sky-400">
                          Click to upload{" "}
                        </span>
                        or drag and drop
                      </p>
                    </div>s
                  </div>
                </div>
              </div>

              {/* Right Panel - Form Details */}
              <div className="flex-1 bg-gray-200 p-8">
                <Form>
                  {/* Vendor Details */}
                  <div className="mb-10">
                    <div className="flex items-center mb-6">
                      <div className="bg-blue-200 rounded-full p-4">
                        <FaBuilding className="w-5 h-5 text-sky-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 ml-3">
                        Vendor Details
                      </h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Vendor <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Field
                            as="select"
                            name="vendor"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white text-gray-400 border-black appearance-none ${
                              errors.vendor && touched.vendor
                                ? "border-red-500"
                                : "border-black"
                            }`}
                          >
                            <option value="">Select Vendor</option>
                            <option value="A-1 Exterminators">
                              A-1 Exterminators
                            </option>
                            <option value="ABC Services">ABC Services</option>
                            <option value="XYZ Corp">XYZ Corp</option>
                          </Field>
                          <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        {errors.vendor && touched.vendor && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.vendor}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-center">
                        <button
                          type="button"
                          className="flex items-center text-blue-600 hover:text-blue-800 text-base font-semibold transition-colors"
                        >
                          <FaChevronDown className="w-3 h-3 mr-2" />
                          View Vendor Details
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Details */}
                  <div className="mb-10">
                    <div className="flex items-center mb-6">
                      <div className="bg-blue-200 rounded-full p-4 mr-4">
                        <FaFileInvoice className="w-5 h-5 text-sky-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 ml-3">
                        Invoice Details
                      </h3>
                    </div>

                    {/* General Information Section */}
                    <div className="mb-6">
                      <h4 className="text-xl font-bold text-gray-900">
                        General Information
                      </h4>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Purchase Order Number{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Field
                          as="select"
                          name="purchaseOrderNumber"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-400 border-black appearance-none ${
                            errors.purchaseOrderNumber &&
                            touched.purchaseOrderNumber
                              ? "border-red-500"
                              : "border-black"
                          }`}
                        >
                          <option value="">Select PO Number</option>
                          <option value="PO-2024-001">PO-2024-001</option>
                          <option value="PO-2024-002">PO-2024-002</option>
                          <option value="PO-2024-003">PO-2024-003</option>
                        </Field>
                        <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                      {errors.purchaseOrderNumber &&
                        touched.purchaseOrderNumber && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.purchaseOrderNumber}
                          </p>
                        )}
                    </div>

                    {/* Invoice Details Section */}
                    <div className="mb-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">
                        Invoice Details
                      </h4>

                      <div className="grid grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                          {/* Invoice Details Section */}

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Invoice Number{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Field
                                as="select"
                                name="invoiceNumber"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-400 border-black appearance-none ${
                                  errors.invoiceNumber && touched.invoiceNumber
                                    ? "border-red-500"
                                    : "border-black"
                                }`}
                              >
                                <option value="">Select Vendor</option>
                                <option value="INV-001">INV-001</option>
                                <option value="INV-002">INV-002</option>
                                <option value="INV-003">INV-003</option>
                              </Field>
                              <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.invoiceNumber && touched.invoiceNumber && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.invoiceNumber}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Total Amount{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="flex items-center border border-black rounded-lg bg-white overflow-hidden">
                                <span className="pl-4 text-gray-400 font-bold bg-gray-200 px-3 py-3">
                                  $
                                </span>
                                <Field
                                  name="totalAmount"
                                  type="number"
                                  step="0.01"
                                  className={`w-full px-2 py-3 border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-black ${
                                    errors.totalAmount && touched.totalAmount
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                  placeholder="0.00"
                                />
                                <span className="pr-4 text-black">USD</span>
                              </div>
                            </div>
                            {errors.totalAmount && touched.totalAmount && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.totalAmount}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Invoice Due Date{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                              <Field
                                name="invoiceDueDate"
                                type="text"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black ${
                                  errors.invoiceDueDate &&
                                  touched.invoiceDueDate
                                    ? "border-red-500"
                                    : "border-black"
                                }`}
                                placeholder="MM/DD/YYYY"
                              />
                            </div>
                            {errors.invoiceDueDate &&
                              touched.invoiceDueDate && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.invoiceDueDate}
                                </p>
                              )}
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Invoice Date{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                              <Field
                                name="invoiceDate"
                                type="text"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black ${
                                  errors.invoiceDate && touched.invoiceDate
                                    ? "border-red-500"
                                    : "border-black"
                                }`}
                                placeholder="MM/DD/YYYY"
                              />
                            </div>
                            {errors.invoiceDate && touched.invoiceDate && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.invoiceDate}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Payment Terms{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Field
                                as="select"
                                name="paymentTerms"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-400 appearance-none ${
                                  errors.paymentTerms && touched.paymentTerms
                                    ? "border-red-500"
                                    : "border-black"
                                }`}
                              >
                                <option value="">Select</option>
                                <option value="Net 15">Net 15</option>
                                <option value="Net 30">Net 30</option>
                                <option value="Net 60">Net 60</option>
                                <option value="Due on Receipt">
                                  Due on Receipt
                                </option>
                              </Field>
                              <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.paymentTerms && touched.paymentTerms && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.paymentTerms}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              GL Post Date{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                              <Field
                                name="glPostDate"
                                type="text"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black ${
                                  errors.glPostDate && touched.glPostDate
                                    ? "border-red-500"
                                    : "border-black"
                                }`}
                                placeholder="MM/DD/YYYY"
                              />
                            </div>
                            {errors.glPostDate && touched.glPostDate && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.glPostDate}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Invoice Description - Full Width */}
                      <div className="mt-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Invoice Description{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Field
                            as="textarea"
                            name="invoiceDescription"
                            rows={1}
                            className={`w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 resize-none ${
                              errors.invoiceDescription &&
                              touched.invoiceDescription
                                ? "border-red-500"
                                : "border-black"
                            }`}
                            placeholder="Enter invoice description..."
                          />
                          {/* <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                          {values.invoiceDescription?.length || 0}/500
                        </div> */}
                        </div>
                        {errors.invoiceDescription &&
                          touched.invoiceDescription && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.invoiceDescription}
                            </p>
                          )}
                      </div>
                    </div>

                    {/* Expense Details */}
                    <div className="mb-10">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <h3 className="text-xl font-bold text-gray-900">
                            Expense Details
                          </h3>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium text-gray-600">
                            ${values.lineAmount || "0.00"} / $
                            {values.totalAmount || "0.00"}
                          </span>
                          <div className="relative inline-block w-16 h-8 align-middle select-none">
                            <input
                              type="checkbox"
                              checked={expenseToggle}
                              onChange={() => setExpenseToggle(!expenseToggle)}
                              className="hidden"
                              id="toggle"
                            />
                            <label
                              htmlFor="toggle"
                              className="block overflow-hidden h-8 rounded-full bg-gray-300 cursor-pointer"
                            >
                              <span
                                className={`block h-8 w-8 rounded-full transform transition-transform duration-200 ease-in ${
                                  expenseToggle 
                                    ? 'translate-x-8 bg-blue-600' 
                                    : 'translate-x-0 bg-white'
                                }`}
                              >
                                <span className="flex items-center justify-center h-full text-xs font-bold">
                                  {expenseToggle ? '%' : '$'}
                                </span>
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Line Amount{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="flex items-center border border-black rounded-lg bg-white overflow-hidden">
                                <span className="pl-4 text-gray-400 font-bold bg-gray-200 px-3 py-3">
                                  $
                                </span>
                                <Field
                                  name="lineAmount"
                                  type="number"
                                  step="0.01"
                                  className={`w-full px-2 py-3 border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-black ${
                                    errors.lineAmount && touched.lineAmount
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                  placeholder="0.00"
                                />
                                <span className="pr-4 text-black">USD</span>
                              </div>
                            </div>
                            {errors.lineAmount && touched.lineAmount && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.lineAmount}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Account <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Field
                                as="select"
                                name="account"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-400 appearance-none ${
                                  errors.account && touched.account
                                    ? "border-red-500"
                                    : "border-black"
                                }`}
                              >
                                <option value="">Select Account</option>
                                <option value="Office Supplies">
                                  Office Supplies
                                </option>
                                <option value="Professional Services">
                                  Professional Services
                                </option>
                                <option value="Utilities">Utilities</option>
                                <option value="Equipment">Equipment</option>
                              </Field>
                              <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.account && touched.account && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.account}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Department <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Field
                                as="select"
                                name="department"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-400 appearance-none ${
                                  errors.department && touched.department
                                    ? "border-red-500"
                                    : "border-black"
                                }`}
                              >
                                <option value="">Select Department</option>
                                <option value="Facilities">Facilities</option>
                                <option value="IT">IT</option>
                                <option value="HR">HR</option>
                                <option value="Finance">Finance</option>
                              </Field>
                              <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.department && touched.department && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.department}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Location <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Field
                                as="select"
                                name="location"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-400 appearance-none ${
                                  errors.location && touched.location
                                    ? "border-red-500"
                                    : "border-black"
                                }`}
                              >
                                <option value="">Select Location</option>
                                <option value="Main Office">Main Office</option>
                                <option value="Branch Office">
                                  Branch Office
                                </option>
                                <option value="Warehouse">Warehouse</option>
                                <option value="Remote">Remote</option>
                              </Field>
                              <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.location && touched.location && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description - Full Width */}
                      <div className="mt-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Field
                            as="textarea"
                            name="description"
                            rows={1}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 resize-none ${
                              errors.description && touched.description
                                ? "border-red-500"
                                : "border-black"
                            }`}
                            placeholder="Enter description..."
                          />
                          {/* <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                          {values.description?.length || 0}/200
                        </div> */}
                        </div>
                        {errors.description && touched.description && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.description}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end mt-6">
                        <button
                          type="button"
                          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                          <FaPlus className="w-4 h-4 mr-2" />
                          Add Expense Coding
                        </button>
                      </div>
                    </div>

                    {/* Comments */}
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <div className="bg-blue-200 rounded-full p-4 mr-4">
                          <TbMessage className="w-5 h-5 text-sky-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Comments
                        </h3>
                      </div>

                      <div className="relative">
                        <Field
                          as="textarea"
                          name="comments"
                          rows={1}
                          className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 resize-none ${
                            errors.comments && touched.comments
                              ? "border-red-500"
                              : "border-black"
                          }`}
                          placeholder="Add any additional comments..."
                        />
                        <VscSend className="absolute right-3 top-4 text-gray-400" />
                        {/* <div className="absolute bottom-2 right-10 text-xs text-gray-400">
                        {values.comments?.length || 0}/1000
                      </div> */}
                        {errors.comments && touched.comments && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.comments}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Form Submission */}
                    <div className="flex justify-end items-center space-x-3 mb-8">
                      {/* Vertical Ellipsis Icon */}
                      <div className="flex flex-col space-y-1 cursor-pointer hover:bg-gray-100 p-2 rounded">
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      </div>

                      {/* Populate Dummy Data Button - Save as Draft Style */}
                      <button
                        type="button"
                        onClick={() => populateDummyData(setFieldValue)}
                        className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Save as Draft
                      </button>

                      {/* Clear Saved Data Button */}
                      <button
                        type="button"
                        onClick={() => clearSavedData(setFieldValue)}
                        className="px-6 py-3 bg-red-100 border border-red-300 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                      >
                        Clear Saved Data
                      </button>

                      {/* Submit Invoice Button - Submit & New Style */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-3 rounded-lg transition-colors font-medium ${
                          isSubmitting
                            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {isSubmitting ? "Submitting..." : "Submit & New"}
                      </button>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        );
      }}
    </Formik>
  );
}

export default Home;
