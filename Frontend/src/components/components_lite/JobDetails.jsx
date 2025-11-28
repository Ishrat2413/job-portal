import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import Navbar from './Navbar';
import { MapPin, Briefcase, Clock, DollarSign, Building, User, Calendar, FileText, ArrowLeft, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { APPLICATION_API_ENDPOINT, JOB_API_ENDPOINT } from '@/utils/data';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((store) => store.auth);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isApplied, setIsApplied] = useState(false);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${JOB_API_ENDPOINT}/get/${id}`, {
                    withCredentials: true
                });

                if (res.data.status === true) {
                    setJob(res.data.job);

                    // ✅ Check if current user has already applied
                    if (user?.role === 'jobSeeker') {
                        try {
                            const applicationCheck = await axios.get(
                                `${APPLICATION_API_ENDPOINT}/get`,
                                { withCredentials: true }
                            );

                            if (applicationCheck.data.success) {
                                const userApplications = applicationCheck.data.applications;
                                const hasApplied = userApplications.some(
                                    app => app.job._id === id
                                );
                                setIsApplied(hasApplied);
                            }
                        } catch (error) {
                            console.log('Error checking applications:', error);
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchJobDetails();
        }
    }, [id, user]);
    const handleApply = async () => {


        try {
            const res = await axios.post(
                `${APPLICATION_API_ENDPOINT}/apply/${id}`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            if (res.data.success) {
                setIsApplied(true);
                toast.success(res.data.message);
            }
        } catch (error) {
            if (error.response?.data?.message?.includes('already applied')) {
                setIsApplied(true);
                toast.info("You have already applied to this job");
            } else {
                toast.error(error.response?.data?.message || "Failed to apply");
            }
        }
        console.log('🔍 === APPLICATION DEBUG END ===');
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="text-center py-12">Loading job details...</div>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
                        <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                {/* Back Button */}
                <Button
                    variant="outline"
                    onClick={() => navigate('/jobs')}
                    className="mb-4 flex items-center gap-2 text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>

                {/* Job Header */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6 mb-4">
                    <div className="flex items-start gap-3 sm:gap-4 mb-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shrink-0">
                            {job.company?.charAt(0) || 'C'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{job.title}</h1>
                            <div className="flex items-center gap-2 text-gray-600 mb-3">
                                <Building className="w-4 h-4" />
                                <span className="font-medium text-sm sm:text-base">{job.company}</span>
                            </div>

                            {/* Info Tags */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium">
                                    <MapPin className="w-3 h-3" />
                                    {job.location}
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                                    <Briefcase className="w-3 h-3" />
                                    {job.jobType}
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">
                                    <DollarSign className="w-3 h-3" />
                                    {job.salaryRange}
                                </span>
                                {job.experience && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 text-orange-700 rounded-md text-xs font-medium">
                                        <Clock className="w-3 h-3" />
                                        {job.experience}y exp
                                    </span>
                                )}
                            </div>

                            {/* Apply Button & Date */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                <Button
                                    disabled={isApplied || user?.role !== 'jobSeeker'}
                                    onClick={isApplied ? null : handleApply}
                                    className={`w-full sm:w-auto px-6 py-2 text-sm font-semibold rounded-lg ${isApplied
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : user?.role !== 'jobSeeker'
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-emerald-500 hover:bg-emerald-600"
                                        }`}
                                >
                                    {isApplied ? (
                                        <span className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Applied
                                        </span>
                                    ) : user?.role !== 'jobSeeker' ? (
                                        "Employers can't apply"
                                    ) : (
                                        "Apply Now"
                                    )}
                                </Button>

                                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Posted {formatDate(job.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Compact Two-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Main Content - Takes 2 columns */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Description */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-5">
                            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-emerald-500" />
                                Description
                            </h2>
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
                        </div>

                        {/* Requirements - Compact Grid */}
                        {job.requirements && job.requirements.length > 0 && (
                            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-5">
                                <h2 className="text-lg font-bold text-gray-900 mb-3">Requirements</h2>
                                <div className="flex flex-wrap gap-2">
                                    {job.requirements.map((skill, index) => (
                                        <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-md text-xs sm:text-sm font-medium border border-gray-200">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Compact Sidebar - Takes 1 column */}
                    <div className="space-y-4">
                        {/* Job Overview - Compact */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                            <h3 className="text-base font-semibold text-gray-900 mb-3">Overview</h3>
                            <div className="space-y-2.5 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Applications</span>
                                    <span className="font-semibold text-gray-900">{job.applications?.length || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Experience</span>
                                    <span className="font-semibold text-gray-900">{job.experience}y</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Status</span>
                                    <span className={`font-semibold ${job.isActive ? 'text-emerald-600' : 'text-gray-600'}`}>
                                        {job.isActive ? 'Active' : 'Closed'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Employer Info - Compact */}
                        {job.employer && (
                            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                                <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <User className="w-4 h-4 text-emerald-500" />
                                    Posted By
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                                        {job.employer.fullName?.charAt(0) || 'U'}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900 text-sm truncate">{job.employer.fullName}</p>
                                        <p className="text-xs text-gray-600 truncate">{job.employer.email}</p>
                                        <span className={`text-xs ${job.employer.isApproved ? 'text-emerald-600' : 'text-orange-600'}`}>
                                            {job.employer.isApproved ? '✓ Verified' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;