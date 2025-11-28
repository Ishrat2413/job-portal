import React, { useMemo } from "react";
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
import { Edit2, Eye, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const EmployerJobsTable = () => {
    const { allEmployerJobs, searchJobByText } = useSelector((store) => store.job);
    const navigate = useNavigate();
    const filterJobs = useMemo(() => {
        return allEmployerJobs.filter((job) => {
            if (!searchJobByText) {
                return true;
            }
            return (
                job.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
                job?.company?.toLowerCase().includes(searchJobByText.toLowerCase())
            );
        });
    }, [allEmployerJobs, searchJobByText]);

    return (
        <div>
            <Table>
                <TableCaption>Your recent Posted Jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterJobs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                No Jobs Added
                            </TableCell>
                        </TableRow>
                    ) : (
                        filterJobs.map((job) => (
                            <TableRow key={job._id || job.id}>
                                <TableCell className="font-medium">{job?.company}</TableCell>
                                <TableCell>{job.title}</TableCell>
                                <TableCell>{job.createdAt ? job.createdAt.split("T")[0] : "N/A"}</TableCell>
                                <TableCell className="text-right">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button className="inline-flex items-center justify-center p-2 hover:bg-gray-100 rounded-md transition-colors ml-auto">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32 p-2" align="end">
                                            <div
                                                onClick={() => navigate(`/employer/jobs/${job._id}`)}
                                                className="flex items-center gap-2 w-full cursor-pointer p-2 rounded-md hover:bg-gray-100 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                <span className="text-sm">Edit</span>
                                            </div>
                                            <hr className="my-1" />
                                            <div
                                                onClick={() => navigate(`/employer/jobs/${job._id}/applicants`)}
                                                className="flex items-center gap-2 w-full cursor-pointer p-2 rounded-md hover:bg-gray-100 transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span className="text-sm">Applicants</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default EmployerJobsTable;