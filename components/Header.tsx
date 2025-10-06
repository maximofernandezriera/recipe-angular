
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="text-center p-4 md:p-6 bg-black bg-opacity-30 backdrop-blur-sm border-b border-white/10 shadow-md">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                <span className="text-green-400">AI</span> Recipe Generator
            </h1>
            <p className="text-gray-300 mt-2">Turn your ingredients into inspiration.</p>
        </header>
    );
};

export default Header;
