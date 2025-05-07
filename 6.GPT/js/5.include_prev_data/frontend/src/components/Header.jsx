import React from 'react';

function Header() {
  return (
    <header className="text-center py-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
        GPT 챗봇
      </h1>
      <p className="text-gray-400 mt-2">AI와 대화를 시작해보세요</p>
    </header>
  );
}

export default Header;
