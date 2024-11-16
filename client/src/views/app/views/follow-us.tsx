import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

const FollowUs = () => {
    const socialMedia = [
        { id: 1, name: 'Facebook', icon: FaFacebookF, url: 'https://facebook.com' },
        { id: 2, name: 'Twitter', icon: FaTwitter, url: 'https://twitter.com' },
        { id: 3, name: 'Instagram', icon: FaInstagram, url: 'https://instagram.com' },
        { id: 4, name: 'LinkedIn', icon: FaLinkedinIn, url: 'https://linkedin.com' },
        { id: 5, name: 'YouTube', icon: FaYoutube, url: 'https://youtube.com' },
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-[#b9ff66] p-6">
            <h1 className="text-3xl font-bold text-[#000] font-epilogue mb-6">
                Follow Us on Social Media
            </h1>
            <p className="text-lg text-[#000] font-medium text-center mb-8">
                Stay updated with the latest news, updates, and insights. <br />
                Follow us and be a part of our community!
            </p>
            <div className="flex gap-6">
                {socialMedia.map((platform) => (
                    <a
                        key={platform.id}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-16 h-16 rounded-full bg-[#000] text-[#b9ff66] hover:bg-[#4A8209] hover:text-[#fff] transition-all duration-300"
                        aria-label={`Follow us on ${platform.name}`}
                    >
                        <platform.icon className="text-2xl" />
                    </a>
                ))}
            </div>
        </div>
    );
};

export default FollowUs;
