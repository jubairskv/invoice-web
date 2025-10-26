import { useState } from "react";
import { Document, Page } from "react-pdf";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function PdfComponent({ fileUrl }) {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const goToPrevPage = () => {
    setPageNumber(Math.max(1, pageNumber - 1));
  };

  const goToNextPage = () => {
    setPageNumber(Math.min(numPages, pageNumber + 1));
  };

  if (!fileUrl) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      {/* Page Counter */}
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Page {pageNumber} of {numPages || "..."}
          </span>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={goToNextPage}
              disabled={pageNumber >= (numPages || 1)}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* PDF Document */}
      <div className="p-4">
        <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <Page
            pageNumber={pageNumber}
            width={400}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            className="shadow-lg mx-auto"
          />
        </Document>
      </div>
    </div>
  );
}

export default PdfComponent;
