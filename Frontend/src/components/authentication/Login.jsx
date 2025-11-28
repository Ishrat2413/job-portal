import React, { useState } from 'react';
import Navbar from '../components_lite/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { USER_API_ENDPOINT } from '@/utils/data.js';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loading } = useSelector((store) => store.auth)

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        // console.log('Login input:', input);
        let role = input.role;
        if (input.email.includes('@admin.') || input.email === 'admin@jobportal.com') {
            role = 'admin';
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_ENDPOINT}/login`, {...input, role:role}, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error('Full error:', error);
            console.error('Error response:', error.response?.data); // ✅ Get backend error message
            const errorMessage = error.response?.data?.message || "Unexpected error Occurred";
            toast.error(errorMessage);
        } finally {
            dispatch(setLoading(false));
        }
    };
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="flex items-center justify-center max-w-7xl mx-auto px-4 py-10">
                <form onSubmit={submitHandler} className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h1 className="font-bold text-2xl mb-6 text-center">Login</h1>

                    <div className="space-y-4">
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
                                Login
                            </button>
                        )}

                        <p className="text-center text-sm text-gray-600 mt-4">
                            Already have an account?{" "}
                            <Link to="/register" className="text-emerald-500 hover:underline font-medium">
                                Register
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;