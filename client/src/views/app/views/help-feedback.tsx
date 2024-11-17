import React, { useState } from 'react';
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Loader } from "lucide-react";
import { AppContext } from "@/views/app/contexts/app-context.tsx";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes.tsx";

const HelpFeedbackPage = () => {
    const { utils } = React.useContext(AppContext);
    const [feedback, setFeedback] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();

    // Handle the feedback form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!feedback || !name || !email) {
            utils.toast.error("Please fill in all fields.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate form submission (you can replace this with actual API logic)
            // Example: send feedback to the backend
            const response = await fetch("/api/submit-feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, feedback }),
            });

            if (response.ok) {
                utils.toast.success("Thank you for your feedback!");
                navigate(ROUTES.app.home);
            } else {
                utils.toast.error("Failed to submit feedback. Please try again later.");
            }
        } catch (error) {
            console.error(error);
            utils.toast.error("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-semibold text-center text-[#4A8209] mb-6">Help & Feedback</h1>

            {/* Help Section */}
            <div className="mb-2">
                <h2 className="text-xl font-semibold text-[#4A8209]">How Can We Help You?</h2>
                <p className="mt-2 text-gray-600">
                    If you're having any trouble, feel free to browse our frequently asked questions or submit a help request
                    through the form below. Our team is here to assist you!
                </p>
                <div className="mt-2 bg-[#f9f9f9] p-4 rounded-md">
                    <h3 className="font-medium text-[#4A8209]">FAQ</h3>
                    <ul className="mt-2 text-gray-600">
                        <li>- How do I reset my password?</li>
                        <li>- How can I update my account information?</li>
                        <li>- Where can I view my previous reports?</li>
                        <li>- How do I contact support?</li>
                    </ul>
                    <p className="mt-1 text-blue-600">
                        For more assistance, please reach out via the form below!
                    </p>
                </div>
            </div>

            {/* Feedback Form */}
            <form onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <div className="space-y-1">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="border-gray-300"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="email">Your Email</Label>
                        <Input
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="border-gray-300"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="feedback">Your Feedback</Label>
                        <Textarea
                            id="feedback"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Write your feedback or issue here"
                            className="border-gray-300 resize-none"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="bg-[#b9ff66] hover:bg-[#a3ff66] border-[#4A8209] border-[1.5px] w-full py-4 rounded-xl text-black font-semibold"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && <Loader className="animate-spin mr-2" />}
                        Submit Feedback
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default HelpFeedbackPage;
