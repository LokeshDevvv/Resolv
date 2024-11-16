import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import Verify from "./verify.tsx"; // Assuming Verify component exists for comparison

const AppDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState<any>(null);
    const [submittedText, setSubmittedText] = useState<string>(""); // To store fetched text
    const [submittedImageBase64, setSubmittedImageBase64] = useState<string>(""); // To store fetched image

    const [verificationText, setVerificationText] = useState<string>(""); // User input for verification
    const [verificationImageBase64, setVerificationImageBase64] = useState<string>(""); // User input for verification image

    // Fetch the submitted content from the backend
    const fetchSubmittedData = async () => {
        try {
            const response = await fetch('/api/submit-content', { method: 'GET' });

            if (!response.ok) {
                throw new Error("Failed to fetch submitted data");
            }

            const result = await response.json();

            // Update the state with the fetched data
            setSubmittedText(result.submitted_text);
            setSubmittedImageBase64(result.submitted_image_base64);

        } catch (error) {
            console.error("Error fetching submitted data:", error);
        }
    };

    // Handle verification image file input
    const handleVerificationImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setVerificationImageBase64(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            console.error('Please upload a valid image file');
        }
    };

    // Handle verification comparison
    const compareData = async () => {
        try {
            const payload = {
                submitted_text: submittedText,
                verification_text: verificationText,
                submitted_image_base64: submittedImageBase64,
                verification_image_base64: verificationImageBase64,
            };

            const response = await fetch('/api/verify-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to compare data");
            }

            const result = await response.json();

            // Set the result to be displayed in the modal
            setModalData(result);
            setIsModalOpen(true); // Show the modal with the comparison results

        } catch (error) {
            console.error("Error during data comparison:", error);
        }
    };

    return (
        <div>
            <button onClick={fetchSubmittedData}>Fetch Submitted Data</button>

            <div>
                {/* Verification inputs for user to provide */}
                <input
                    type="text"
                    placeholder="Enter verification text"
                    value={verificationText}
                    onChange={(e) => setVerificationText(e.target.value)}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleVerificationImageUpload}
                />

                {/* Submit for verification comparison */}
                <Button onClick={compareData}>Compare and Verify</Button>

                {isModalOpen && modalData && (
                    <div className="modal">
                        <Verify {...modalData} closeModal={() => setIsModalOpen(false)} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppDashboard;
