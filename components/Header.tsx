
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md w-full">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-center">
        <img src="https://picsum.photos/seed/porcelain/50/50" alt="Logo" className="w-10 h-10 rounded-full mr-4 border-2 border-blue-200" />
        <h1 className="text-3xl font-bold text-stone-800 tracking-wider">
          AI 粉彩匠人
        </h1>
      </div>
    </header>
  );
};
