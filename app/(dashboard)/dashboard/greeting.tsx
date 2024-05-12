'use client'
import React, { useState, useEffect } from 'react';

const Greeting = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Fetch the user details from local storage
        const userString = localStorage.getItem('user');
        if (userString) {
            const userDetails = JSON.parse(userString);
            setUsername(userDetails.username);
        }
    }, []);

    return (
        <>
            {username ? `${username} 👋` : '👋'}
        </>
    );
};

export default Greeting;
