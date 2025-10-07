import Image from 'next/image';
import { useState } from 'react';

const Header = () => {
  const [searchCategory, setSearchCategory] = useState('All');

  return (
    <header className="app-header">
      <div className="top-bar">
        <div className="logo-location">
          <div className="logo">
            <Image src="/preview.jpg" alt="Amazon" width={50} height={40} />
          </div>
        </div>
  
        <div className="account-info">
          <div>Sign in</div>
          <div>Home</div>
          <div>Profile</div>
          
        </div>
      </div>      
    </header>
  );
};

export default Header;
