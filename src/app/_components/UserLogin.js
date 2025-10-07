'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../style.css';

const UserLogin = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSuccess(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            setMessage(data.message);
            setIsSuccess(response.ok);
            if (response.ok) {
                sessionStorage.setItem('loginData', JSON.stringify(data));
                router.push('/dashboard');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
            setIsSuccess(false);
        }
    };

    return (
        <div>
            <div className="login-window">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
                {message && (
                    <p style={{ color: isSuccess ? 'green' : 'red' }}>{message}</p>
                )}
            </div>
        </div>
    );
};

export default UserLogin;
