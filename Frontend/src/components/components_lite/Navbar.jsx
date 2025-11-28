import { useState } from 'react';
import { Menu, X, User2, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_ENDPOINT } from '@/utils/data';
import { setUser } from '@/redux/authSlice';

// navLinks
const NavLinks = ({ navLinks, mobile = false }) => (
    <ul className={mobile ? "space-y-1" : "flex font-medium items-center gap-6 text-gray-200"}>
        {navLinks.map((link) => (
            <li key={link.name}>
                <a
                    href={link.path}
                    className={
                        mobile
                            ? "block px-3 py-2 rounded-md text-gray-200 hover:bg-slate-800 hover:text-emerald-400 font-medium transition-colors"
                            : "hover:text-emerald-400 transition-colors"
                    }
                >
                    {link.name}
                </a>
            </li>
        ))}
    </ul>
);

// Auth Buttons 
const AuthButtons = ({ mobile = false }) => (
    <div className={mobile ? "px-3 py-2 space-y-2 border-t border-slate-700 mt-2 pt-3" : "flex items-center gap-2"}>
        <Link to={"/login"}>
            <button className={mobile ? "w-full px-4 py-2 border border-gray-400 text-gray-200 rounded-lg hover:bg-slate-700 transition-colors font-medium" : "px-4 py-2 border border-gray-400 text-gray-200 rounded-lg hover:bg-slate-700 transition-colors font-medium cursor-pointer"}>
                Login
            </button>
        </Link>
        <Link to={"/register"}>
            <button className={mobile ? "w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium" : "px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium cursor-pointer"}>
                Register
            </button>
        </Link>
    </div>
);

// User Profile 
const UserProfile = ({ user, logoutHandler, mobile = false }) => (
    <div className={mobile ? "px-3 py-2 space-y-2 border-t border-slate-700 mt-2 pt-3" : ""}>
        {mobile && (
            <div className="flex items-center gap-3 mb-3">
                {user?.profile?.profilePhoto && user.profile.profilePhoto.trim() !== "" ? (
                    <img
                        src={user.profile.profilePhoto}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-emerald-400"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full border-2 border-emerald-400 bg-gray-600 flex items-center justify-center text-white">
                        <span className="font-medium">
                            {user?.fullName?.charAt(0) || 'U'}
                        </span>
                    </div>
                )}
                <div>
                    <p className="font-medium text-sm text-gray-200">{user?.fullName || 'User'}</p>
                    <p className="text-xs text-gray-400">{user?.profile?.bio || 'No bio'}</p>
                </div>
            </div>
        )}
        {user && (user.role === "jobSeeker") && (
            <Link
                to={"/profile"}
                className={
                    mobile
                        ? "flex items-center gap-2 px-3 py-2 text-gray-200 hover:bg-slate-800 hover:text-emerald-400 rounded-md transition-colors"
                        : "flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-md transition-colors"
                }
            >
                <User2 className="w-4 h-4" />
                <span>Profile</span>
            </Link>
        )}
        <button
            onClick={logoutHandler}
            className={
                mobile
                    ? "flex items-center gap-2 px-3 py-2 text-gray-200 hover:bg-slate-800 hover:text-emerald-400 rounded-md transition-colors w-full text-left"
                    : "flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-md transition-colors text-left w-full"
            }
        >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
        </button>
    </div>
);

export default function Navbar() {
    const { user } = useSelector((store) => store.auth)
    const [isOpen, setIsOpen] = useState(false);
    const [showPopover, setShowPopover] = useState(false);
    // console.log("Current user:", user);
    const dispatch = useDispatch((store) => store.auth)
    const navigate = useNavigate()

    const logoutHandler = async () => {
        try {
            const response = await axios.post(`${USER_API_ENDPOINT}/logout`, { withCredentials: true })
            if (response.data.success) {
                toast.success("Logged out Successfully!")
                dispatch(setUser(null))
                navigate("/")
            }
        } catch (error) {
            console.log(error.message)
            toast.error(error.response.data.message)
        }
    };

    // Navigation links based on role
    const navLinks = user && user.role === "employer"
        ? [
            { name: "Applicants", path: "/employer/applicants" },
            { name: "Jobs", path: "/employer/jobs" }
        ]
        : user && user.role === "admin"
            ? [
                { name: "Dashboard", path: "/admin" },
                { name: "Users", path: "/admin/users" },
                { name: "Jobs", path: "/admin/jobs" }
            ]
            : [
                { name: "Home", path: "/" },
                { name: "Browse", path: "/Browse" },
                { name: "Jobs", path: "/Jobs" }
            ];

    return (
        <div className="bg-linear-to-r from-slate-800 to-slate-900 shadow-lg">
            <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
                {/* Logo */}
                <a href="/">
                    <h1 className="text-2xl font-bold">
                        <span className="text-emerald-400">Job</span>{" "}
                        <span className="text-white">Portal</span>
                    </h1>
                </a>

                {/* Desktop Nav*/}
                <div className="hidden md:flex items-center gap-10">
                    <NavLinks navLinks={navLinks} />

                    {/* Auth Buttons */}
                    {!user ? (
                        <AuthButtons />
                    ) : (
                        <div className="relative">
                            <div
                                className="w-10 h-10 rounded-full cursor-pointer border-2 border-emerald-400 hover:border-emerald-300 transition-colors flex items-center justify-center"
                                onClick={() => {
                                    // console.log('Profile clicked');
                                    setShowPopover(!showPopover);
                                }}
                            >
                                {user?.profile?.profilePhoto && user.profile.profilePhoto.trim() !== "" ? (
                                    <img
                                        src={user.profile.profilePhoto}
                                        alt="Profile"
                                        className="w-full h-full rounded-full"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-gray-600 flex items-center justify-center text-white">
                                        <span className="font-medium">
                                            {user?.fullName?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Popover */}
                            {showPopover && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40 bg-transparent"
                                        onClick={() => {
                                            // console.log('Overlay clicked');
                                            setShowPopover(false);
                                        }}
                                    />

                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                                        <div className="p-4">
                                            <div className="flex items-center gap-4 mb-4">
                                                {user?.profile?.profilePhoto && user.profile.profilePhoto.trim() !== "" ? (
                                                    <img
                                                        src={user.profile.profilePhoto}
                                                        alt="Profile"
                                                        className="w-12 h-12 rounded-full border-2 border-emerald-400"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full border-2 border-emerald-400 bg-gray-600 flex items-center justify-center text-white">
                                                        <span className="font-medium text-lg">
                                                            {user?.fullName?.charAt(0) || 'U'}
                                                        </span>
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{user?.fullName || 'User'}</h3>
                                                    <p className="text-sm text-gray-500">{user?.profile?.bio || 'No bio'}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1 border-t pt-3 text-gray-600">
                                                <UserProfile user={user} logoutHandler={logoutHandler} />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-gray-200 hover:text-emerald-400 transition-colors"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-slate-900 border-t border-slate-700">
                    <div className="px-4 pt-2 pb-3">
                        <NavLinks navLinks={navLinks} mobile />
                        {!user ? <AuthButtons mobile /> : <UserProfile user={user} logoutHandler={logoutHandler} mobile />}
                    </div>
                </div>
            )}
        </div>
    );
}