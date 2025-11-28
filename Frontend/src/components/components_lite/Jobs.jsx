import React, { useState, useMemo } from 'react';
import JobCards from './JobCards';
import Filter from './Filter';
import { useSelector } from 'react-redux';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Search, Filter as FilterIcon } from 'lucide-react';
import { Input } from '../ui/input';

const Jobs = () => {
  useGetAllJobs();
  const { jobs } = useSelector((store) => store.job);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Extract unique filter values from jobs
  const filterData = useMemo(() => [
    {
      filterType: "Location",
      array: [...new Set(jobs.map(job => job.location).filter(Boolean))],
    },
    {
      filterType: "Job Type", 
      array: [...new Set(jobs.map(job => job.jobType).filter(Boolean))],
    },
    {
      filterType: "Experience",
      array: [...new Set(jobs.map(job => `${job.experience}+ years`).filter(Boolean))],
    }
  ], [jobs]);

  // Use useMemo instead of useEffect for derived state
  const filteredJobs = useMemo(() => {
    let result = jobs;

    // Apply search
    if (searchTerm) {
      result = result.filter(job =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value) {
        switch (key) {
          case 'location': {
            result = result.filter(job => job.location === value);
            break;
          }
          case 'job type': {
            result = result.filter(job => job.jobType === value);
            break;
          }
          case 'experience': {
            const expYears = parseInt(value);
            result = result.filter(job => job.experience >= expYears);
            break;
          }
          default:
            break;
        }
      }
    });

    return result;
  }, [jobs, searchTerm, selectedFilters]);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value === prev[filterType] ? '' : value // Toggle filter
    }));
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    setSearchTerm('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Job Opportunities</h1>
        <p className="text-gray-600">
          {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} available
          {Object.keys(selectedFilters).length > 0 || searchTerm ? ' (filtered)' : ''}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search jobs by title, company, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <FilterIcon className="w-4 h-4" />
          Filters
          {Object.keys(selectedFilters).length > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {Object.keys(selectedFilters).length}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`md:col-span-1 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-6">
            <Filter
              filters={filterData}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="md:col-span-3">
          {/* No Results Message */}
          {filteredJobs.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {jobs.length === 0 ? 'No jobs available' : 'No jobs match your filters'}
              </h3>
              <p className="text-gray-600 mb-4">
                {jobs.length === 0 
                  ? 'Check back later for new opportunities' 
                  : 'Try adjusting your search or filters'
                }
              </p>
              {(Object.keys(selectedFilters).length > 0 || searchTerm) && (
                <button
                  onClick={handleClearFilters}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Jobs Grid */}
          {filteredJobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <JobCards key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;