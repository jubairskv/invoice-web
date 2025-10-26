import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  FaBuilding,
  FaFileInvoice,
  FaComment,
  FaCalendarAlt,
  FaChevronDown,
  FaPlus,
  FaSignOutAlt,
} from "react-icons/fa";
import { VscSend } from "react-icons/vsc";
import { FiUpload, FiCheck } from "react-icons/fi";
import { Document, Page, pdfjs } from "react-pdf";

// Set up PDF.js worker using local pdfjs-dist installation
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

// Validation schema
const validationSchema = Yup.object({
  vendor: Yup.string().required("Vendor is required"),
  purchaseOrderNumber: Yup.string().required(
    "Purchase Order Number is required"
  ),
  invoiceNumber: Yup.string().required("Invoice Number is required"),
  totalAmount: Yup.number()
    .required("Total Amount is required")
    .min(0, "Amount must be positive"),
  invoiceDueDate: Yup.string().required("Invoice Due Date is required"),
  invoiceDescription: Yup.string().required("Invoice Description is required"),
  invoiceDate: Yup.string().required("Invoice Date is required"),
  paymentTerms: Yup.string().required("Payment Terms is required"),
  glPostDate: Yup.string().required("GL Post Date is required"),
  lineAmount: Yup.number()
    .required("Line Amount is required")
    .min(0, "Amount must be positive"),
  account: Yup.string().required("Account is required"),
  description: Yup.string().required("Description is required"),
  department: Yup.string().required("Department is required"),
  location: Yup.string().required("Location is required"),
  comments: Yup.string(),
});

// Dummy data for form population
const dummyData = {
  vendor: "A-1 Exterminators",
  purchaseOrderNumber: "PO-2024-001",
  invoiceNumber: "INV-2024-001",
  totalAmount: 1250.0,
  invoiceDueDate: "12/31/2024",
  invoiceDescription: "Monthly pest control services for office building",
  invoiceDate: "12/01/2024",
  paymentTerms: "Net 30",
  glPostDate: "12/15/2024",
  lineAmount: 1250.0,
  account: "Office Supplies",
  description: "Professional pest control services",
  department: "Facilities",
  location: "Main Office",
  comments: "Regular monthly service - all areas treated",
};

function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Vendor Details");
  const [expenseToggle, setExpenseToggle] = useState(false);
  const [, setUploadedFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  const tabs = ["Vendor Details", "Invoice Details", "Comments"];

  // Load saved data from localStorage on component mount
  const loadSavedData = () => {
    const savedData = localStorage.getItem("invoiceFormData");
    return savedData ? JSON.parse(savedData) : {};
  };

  // Save data to localStorage
  const saveData = (values) => {
    localStorage.setItem("invoiceFormData", JSON.stringify(values));
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("session");
    localStorage.removeItem("invoiceFormData");
    navigate("/");
  };

  // Handle PDF file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      setPdfLoading(true);
      setPdfError(null);
      const fileUrl = URL.createObjectURL(file);
      setPdfFile(fileUrl);
    } else {
      alert("Please select a valid PDF file");
    }
  };

  // Handle PDF load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPdfLoading(false);
    setPdfError(null);
  };

  // Handle PDF load error
  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error);
    setPdfLoading(false);
    setPdfError("Failed to load PDF. Please try a different file.");
  };

  // Populate form with dummy data
  const populateDummyData = (setFieldValue) => {
    Object.keys(dummyData).forEach((key) => {
      setFieldValue(key, dummyData[key]);
    });
  };

  return (
    <Formik
      initialValues={{
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
      onSubmit={(values, { setSubmitting }) => {
        saveData(values);
        setSubmitting(false);
        alert("Form submitted successfully!");
      }}
    >
      {({ errors, touched, setFieldValue, values }) => (
        <div className="min-h-screen bg-white">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-8">
                <button className="text-blue-600 hover:text-blue-800 mr-3 text-lg">
                  ←
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                  Create New Invoice
                </h1>

                {/* Tabs Section */}
                <div className="flex justify-center ml-64 space-x-8">
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

          <div className="flex h-screen">
            {/* Left Panel - Invoice Upload */}
            <div className="w-1/3 bg-gray-200 p-8">
              <div className="border-2 border-dashed border-gray-400 rounded-xl p-12 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Upload Your Invoice
                </h2>
                <p className="text-gray-500 mb-8 text-lg">
                  To auto-populate fields and save time
                </p>

                {pdfFile ? (
                  <div className="mb-6">
                    {pdfLoading && (
                      <div className="flex justify-center items-center h-48">
                        <div className="text-blue-600">Loading PDF...</div>
                      </div>
                    )}
                    {pdfError && (
                      <div className="flex justify-center items-center h-48">
                        <div className="text-red-600 text-center">
                          <p>{pdfError}</p>
                          <button
                            onClick={() => {
                              setPdfFile(null);
                              setPdfError(null);
                              setPdfLoading(false);
                            }}
                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Try Again
                          </button>
                        </div>
                      </div>
                    )}
                    {!pdfLoading && !pdfError && (
                      <>
                        <Document
                          file={pdfFile}
                          onLoadSuccess={onDocumentLoadSuccess}
                          onLoadError={onDocumentLoadError}
                          className="max-h-96 overflow-auto border border-gray-300 rounded"
                        >
                          <Page
                            pageNumber={pageNumber}
                            width={300}
                            className="shadow-lg"
                          />
                        </Document>
                        {numPages > 1 && (
                          <div className="mt-4 flex justify-center space-x-2">
                            <button
                              onClick={() =>
                                setPageNumber(Math.max(1, pageNumber - 1))
                              }
                              disabled={pageNumber <= 1}
                              className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-400"
                            >
                              Previous
                            </button>
                            <span className="px-3 py-1 text-sm">
                              Page {pageNumber} of {numPages}
                            </span>
                            <button
                              onClick={() =>
                                setPageNumber(
                                  Math.min(numPages, pageNumber + 1)
                                )
                              }
                              disabled={pageNumber >= numPages}
                              className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-400"
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <FiCheck className="w-12 h-12 text-white" />
                  </div>
                )}

                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-6 flex items-center mx-auto text-lg cursor-pointer"
                >
                  <FiUpload className="w-5 h-5 mr-3" />
                  Upload File ↑
                </label>

                <p className="text-blue-600 text-base cursor-pointer hover:text-blue-800 font-medium">
                  Click to upload or Drag and drop
                </p>

                <button
                  onClick={() => populateDummyData(setFieldValue)}
                  className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Populate with Dummy Data
                </button>
              </div>
            </div>

            {/* Right Panel - Form Details */}
            <div className="flex-1 bg-gray-200 p-8 overflow-y-auto">
              <Form>
                {/* Vendor Details */}
                <div className="mb-10">
                  <div className="flex items-center mb-6">
                    <div className="bg-blue-100 rounded-full p-4">
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
                    <div className="bg-blue-100 rounded-full p-4 mr-4">
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
                          {errors.invoicelineNumber &&
                            touched.invoiceNumber && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.invoiceNumber}
                              </p>
                            )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Total Amount <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="flex items-center border border-black rounded-lg bg-white overflow-hidden">
                              <span className="pl-4 text-black bg-gray-200 px-3 py-3">
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
                                errors.invoiceDueDate && touched.invoiceDueDate
                                  ? "border-red-500"
                                  : "border-black"
                              }`}
                              placeholder="MM/DD/YYYY"
                            />
                          </div>
                          {errors.invoiceDueDate && touched.invoiceDueDate && (
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
                            Invoice Date <span className="text-red-500">*</span>
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
                            GL Post Date <span className="text-red-500">*</span>
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
                      <Field
                        as="textarea"
                        name="invoiceDescription"
                        rows={1}
                        className={`w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 ${
                          errors.invoiceDescription &&
                          touched.invoiceDescription
                            ? "border-red-500"
                            : "border-black"
                        }`}
                        placeholder="Enter invoice description..."
                      />
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
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setExpenseToggle(false)}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                              !expenseToggle
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                            }`}
                          >
                            $
                          </button>
                          <button
                            type="button"
                            onClick={() => setExpenseToggle(true)}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                              expenseToggle
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                            }`}
                          >
                            %
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Line Amount <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="flex items-center border border-black rounded-lg bg-white overflow-hidden">
                              <span className="pl-4 text-black bg-gray-200 px-3 py-3">
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
                      <Field
                        as="textarea"
                        name="description"
                        rows={1}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-400 ${
                          errors.description && touched.description
                            ? "border-red-500"
                            : "border-black"
                        }`}
                        placeholder="Enter description..."
                      />
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
                      <div className="bg-blue-100 rounded-full p-4 mr-4">
                        <FaComment className="w-5 h-5 text-sky-500" />
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
                        className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-400 ${
                          errors.comments && touched.comments
                            ? "border-red-500"
                            : "border-black"
                        }`}
                        placeholder="Add any additional comments..."
                      />
                      <VscSend className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      {errors.comments && touched.comments && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.comments}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Form Submission */}
                  <div className="flex justify-end space-x-4 mb-8">
                    <button
                      type="button"
                      onClick={() => populateDummyData(setFieldValue)}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      Populate Dummy Data
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Submit Invoice
                    </button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
}

export default Home;
