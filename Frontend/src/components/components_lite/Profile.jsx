import React, { useState } from 'react';
import Navbar from './Navbar';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { User, Mail, Briefcase, MapPin, Calendar, Edit, Save, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import AppliedJobs from './AppliedJobs';
import EditProfileModal from './EditProfileModal';

const Profile = () => {

    const [open, setOpen] = useState(false)
    const { user } = useSelector((store) => store.auth)

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
                    <div className="h-16"></div>

                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row items-start md:items-end justify-between">
                            <div className="h-20 flex flex-col md:flex-row items-start md:items-end gap-6">
                                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                                    <AvatarImage
                                        src={user?.profile?.profilePhoto}
                                        alt={user?.fullName}
                                    />
                                    <AvatarFallback className="bg-emerald-500 text-white text-2xl font-bold">
                                        {user?.fullName?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="mt-4 md:mt-0 md:mb-4">
                                    <h1 className="text-3xl font-bold text-gray-900">{user?.fullName}</h1>

                                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                                        <Briefcase className="w-4 h-4" />
                                        <span className="capitalize">{user?.role}</span>
                                    </div>

                                    <p className="text-gray-600 max-w-md">
                                        {user?.profile?.bio || 'No bio added yet.'}
                                    </p>

                                </div>
                                {/* Account Status */}
                                <div className="p-6 mt-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Status</h2>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className={`text-sm ${user?.isApproved ? 'text-emerald-500' : 'text-orange-500'}`}>
                                                {user?.isApproved ? 'Verified' : 'Pending Approval'}
                                            </p>
                                        </div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0">
                                <Button
                                    onClick={() => setOpen(true)}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Update Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-emerald-500" />
                            Personal Information
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="text-gray-900">{user?.email}</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Skills & Expertise */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-emerald-500" />
                            Skills & Expertise
                        </h2>

                        {user?.profile?.skills && user.profile.skills.length > 0 ? (
                            user.profile.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium"
                                >
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <p className="text-gray-500">No skills added yet.</p>
                        )}
                    </div>
                </div>

                {/* Resume Section (for job seekers) */}
                {user?.role === 'jobseeker' || user?.role === 'jobSeeker' && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 my-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Resume</h2>
                        <div className="flex items-center justify-between">
                            <div>
                                {user?.profile?.resume && (
                                    <p className="text-sm text-emerald-500">Resume is available for employers</p>
                                )}
                            </div>
                            <div className="grid  item-center gap-1.5">
                                <label className='text-md font-bold border-emerald-500 text-emerald-500 hover:bg-emerald-50'>Upload Resume</label>
                                {
                                    user?.profile?.resume ? <a target='_blank' href={user?.profile?.resume} download={user?.profile?.resumeOriginalName} className="border-emerald-500 text-emerald-500 hover:bg-emerald-50 bg-white">{user?.profile?.resumeOriginalName}</a> : <span>No Resume Found</span>
                                }
                            </div>
                        </div>
                    </div>
                )}
                <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'>
                    <p>Applied Jobs</p>
                    <AppliedJobs />
                    <EditProfileModal open={open} setOpen={setOpen} />
                </div>
            </div>
        </div>
    );
};

export default Profile;