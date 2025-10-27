# Invoice Management Web Application

A fully functional React application for creating and managing invoices with comprehensive form validation, PDF upload capabilities, and session management.

# Password for Login:
   User Name :Admin
   Password:Abc@123

## Features

###  Login System
- **Formik-powered login form** with comprehensive validation
- **Session management** using localStorage
- **Auto-login** functionality for returning users
- **Logout** functionality with session cleanup
- **Password strength validation** with security requirements
- **Responsive login layout** with adaptive logo and form sections

###  Design Replication
- **Accurate design implementation** matching provided specifications
- **Responsive layout** that works across different screen sizes
- **Modern UI components** with Tailwind CSS styling
- **Professional invoice form** with tabbed navigation

###  Functional Form Implementation
- **Formik integration** for form state management
- **Comprehensive validation** using Yup schema validation
- **Real-time validation** with dynamic error display
- **Character count indicators** for text areas
- **Business logic validation** (e.g., date relationships, amount constraints)

###  Data Persistence
- **localStorage integration** for form data persistence
- **Auto-save functionality** with debounced saving
- **Data restoration** on page reload with file recovery
- **Session persistence** across browser sessions
- **Draft saving** with "Save as Draft" functionality
- **File and form data** synchronized persistence

###  PDF Upload and Display
- **PDF file upload** with drag-and-drop support
- **PDF preview** using react-pdf library with PDF.js integration
- **Multi-page PDF support** with navigation controls
- **Error handling** for invalid file types
- **Loading states** for better user experience
- **PDF persistence** with localStorage for draft saving
- **Base64 encoding** for file storage and retrieval

###  Dummy Data Population
- **One-click population** of all form fields
- **Realistic sample data** for testing purposes
- **Consistent data relationships** (e.g., matching amounts, dates)

###  Bonus Features
- **Comprehensive form validation** with detailed error messages
- **Dynamic styling** indicating validation status
- **User-friendly error handling** with visual feedback
- **Loading states** and disabled states during submission
- **Success/error notifications** with status messages
- **Lottie animations** for enhanced user experience
- **Responsive design** with mobile-first approach
- **File drag-and-drop** interface
- **Auto-populate functionality** for testing

## Technology Stack

- **React 19.1.1** - Frontend framework
- **Formik 2.4.6** - Form management and validation
- **Yup 1.7.1** - Schema validation
- **React Router DOM 7.9.4** - Client-side routing
- **React PDF 10.2.0** - PDF display functionality
- **PDF.js 5.4.296** - PDF rendering engine
- **Tailwind CSS 4.1.16** - Styling framework
- **React Icons 5.5.0** - Icon library
- **Lottie Files 3.6.0** - Animation library
- **Vite 7.1.7** - Build tool and development server

## Installation and Setup

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

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage Instructions

### Login Process
1. **Access the application** - You'll be redirected to the login page
2. **Enter credentials**:
   - Username: Minimum 3 characters
   - Password: Minimum 6 characters, must contain letters and numbers
3. **Click Login** - You'll be redirected to the invoice creation page

### Creating an Invoice

1. **Upload PDF (Optional)**
   - Click "Upload File" in the left panel
   - Select a PDF file from your computer
   - View the PDF preview with navigation controls

2. **Fill Form Fields**
   - **Vendor Details**: Select vendor from dropdown
   - **Invoice Details**: Complete all required fields
   - **Expense Details**: Add line items and coding
   - **Comments**: Add any additional notes

3. **Form Validation**
   - All required fields are marked with red asterisks (*)
   - Real-time validation provides immediate feedback
   - Character counts help stay within limits
   - Business logic validation ensures data consistency

4. **Submit Invoice**
   - Click "Submit Invoice" to save the form
   - Data is automatically saved to localStorage
   - Success message confirms submission
   - Click "Submit & New" to submit and start a new invoice
   - Click "Save as Draft" to save current progress

### Quick Testing
- Click "Populate with Dummy Data" to quickly fill all fields
- Use this for testing form validation and functionality

### Session Management
- **Auto-login**: Returning users are automatically logged in
- **Logout**: Click the logout button to clear session and return to login
- **Data persistence**: Form data persists across page reloads
- **File persistence**: Uploaded PDFs are saved and restored with drafts
- **Draft management**: Save work in progress and resume later

## Form Validation Rules

### Required Fields
- Vendor (minimum 2 characters)
- Purchase Order Number (format: PO-YYYY-XXX)
- Invoice Number (format: INV-XXX)
- Total Amount ($0.01 - $999,999.99)
- Invoice Due Date (MM/DD/YYYY format)
- Invoice Description (10-500 characters)
- Invoice Date (MM/DD/YYYY format)
- Payment Terms
- GL Post Date (MM/DD/YYYY format)
- Line Amount ($0.01 - $999,999.99)
- Account
- Description (5-200 characters)
- Department
- Location

### Business Logic Validation
- Line Amount cannot exceed Total Amount
- Invoice Due Date cannot be before Invoice Date
- GL Post Date cannot be before Invoice Date
- Date format validation (MM/DD/YYYY)

### Optional Fields
- Comments (maximum 1000 characters)

## File Structure

```
src/
├── components/
│   ├── home.jsx              # Main invoice form component (1400+ lines)
│   ├── login.jsx             # Login page layout with responsive design
│   ├── LoginForm.jsx         # Login form with Formik validation
│   ├── ModalPop.jsx          # Error modal component
│   ├── pdfcomp.jsx           # PDF preview component
│   ├── ProtectedRoute.jsx    # Route protection wrapper
│   └── PublicRoute.jsx       # Public route wrapper
├── router/
│   └── router.jsx            # Application routing configuration
├── assets/
│   ├── Data.jpg              # Company logo
│   ├── Jubair K.pdf          # Sample PDF file
│   ├── File Search.json      # Lottie animation file
│   └── react.svg             # React logo
├── App.jsx                   # Main application component
├── main.jsx                  # Application entry point
├── App.css                   # Application styles
└── index.css                 # Global styles
```

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project uses ESLint for code quality and consistency. Run `npm run lint` to check for any issues.

## Deployment

### Static Hosting (Recommended)
The application can be deployed to any static hosting service:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront

### Environment Variables
No environment variables are required for basic functionality.


## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request


**Note**: This application is designed for demonstration purposes and includes comprehensive validation, error handling, and user experience features as requested in the requirements.