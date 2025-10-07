'use client';
import { useState } from 'react';
import UserLogin from '../_components/UserLogin';
import UserSignUp from '../_components/UserSignUp';
import Header from '../_components/Header';
import Footer from '../_components/Footer';

const LoginPage = () => {
    const [login, setLogin] = useState(true);

    return (
        <>
            <Header />
            <div className="login-container">
                <h1>Login/SignUp</h1>
                {login ? <UserLogin /> : <UserSignUp />}
                <div className="toggle-button-container">
                    <button onClick={() => setLogin(!login)}>
                        {login ? "Do not have account? SignUp" : "Already have account? Login"}
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default LoginPage;
