// client-vite/src/pages/HodConvertPrintPaper.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx';
// import axios from 'axios'; // We'll add axios when we implement API calls

const HodConvertPrintPaper = () => {
    const { qpId } = useParams(); // Get the question paper ID from the URL
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (qpId) {
            handleGeneratePdf(); // Automatically generate PDF when component mounts with qpId
        } else {
            setError('No question paper ID provided to generate PDF.');
        }
    }, [qpId]);

    const handleGeneratePdf = async () => {
        setLoading(true);
        setError(null);
        setPdfUrl(null);

        try {
            // In a real application, you'd make an API call to your backend
            // For example:
            // const response = await axios.post(`/api/generate-question-paper-pdf/${qpId}`, {}, { responseType: 'blob' });
            // const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            // setPdfUrl(url);

            // Simulating PDF generation (replace with actual API call)
            const dummyPdfData = 'data:application/pdf;base64,JVBERi0xLjQKJcOkwjHDgwoKMSAwIG9iagogIDw8L1BhZ2VzIDIgMCBSL1R5cGUvQ2F0YWxvZz4+CiAgZW5kb2JqCjIgMCBvYmoKICA8PC9Db3VudCAxL0tpZHNbMyAwIFJdL1R5cGUvUGFnZXM+PgogIGVuZG9iagozIDAgb2JqCiAgPDwvQ29udGVudHMgNCAwIFIvTWVkaWFCb3hbMCAwIDU5NSA4NDJdL1BhZ2VyTGltaXRzWy0xIC0xIDk5OTkgOTk5OV0vUGFyZW50IDIgMCBSL1Jlc291cmNlcyA1IDAgUi9UeXBlL1BhZ2U+PgogIGVuZG9iago0IDAgb2JqCiAgPDwvTGVuZ2RoIDU0Pj4KICBzdHJlYW0KQlQKL0YxIDEyIFRmLmJsdWVmbyAvRjIgMTQgVFoKLTAgLTEyIFJlbC9NMiAtMTIgUk0vMSAtMTIgUk0KLVRlYW0gQSA1MC4gQnJvd24uCi0wIC0xMiBSZW0vMSAtMTIgUk0KRTogQ29tcG9zaXRpb24KRSBuZHN0cmVhbQogIGVuZG9iago1IDAgb2JqCiAgPDwvRm9udDw8L0YxIDYgMCBSL0YyIDcgMCBSPj4vUHJvY1NldFsvUERGIC9UZXh0XT4+CiAgZW5kb2JqCjYgMCBvYmoKICA8PC9CYXNlRm9udC9IZWx2ZXRpY2EvRW5jb2RpbmcvV2luQW5zaS9OYW1lL0YxL1N1YnR5cGUvVHlwZTE+PgogIGVuZG9iago3IDAgb2JqCiAgPDwvQmFzZUZvbnQvSGVsdmV0aWNhLUJvbGQvRW5jb2RpbmcvV2luQW5zaS9OYW1lL0YyL1N1YnR5cGUvVHlwZTE+PgogIGVuZG9iago4IDAgb2JqCiAgPDwvU2l6ZSA5L1Jvb3QgMSAwIFIvSW5mbyA5IDAgUj4+CiAgZW5kb2JqCjkgMCBvYmoKICA8PC9DcmVhdG9yKFRlc3QpL0NyZWF0aW9uRGF0ZShEOjIwMjQwNjA3MTM0NDU5KzAxJzAwJykvQXV0aG9yKHRlc3QpPj4KICBlbmRvYmoKeHJlZgowIDEwCjAwMDAwMDAwMDAgNjU1MzUgZg0KMDAwMDAwMDAwOSAwMDAwMG4NCjAwMDAwMDAwNzIgMDAwMMG4NCjAwMDAwMDAxNDkgMDAwMMG4NCjAwMDAwMDAyNjMgMDAwMMG4NCjAwMDAwMDAzMTMgMDAwMMG4NCjAwMDAwMDA0MjkgMDAwMMG4NCjAwMDAwMDA1MjggMDAwMMG4NCjAwMDAwMDA2MzcgMDAwMMG4NCjAwMDAwMDA2OTggMDAwMGGzCnRyYWlsZXIKICA8PC9JRCBbPDNGNDEzMjlBMjQ2NTZBNTA0QTdFMkI2NjM5NDJFQUFEMj48M0Y0MTMyOUFBMjQ2NTZBNTA0QTdFMkI2NjM5NDJFQUFEMj5dL1Jvb3QgMSAwIFIvU2l6ZSA5Pj4KICBzdGFydHhyZWYKNzgyCiUlRU9G'; // A very small, valid PDF data
            const byteCharacters = atob(dummyPdfData.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            setPdfUrl(url);

        } catch (err) {
            console.error('Error generating PDF:', err);
            setError('Failed to generate PDF. Please ensure the paper exists and the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handlePrintPdf = () => {
        if (pdfUrl) {
            // Open the PDF in a new window for printing
            const printWindow = window.open(pdfUrl, '_blank');
            if (printWindow) {
                // Optional: Add a delay to ensure the PDF loads before printing
                printWindow.onload = () => {
                    printWindow.print();
                };
            } else {
                setError('Could not open print window. Please check pop-up blockers.');
            }
        } else {
            setError('No PDF to print. Please generate one first (this should happen automatically).');
        }
    };

    const handleDownloadPdf = () => {
        if (pdfUrl) {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.setAttribute('download', `question_paper_${qpId}.pdf`); // Suggests a filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // Revoke the object URL to free up memory
            window.URL.revokeObjectURL(pdfUrl);
        } else {
            setError('No PDF to download.');
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-8 text-center">
                    <p className="text-gray-600">Generating PDF for question paper ID: {qpId}...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="p-8 text-center">
                    <p className="text-red-500">Error: {error}</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-8 bg-gray-50 min-h-full">
                <h1 className="text-3xl font-semibold mb-6 text-gray-800">Convert & Print Question Paper (HOD)</h1>

                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-medium mb-4 text-gray-700">Question Paper ID: {qpId}</h2>
                    <p className="text-gray-600 mb-4">
                        PDF has been generated for this question paper. You can now preview, print, or download it.
                    </p>

                    <div className="flex space-x-4">
                        <button
                            onClick={handlePrintPdf}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
                            disabled={!pdfUrl}
                        >
                            Print PDF
                        </button>
                        <button
                            onClick={handleDownloadPdf}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
                            disabled={!pdfUrl}
                        >
                            Download PDF
                        </button>
                    </div>
                </div>

                {pdfUrl && (
                    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
                        <h2 className="text-xl font-medium mb-4 text-gray-700">PDF Preview</h2>
                        <div className="w-full h-96 border border-gray-300 rounded-md overflow-hidden">
                            <iframe src={pdfUrl} title="Question Paper PDF Preview" className="w-full h-full"></iframe>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Note: If the PDF does not display correctly, your browser might not support direct PDF embedding. Use the "Print PDF" or "Download PDF" buttons.
                        </p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default HodConvertPrintPaper;