import React from 'react';
import { MapPin, Briefcase, DollarSign, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JobCards = ({ job }) => {
    const navigate = useNavigate()
    const {
        title,
        company,
        location,
        jobType,
        salaryRange,
        description,
        requirements,
        createdAt
    } = job;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 p-5 h-full flex flex-col">
            {/* Company Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-linear-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {company?.charAt(0) || 'C'}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{title}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {company}
                    </p>
                </div>
            </div>

            {/* Job Details */}
            <div className="space-y-3 mb-4 flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>{jobType}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span>{salaryRange}</span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2">
                    {description}
                </p>

                {requirements && requirements.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {requirements.slice(0, 3).map((skill, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                                {skill}
                            </span>
                        ))}
                        {requirements.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                +{requirements.length - 3} more
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                        {formatDate(createdAt)}
                    </span>
                    <button onClick={() => navigate(`/description/${job._id}`)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobCards;