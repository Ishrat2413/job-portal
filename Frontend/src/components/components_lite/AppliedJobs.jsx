import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar, Building, MapPin, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { APPLICATION_API_ENDPOINT } from '@/utils/data';
import { useNavigate } from 'react-router-dom';

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${APPLICATION_API_ENDPOINT}/get`, {
          withCredentials: true
        });

        if (res.data.success) {
          setApplications(res.data.applications || []);
        }
      } catch (error) {
        console.log('Could not load your applications', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'jobSeeker') {
      fetchAppliedJobs();
    }
  }, [user]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'accepted':
        return { 
          icon: CheckCircle, 
          color: 'text-green-600 bg-green-50 border-green-200',
          text: 'Accepted' 
        };
      case 'rejected':
        return { 
          icon: XCircle, 
          color: 'text-red-600 bg-red-50 border-red-200',
          text: 'Not Selected' 
        };
      default:
        return { 
          icon: Clock, 
          color: 'text-blue-600 bg-blue-50 border-blue-200',
          text: 'Pending' 
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
        <p className="text-gray-600">Loading your job applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Your Job Applications</h2>
        <p className="text-gray-600 mt-2">
          {applications.length === 0 
            ? "You haven't applied to any jobs yet"
            : `You've applied to ${applications.length} job${applications.length > 1 ? 's' : ''}`
          }
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No applications yet</h3>
          <p className="text-gray-600 mb-6">Start exploring jobs that match your skills</p>
          <Button 
            onClick={() => navigate('/jobs')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Find Jobs
          </Button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Position</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => {
                  const StatusIcon = getStatusInfo(application.status).icon;
                  
                  return (
                    <TableRow key={application._id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">
                            {application.job?.title || 'Position not available'}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <Building className="w-3 h-3 mr-1" />
                            {application.job?.jobType || 'Full-time'}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-gray-700">
                        {application.job?.company || 'Company not available'}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          {application.job?.location || 'Location not specified'}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(application.createdAt)}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`flex items-center w-fit gap-1 ${getStatusInfo(application.status).color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {getStatusInfo(application.status).text}
                        </Badge>
                      </TableCell>
        
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Simple stats */}
          <div className="flex justify-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-blue-600 font-semibold">
                {applications.filter(app => app.status === 'pending').length}
              </div>
              <div className="text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-green-600 font-semibold">
                {applications.filter(app => app.status === 'accepted').length}
              </div>
              <div className="text-gray-600">Accepted</div>
            </div>
            <div className="text-center">
              <div className="text-red-600 font-semibold">
                {applications.filter(app => app.status === 'rejected').length}
              </div>
              <div className="text-gray-600">Not Selected</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AppliedJobs;