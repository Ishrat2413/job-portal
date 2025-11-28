import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Jobs from './Jobs';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { user } = useSelector((store) => store.auth)
    const navigate = useNavigate()

    useEffect(() => {
        if (user?.role === "employer") {
            navigate("/employer/jobs")
        }
    }, [navigate, user?.role])
    return (
        <div>
            <Navbar />
            <Jobs />
        </div>
    );
};

export default Home;