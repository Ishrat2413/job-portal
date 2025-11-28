import React, { useState } from 'react';
import Navbar from '../components_lite/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_ENDPOINT } from '@/utils/data.js';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';

const Register = () => {
    const [input, setInput] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "",
        file: null
    });

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { loading } = useSelector((store) => store.auth)

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        // console.log(input)
        setLoading(true);

        const formData = new FormData();
        formData.append("fullName", input.fullName);
        formData.append("email", input.email);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true))
            const res = await axios.post(`${USER_API_ENDPOINT}/register`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login")
                toast.success(res.data.message)
            }
        } catch (error) {
            console.error(error);
            const errorMessage = error.message ? error.response.data.message : "Unexpected error Occurred"
            toast.error(errorMessage)
        } finally {
            dispatch(setLoading(false))
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="flex items-center justify-center max-w-7xl mx-auto px-4 py-10">
                <form onSubmit={submitHandler} className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h1 className="font-bold text-2xl mb-6 text-center">Register</h1>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={input.fullName}
                                onChange={changeEventHandler}
                                placeholder="Your Name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={input.email}
                                onChange={changeEventHandler}
                                placeholder="Your Email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={input.password}
                                onChange={changeEventHandler}
                                placeholder="Enter Password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-2">Role</label>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="jobSeeker"
                                        checked={input.role === "jobSeeker"}
                                        onChange={changeEventHandler}
                                        className="w-4 h-4"
                                    />
                                    <span>Job Seeker</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="employer"
                                        checked={input.role === "employer"}
                                        onChange={changeEventHandler}
                                        className="w-4 h-4"
                                    />
                                    <span>Employer</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Profile Photo</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler}
                                className="w-full text-sm cursor-pointer"
                            />
                        </div>

                        {loading ? (
                            <button
                                disabled
                                className="w-full bg-emerald-400 text-white py-3 rounded-md font-bold mt-2 flex items-center justify-center gap-2"
                            >

                                Please wait...
                            </button>
                        ) : (
                            <button
                                type='submit'
                                className="w-full bg-emerald-500 text-white py-3 rounded-md hover:bg-emerald-600 transition-colors font-medium mt-2"
                            >
                                Register
                            </button>
                        )}

                        <p className="text-center text-sm text-gray-600 mt-4">
                            Already have an account?{" "}
                            <Link to="/login" className="text-emerald-500 hover:underline font-medium">
                                Login
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;