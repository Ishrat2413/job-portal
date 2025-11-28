import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components_lite/Navbar';

const PendingEmployers = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPendingEmployers = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get('/api/admin/employers/pending', {
          withCredentials: true
        });
        
        console.log('Full API Response:', res); // Debug the entire response
        
        // Handle different possible response structures
        if (res.data && Array.isArray(res.data)) {
          // If response.data is directly the array
          setEmployers(res.data);
        } else if (res.data && Array.isArray(res.data.employers)) {
          // If response.data has employers array
          setEmployers(res.data.employers);
        } else if (res.data && res.data.success && Array.isArray(res.data.data)) {
          // If response.data has data array
          setEmployers(res.data.data);
        } else {
          setEmployers([]);
          setError('No pending employers found or invalid response format');
        }
      } catch (error) {
        console.log('Error:', error);
        setError('Failed to load pending employers: ' + (error.response?.data?.message || error.message));
        setEmployers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingEmployers();
  }, []);

  const approveEmployer = async (id) => {
    try {
      await axios.put(`/api/admin/employers/${id}/approve`, {}, {
        withCredentials: true
      });
      
      // Refresh the list after approval
      const res = await axios.get('/api/admin/employers/pending', {
        withCredentials: true
      });
      
      // Use the same logic as above to refresh the list
      if (res.data && Array.isArray(res.data)) {
        setEmployers(res.data);
      } else if (res.data && Array.isArray(res.data.employers)) {
        setEmployers(res.data.employers);
      } else if (res.data && res.data.success && Array.isArray(res.data.data)) {
        setEmployers(res.data.data);
      } else {
        setEmployers([]);
      }
    } catch (error) {
      console.log('Error:', error);
      setError('Failed to approve employer: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-8">Loading pending employers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-bold mb-6">Pending Employers</h1>
        <div className="bg-white rounded-lg shadow border p-6 text-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
        <Navbar />
      <h1 className="text-3xl font-bold mb-6">Pending Employers</h1>
      
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employers && employers.length > 0 ? (
              employers.map(employer => (
                <tr key={employer._id} className="border-t">
                  <td className="px-6 py-4">{employer.fullName || 'N/A'}</td>
                  <td className="px-6 py-4">{employer.email || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => approveEmployer(employer._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                  No pending employers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingEmployers;