// import React, { useState, useEffect } from 'react';
// import Navbar from '../components_lite/Navbar';
// import { Button } from '@/components/ui/button';
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Plus, Edit, Trash2, Users } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import { JOB_API_ENDPOINT } from '@/utils/data';

// const EmployerJobs = () => {
//     const navigate = useNavigate();
//     const { user } = useSelector((store) => store.auth);
//     const [jobs, setJobs] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchEmployerJobs = async () => {
//             try {
//                 setLoading(true);
//                 const res = await axios.get(`${JOB_API_ENDPOINT}/employer/my-jobs`, {
//                     withCredentials: true
//                 });

//                 if (res.data.success) {
//                     setJobs(res.data.jobs);
//                 }
//             } catch (error) {
//                 console.error('Error fetching jobs:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (user) {
//             fetchEmployerJobs();
//         }
//     }, [user]);

//     const formatDate = (dateString) => {
//         return new Date(dateString).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric'
//         });
//     };

//     const getStatusBadge = (isActive) => {
//         return isActive ? (
//             <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
//                 Active
//             </Badge>
//         ) : (
//             <Badge variant="secondary">Inactive</Badge>
//         );
//     };

//     const getJobTypeBadge = (jobType) => {
//         const styleMap = {
//             'Full-time': 'bg-blue-100 text-blue-800 border-blue-200',
//             'Part-time': 'bg-purple-100 text-purple-800 border-purple-200',
//             'Remote': 'bg-orange-100 text-orange-800 border-orange-200'
//         };
        
//         return (
//             <Badge className={`${styleMap[jobType]} hover:bg-opacity-80 border`}>
//                 {jobType}
//             </Badge>
//         );
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50">
//                 <Navbar />
//                 <div className="max-w-6xl mx-auto px-4 py-8">
//                     <div className="text-center py-12">Loading your jobs...</div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <Navbar />

//             <div className="max-w-6xl mx-auto px-4 py-8">
//                 {/* Header */}
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-900">My Job Posts</h1>
//                         <p className="text-gray-600 mt-2">
//                             Manage and track your job listings
//                         </p>
//                     </div>
//                     <Button
//                         onClick={() => navigate('/employer/create-job')}
//                         className="bg-green-600 hover:bg-green-700 text-white"
//                     >
//                         <Plus className="w-4 h-4 mr-2" />
//                         Add New Job
//                     </Button>
//                 </div>

//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                     <Card>
//                         <CardHeader className="pb-2">
//                             <CardTitle className="text-2xl font-bold">{jobs.length}</CardTitle>
//                             <CardDescription>Total Jobs</CardDescription>
//                         </CardHeader>
//                     </Card>
//                     <Card>
//                         <CardHeader className="pb-2">
//                             <CardTitle className="text-2xl font-bold text-green-600">
//                                 {jobs.filter(job => job.isActive).length}
//                             </CardTitle>
//                             <CardDescription>Active Jobs</CardDescription>
//                         </CardHeader>
//                     </Card>
//                     <Card>
//                         <CardHeader className="pb-2">
//                             <CardTitle className="text-2xl font-bold">
//                                 {jobs.reduce((total, job) => total + (job.applications?.length || 0), 0)}
//                             </CardTitle>
//                             <CardDescription>Total Applications</CardDescription>
//                         </CardHeader>
//                     </Card>
//                 </div>

//                 {/* Jobs Table */}
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Job Listings</CardTitle>
//                         <CardDescription>
//                             All your posted job positions and their status
//                         </CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         {jobs.length === 0 ? (
//                             <div className="text-center py-12">
//                                 <div className="text-gray-400 text-6xl mb-4">💼</div>
//                                 <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
//                                 <p className="text-gray-600 mb-6">Create your first job posting to start receiving applications</p>
//                                 <Button
//                                     onClick={() => navigate('/employer/create-job')}
//                                     className="bg-green-600 hover:bg-green-700 text-white"
//                                 >
//                                     <Plus className="w-4 h-4 mr-2" />
//                                     Create Your First Job
//                                 </Button>
//                             </div>
//                         ) : (
//                             <Table>
//                                 <TableHeader>
//                                     <TableRow>
//                                         <TableHead>Job Title</TableHead>
//                                         <TableHead>Company</TableHead>
//                                         <TableHead>Location</TableHead>
//                                         <TableHead>Type</TableHead>
//                                         <TableHead>Applications</TableHead>
//                                         <TableHead>Status</TableHead>
//                                         <TableHead>Posted Date</TableHead>
//                                         <TableHead className="text-right">Actions</TableHead>
//                                     </TableRow>
//                                 </TableHeader>
//                                 <TableBody>
//                                     {jobs.map((job) => (
//                                         <TableRow key={job._id} className="hover:bg-gray-50/50">
//                                             <TableCell className="font-medium">{job.title}</TableCell>
//                                             <TableCell>{job.company}</TableCell>
//                                             <TableCell>{job.location}</TableCell>
//                                             <TableCell>{getJobTypeBadge(job.jobType)}</TableCell>
//                                             <TableCell>
//                                                 <div className="flex items-center gap-2">
//                                                     <Users className="w-4 h-4 text-gray-500" />
//                                                     <span className="font-medium">{job.applications?.length || 0}</span>
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell>{getStatusBadge(job.isActive)}</TableCell>
//                                             <TableCell className="text-gray-600">{formatDate(job.createdAt)}</TableCell>
//                                             <TableCell>
//                                                 <div className="flex justify-end gap-2">
//                                                     <Button
//                                                         variant="outline"
//                                                         size="sm"
//                                                         onClick={() => navigate(`/applications/${job._id}/applicants`)}
//                                                         className="h-8 px-3"
//                                                     >
//                                                         <Users className="w-3 h-3 mr-1" />
//                                                         View
//                                                     </Button>
//                                                     <Button
//                                                         variant="outline"
//                                                         size="sm"
//                                                         onClick={() => navigate(`/employer/edit-job/${job._id}`)}
//                                                         className="h-8 w-8 p-0"
//                                                     >
//                                                         <Edit className="w-3 h-3" />
//                                                     </Button>
//                                                     <Button
//                                                         variant="outline"
//                                                         size="sm"
//                                                         className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
//                                                     >
//                                                         <Trash2 className="w-3 h-3" />
//                                                     </Button>
//                                                 </div>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         )}
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     );
// };

// export default EmployerJobs;



import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchJobByText } from "@/redux/jobSlice";
import useGetAllEmployerJobs from "@/hooks/useGetAllEmployerJobs";
import EmployerJobsTable from "./EmployerJobsTable";

const EmployerJobs = () => {
  useGetAllEmployerJobs();
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);
  return (
    <div>
      <Navbar />
      <div className=" max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <Input
            className="w-fit"
            placeholder="Filter by Name & Jobs"
            onChange={(e) => setInput(e.target.value)}
          ></Input>
          <Button onClick={() => navigate("/employer/jobs/create")}>
            Post new Job
          </Button>
        </div>
        <div>
          <EmployerJobsTable />
        </div>
      </div>
    </div>
  );
};

export default EmployerJobs;