// Navbar.js
import React from 'react';

const Navbar = () => {
    const handleScrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="bg-[#000b76] p-4">
            <div className="container mx-auto flex justify-between items-center h-[4rem]">
                <div>
                    <h1 className="text-white text-2xl font-bold">Insurance App</h1>
                </div>
                <div className="flex space-x-4">
                    <button
                        className="text-white px-3 py-1 rounded bg-purple-600 hover:bg-purple-700 font-semibold"
                        onClick={() => handleScrollToSection('create-policy-section')}
                    >
                        Create Policy
                    </button>
                    <button
                        className="text-white px-3 py-1 rounded bg-purple-600 hover:bg-purple-700 font-semibold"
                        onClick={() => handleScrollToSection('your-policies-section')}
                    >
                        Your Policies
                    </button>
                    <div className="flex items-center bg-white rounded-full p-1">
                        {/* Replace the URL with the path to your profile image */}
                        <img
                            className="w-8 h-8 rounded-full object-cover"
                            src="https://placekitten.com/100/100"
                            alt="Profile"
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
