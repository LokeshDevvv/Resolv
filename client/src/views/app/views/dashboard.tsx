import { Button } from "@/components/ui/button.tsx";
import { ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import Verify from "./verify.tsx";

const AppDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [modalData, setModalData] = useState<any>(null);  // State to store the data for the Verify modal
    const [submittedText, setSubmittedText] = useState("");  // State for submitted text
    const [verificationText, setVerificationText] = useState("");  // State for verification text
    const [submittedImageBase64, setSubmittedImageBase64] = useState("");  // State for submitted image base64
    const [verificationImageBase64, setVerificationImageBase64] = useState("");  // State for verification image base64

    // Fetch submitted text and image from new-report.json
    useEffect(() => {
        const fetchReportData = async () => {
            try {
                // Assuming you have a 'new-report.json' file in your public folder
                const response = await fetch("api/new-report.json");
                if (response.ok) {
                    const data = await response.json();
                    // Set state with the fetched data
                    setSubmittedText(data.submitted_text);
                    setSubmittedImageBase64(data.submitted_image_base64);
                } else {
                    throw new Error("Failed to load new-report.json");
                }
            } catch (error) {
                console.error("Error fetching new-report.json:", error);
            }
        };

        fetchReportData();
    }, []);

    // Function to convert image to base64
    const convertToBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file); // Converts the image to base64
        });
    };

    const fetchVerificationData = async () => {
        try {
            const response = await fetch('/api/verify-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    submitted_text: submittedText,
                    verification_text: verificationText,
                    submitted_image_base64: submittedImageBase64,
                    verification_image_base64: verificationImageBase64,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch verification data");
            }

            const result = await response.json();

            setModalData({
                submittedImage: submittedImageBase64, 
                submittedText: submittedText,
                verificationImage: verificationImageBase64, 
                verificationText: verificationText, 
                verificationResult: result, 
            });

            setIsModalOpen(true); 

        } catch (error) {
            console.error("Error fetching verification data:", error);
        }
    };

    // Handle closing the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setModalData(null);
    };

    // Handle image file upload for verification image
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const base64 = await convertToBase64(file);
            setVerificationImageBase64(base64);
        } catch (error) {
            console.error("Error converting image to base64:", error);
        }
    };

    return (
        <div className="p-4 border-[2px] rounded-lg">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="font-semibold font-epilogue">Jane Doe</h1>
                    <p className="text-gray-500 font-epilogue font-medium text-sm">
                        December 12, 2024
                    </p>
                </div>
                <div className="flex items-center justify-center gap-x-2">
                    <div className="bg-[#000] text-[#B9FF66] text-sm font-medium px-1.5 py-0.5 rounded-md">
                        Land Hazard
                    </div>
                    <div className="bg-[#b9ff66] text-[#000] text-sm font-medium px-1.5 py-0.5 rounded-md">
                        High Priority
                    </div>
                </div>
            </div>

            {/* Display fetched submitted text */}
            <div className="mt-4">
                <h1 className="text-lg font-epilogue font-semibold">
                    {submittedText || "Loading submitted text..."}
                </h1>
            </div>

            {/* Display submitted image */}
            {submittedImageBase64 && (
                <div className="mt-4 flex items-center flex-wrap gap-3">
                    <img
                        alt="submitted_image"
                        className="max-h-[250px] h-auto rounded-3xl"
                        src={submittedImageBase64}
                    />
                </div>
            )}

            {/* Form Inputs for Verification Text and Image */}
            <div className="mt-4">
                <label htmlFor="verification-text">Verification Text:</label>
                <input
                    type="text"
                    id="verification-text"
                    value={verificationText}
                    onChange={(e) => setVerificationText(e.target.value)}
                    className="w-full p-2 border rounded-md"
                />
            </div>

            {/* Image Upload for Verification Image */}
            <div className="mt-4">
                <label htmlFor="verification-image">Upload Verification Image:</label>
                <input
                    type="file"
                    id="verification-image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full p-2 border rounded-md"
                />
            </div>

            {/* Submit Button */}
            <div className="mt-4">
                <Button
                    className="bg-[#b9ff66] hover:bg-[#a3ff66] border-[#4A8209] border-[1.6px] rounded-full w-full text-black"
                    onClick={fetchVerificationData}
                >
                    Verify <ArrowUpRight className="size-5" />
                </Button>
            </div>

            {/* Modal for Verify Component */}
            {isModalOpen && modalData && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-[80%] max-w-3xl">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-xl font-semibold"
                        >
                            ×
                        </button>
                        <Verify {...modalData} closeModal={closeModal} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppDashboard;
