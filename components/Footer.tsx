
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="text-center p-4 bg-black bg-opacity-30 backdrop-blur-sm mt-auto border-t border-white/10">
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} AI Recipe Generator. Powered by Gemini.</p>
        </footer>
    );
};

export default Footer;
