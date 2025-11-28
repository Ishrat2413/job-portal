import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components_lite/Navbar';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admin/pending-employers" className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
          <h3 className="text-xl font-semibold mb-2">Pending Employers</h3>
          <p className="text-gray-600">Approve or reject employer registrations</p>
        </Link>

        <Link to="/admin/users" className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
          <h3 className="text-xl font-semibold mb-2">Manage Users</h3>
          <p className="text-gray-600">Block or unblock users</p>
        </Link>

        <Link to="/admin/jobs" className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
          <h3 className="text-xl font-semibold mb-2">All Jobs</h3>
          <p className="text-gray-600">View all job postings</p>
        </Link>

        <Link to="/admin/applications" className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
          <h3 className="text-xl font-semibold mb-2">All Applications</h3>
          <p className="text-gray-600">View all job applications</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;