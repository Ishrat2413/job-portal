import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { APPLICATION_API_ENDPOINT } from "@/utils/data";

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);

  const statusHandler = async (status, id) => {
    try {
      const res = await axios.post(
        `${APPLICATION_API_ENDPOINT}/status/${id}/update`,
        { status },
        { withCredentials: true }
      );
      
      if (res.data.success) {
        toast.success(res.data.message);
        // You might want to refresh the applicants list here
        window.location.reload(); // Simple solution, or you can update Redux state
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // Check if applicants data exists and has applications
  if (!applicants || !applicants.applications || applicants.applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No applicants found for this job.</p>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent applicants</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.applications.map((application) => (
            <TableRow key={application._id}>
              <TableCell className="font-medium">
                {application?.applicant?.fullName || application?.applicant?.fullname || "N/A"}
              </TableCell>
              <TableCell>{application?.applicant?.email || "N/A"}</TableCell>
              <TableCell>{application?.applicant?.phoneNumber || "N/A"}</TableCell>
              <TableCell>
                {application?.applicant?.profile?.resume ? (
                  <a
                    className="text-blue-600 hover:text-blue-800 cursor-pointer underline"
                    href={application.applicant.profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                ) : (
                  <span className="text-gray-500">No Resume</span>
                )}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  application.status === 'accepted' 
                    ? 'bg-green-100 text-green-800'
                    : application.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {application.status?.toUpperCase() || 'PENDING'}
                </span>
              </TableCell>
              <TableCell>
                {application?.createdAt ? application.createdAt.split("T")[0] : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="inline-flex items-center justify-center p-2 hover:bg-gray-100 rounded-md transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-2">
                    <div className="space-y-1">
                      {shortlistingStatus.map((status, index) => (
                        <div
                          onClick={() => statusHandler(status.toLowerCase(), application._id)}
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                          <input
                            type="radio"
                            name={`status-${application._id}`}
                            value={status}
                            checked={application.status === status.toLowerCase()}
                            onChange={() => {}}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">{status}</span>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;