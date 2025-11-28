import React, { useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salaryRange: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    company: "", 
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const jobTypeChangeHandler = (value) => {
    setInput({ ...input, jobType: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!input.company) {
      toast.error("Please enter company name");
      return;
    }

    if (!input.jobType) {
      toast.error("Please select a job type");
      return;
    }

    // Prepare data for API - convert requirements string to array
    const jobData = {
      ...input,
      requirements: input.requirements.split(',').map(req => req.trim()).filter(req => req),
      // company is already a string in the input state
    };

    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_ENDPOINT}/post`, jobData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/employer/jobs");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Something went wrong");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-5">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl border border-gray-300 shadow-sm hover:shadow-lg rounded-lg bg-white w-full mx-4"
        >
          <h1 className="text-2xl font-bold text-center mb-6">Post a New Job</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                type="text"
                name="title"
                value={input.title}
                placeholder="Senior Frontend Developer"
                className="focus-visible:ring-1"
                onChange={changeEventHandler}
                required
              />
            </div>
            
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                type="text"
                name="company"
                value={input.company}
                placeholder="Google, Microsoft"
                className="focus-visible:ring-1"
                onChange={changeEventHandler}
                required
              />
            </div>
            
            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Job Description *</Label>
              <Input
                id="description"
                name="description"
                value={input.description}
                placeholder="Describe the job responsibilities"
                className="focus-visible:ring-1"
                onChange={changeEventHandler}
                required
              />
            </div>
            
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                type="text"
                name="location"
                value={input.location}
                placeholder="New York"
                className="focus-visible:ring-1"
                onChange={changeEventHandler}
                required
              />
            </div>
            
            {/* Salary Range */}
            <div className="space-y-2">
              <Label htmlFor="salaryRange">Salary Range *</Label>
              <Input
                id="salaryRange"
                type="text"
                name="salaryRange"
                value={input.salaryRange}
                placeholder="e.g., $50,000 - $70,000"
                className="focus-visible:ring-1"
                onChange={changeEventHandler}
                required
              />
            </div>
            
            {/* Number of Positions */}
            <div className="space-y-2">
              <Label htmlFor="position">Number of Positions</Label>
              <Input
                id="position"
                type="number"
                name="position"
                value={input.position}
                placeholder="e.g., 2"
                className="focus-visible:ring-1"
                onChange={changeEventHandler}
                min="1"
              />
            </div>
            
            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience">Experience (Years) *</Label>
              <Input
                id="experience"
                type="number"
                name="experience"
                value={input.experience}
                placeholder="e.g., 3"
                className="focus-visible:ring-1"
                onChange={changeEventHandler}
                min="0"
                required
              />
            </div>

            {/* Job Type */}
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type *</Label>
              <Select onValueChange={jobTypeChangeHandler}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Requirements */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Input
                id="requirements"
                type="text"
                name="requirements"
                value={input.requirements}
                placeholder="Enter requirements separated by commas (e.g., React, Node.js, MongoDB)"
                className="focus-visible:ring-1"
                onChange={changeEventHandler}
              />
              <p className="text-xs text-gray-500">Separate multiple requirements with commas</p>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex items-center justify-center mt-6">
            {loading ? (
              <Button disabled className="w-full px-4 py-2 text-sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting Job...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white"
              >
                Post Job
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;