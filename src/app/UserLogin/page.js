'use client';

import Link from 'next/link';
import UserLogin from '../components/UserLogin';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LoginPage = () => {
    return (
        <>
        <div className="login-container">
             <UserLogin />           
        </div>
        </>
    );
};

export default LoginPage;
