import { setAllJobs } from '@/redux/jobSlice';
import { JOB_API_ENDPOINT } from '@/utils/data';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

function useGetAllJobs() {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_ENDPOINT}/get`, {
                    withCredentials: true
                })
                // console.log(res.data)
                if (res.data.status === true) {
                    dispatch(setAllJobs(res.data.jobs))
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchAllJobs()
    }, [dispatch])
}

export default useGetAllJobs;