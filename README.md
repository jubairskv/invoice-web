# Invoice Management Web Application

A fully functional React application for managing invoices with comprehensive form validation, PDF upload capabilities, and session management.

## Features

### 🔐 Login System
- **Secure Login Form**: Username and password validation using Formik
- **Session Management**: Automatic session storage in localStorage
- **Auto-Login**: Automatic redirection to main app if session exists
- **Logout Functionality**: Clear session and redirect to login page

### 📋 Invoice Form Management
- **Comprehensive Form**: Vendor details, invoice details, expense details, and comments
- **Formik Integration**: Advanced form handling with validation
- **Real-time Validation**: Dynamic error messages and field highlighting
- **Data Persistence**: Form data automatically saved to localStorage

### 📄 PDF Upload & Display
- **PDF Upload**: Upload PDF files from local system
- **PDF Viewer**: Display uploaded PDFs using react-pdf library
- **Multi-page Support**: Navigate through multi-page PDFs
- **File Validation**: Only accepts PDF files

### 🎯 Additional Features
- **Dummy Data Population**: One-click form population with sample data
- **Responsive Design**: Mobile-friendly interface
- **Dynamic Amount Calculation**: Real-time expense amount tracking
- **Comprehensive Validation**: All required fields validated

## Technology Stack

- **React 19.1.1** - Frontend framework
- **Formik 2.4.6** - Form management and validation
- **Yup 1.7.1** - Schema validation
- **React Router DOM 7.9.4** - Client-side routing
- **React PDF 10.2.0** - PDF rendering and display
- **React Icons 5.5.0** - Icon library
- **Tailwind CSS 4.1.16** - Styling framework
- **Vite 7.1.7** - Build tool and development server

## Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd invoice-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## Usage Instructions

### Login Process
1. **Access the Application**: Open the application in your browser
2. **Login**: Enter your username and password
   - Username must be at least 3 characters
   - Password must be at least 6 characters and contain letters and numbers
3. **Auto-redirect**: You'll be automatically redirected to the main invoice form

### Invoice Form Usage
1. **Upload PDF** (Optional):
   - Click "Upload File" in the left panel
   - Select a PDF file from your system
   - View the PDF in the application

2. **Fill Form Fields**:
   - **Vendor Details**: Select vendor and enter address
   - **Invoice Details**: Fill in invoice number, amounts, dates, and descriptions
   - **Expense Details**: Configure expense coding and amounts
   - **Comments**: Add any additional notes

3. **Form Validation**:
   - All required fields (marked with *) are validated
   - Error messages appear below invalid fields
   - Fields highlight in red when invalid

4. **Data Persistence**:
   - Form data is automatically saved to localStorage
   - Data persists across page reloads
   - Form fields are pre-populated when revisiting

5. **Dummy Data**:
   - Click "Populate with Dummy Data" to fill all fields with sample data
   - Useful for testing and demonstration

6. **Submit Form**:
   - Click "Submit Invoice" to save the form
   - Success message confirms submission

### Session Management
- **Automatic Login**: If you have an active session, you'll be redirected to the main app
- **Logout**: Click the "Logout" button to clear your session and return to login
- **Session Persistence**: Sessions persist across browser sessions

## Project Structure

```
src/
├── components/
│   ├── home.jsx              # Main invoice form component
│   ├── login.jsx             # Login page component
│   ├── LoginForm.jsx         # Login form with Formik
│   ├── ModalPop.jsx          # Error modal component
│   ├── ProtectedRoute.jsx    # Route protection component
│   └── PublicRoute.jsx       # Public route component
├── router/
│   └── router.jsx            # Application routing configuration
├── App.jsx                   # Main application component
├── main.jsx                  # Application entry point
└── index.css                 # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Form Validation Rules

### Required Fields
- Vendor
- Purchase Order Number
- Invoice Number
- Total Amount (must be positive)
- Invoice Due Date
- Invoice Description
- Invoice Date
- Payment Terms
- GL Post Date
- Line Amount (must be positive)
- Account
- Description
- Department
- Location

### Validation Features
- Real-time validation feedback
- Error message display
- Field highlighting for invalid inputs
- Form submission prevention with invalid data

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team or create an issue in the repository.