import React, { useEffect } from "react";
import ApplicantsTable from "./ApplicantsTable";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "@/redux/applicationSlice";
import { APPLICATION_API_ENDPOINT } from "@/utils/data";
import Navbar from "../components_lite/Navbar";
import { Button } from "../ui/button";
import { Users } from "lucide-react";

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);

  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_API_ENDPOINT}/${params.id}/applicants`,
          { withCredentials: true }
        );
        console.log("API Response:", res.data);
        
        if (res.data.success) {
          // Dispatch the entire job data which includes applications
          dispatch(setAllApplicants(res.data.job));
        }
      } catch (error) {
        console.log("Error fetching applicants:", error);
      }
    };
    fetchAllApplicants();
  }, [dispatch, params.id]); 

  // Check if applications array exists and has items
  const hasApplicants = applicants?.applications?.length > 0;

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-bold text-2xl text-gray-900">
              Applicants for {applicants?.title}
            </h1>
            <p className="text-gray-600 mt-1">
              {applicants?.company} • {applicants?.location}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {applicants?.applications?.length || 0}
            </div>
            <div className="text-sm text-gray-500">Total Applications</div>
          </div>
        </div>

        {hasApplicants ? (
          <ApplicantsTable />
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Applications Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              This job hasn't received any applications yet. Share the job posting to attract candidates.
            </p>
            <div className="space-x-4">
              <Button 
                onClick={() => navigator.clipboard.writeText(window.location.href.replace('/applicants', ''))}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Copy Job Link
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.history.back()}
              >
                Back to Jobs
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applicants;