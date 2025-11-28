import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_ENDPOINT } from '@/utils/data';
import { toast } from 'sonner';
import { setUser } from '@/redux/authSlice';

const EditProfileModal = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false)
    const { user } = useSelector((store) => store.auth)
    const dispatch = useDispatch()
    // console.log(user)
    const [input, setInput] = useState({
        fullName: user?.fullName || "",
        email: user?.email || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(', ') || '',
        file: user?.profile?.resume
    })

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }
    const handleFileChange = async (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData()
        formData.append("fullName", input.fullName)
        formData.append("email", input.email)
        formData.append("bio", input.bio)
        formData.append("skills", input.skills)
        if (input.file) {
            formData.append("file", input.file)
        }
        try {
            setLoading(true)
            const res = await axios.post(`${USER_API_ENDPOINT}/profile/update`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            })
            if (res.data.success) {
                dispatch(setUser(res.data.user))
                toast.success(res.data.message)
            }

        } catch (error) {
            console.log(error.message)
            toast.error("Failed to Update Profile")
        }
        finally {
            setLoading(false)
        }
        setOpen(false)
        // console.log(input)
    }
    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0]
        setInput({ ...input, file })
    }
    return (
        <div>
            <Dialog open={open}>
                <DialogTrigger>Open</DialogTrigger>
                <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto" onInteractOutside={() => setOpen(false)}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold">Edit Profile</DialogTitle>
                        <DialogDescription className="text-sm text-gray-500 mt-1">
                            Update your profile information below
                        </DialogDescription>
                    </DialogHeader>
                    
                    {/* Form for editing profile */}
                    <form onSubmit={handleFileChange} className="space-y-3 mt-2">
                        <div className="space-y-2">
                            <label htmlFor="fullName" className="text-sm font-medium text-gray-700 block">
                                Full Name
                            </label>
                            <input 
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={input.fullName}
                                onChange={changeEventHandler}
                                placeholder="Enter your full name"
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" 
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                                Email Address
                            </label>
                            <input 
                                type="email"
                                id="email"
                                value={input.email}
                                name="email"
                                onChange={changeEventHandler}
                                placeholder="your.email@example.com"
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" 
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label htmlFor="bio" className="text-sm font-medium text-gray-700 block">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={input.bio}
                                onChange={changeEventHandler}
                                rows="3"
                                placeholder="Tell us about yourself..."
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none" 
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label htmlFor="skills" className="text-sm font-medium text-gray-700 block">
                                Skills
                            </label>
                            <input 
                                type="text"
                                id="skills"
                                name="skills"
                                value={input.skills}
                                onChange={changeEventHandler}
                                placeholder="React, Node.js, Python (comma separated)"
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" 
                            />
                            <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
                        </div>
                        
                        <div className="space-y-2">
                            <label htmlFor="file" className="text-sm font-medium text-gray-700 block">
                                Resume
                            </label>
                            <div className="relative">
                                <input 
                                    type="file"
                                    id="file"
                                    name="file"
                                    accept="application/pdf"
                                    onChange={fileChangeHandler}
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" 
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">PDF format only, max 5MB</p>
                        </div>
                        
                        <DialogFooter className="gap-2 sm:gap-0 pt-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setOpen(false)}
                                className="w-full sm:w-auto"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            {
                                loading ? (
                                    <Button 
                                        type="submit" 
                                        variant="primary" 
                                        disabled
                                        className="w-full sm:w-auto"
                                    >
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </span>
                                    </Button>
                                ) : (
                                    <Button 
                                        type="submit" 
                                        variant="primary"
                                        className="w-full sm:w-auto"
                                    >
                                        Save Changes
                                    </Button>
                                )
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EditProfileModal;