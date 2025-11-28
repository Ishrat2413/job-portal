import React from 'react';
import JobCards from './JobCards';
import Filter from './Filter';
import Job from './Job';
const jobArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const Jobs = () => {
    return (
        <div className='max-w-7xl mx-auto'>
            <h1>All Jobs</h1>
            <div className='flex justify-between'>
                <div className='w-20%'>
                    <Filter />
                </div>
                {
                    jobArr.length <= 0 ? (
                        <span>Job not Found</span>
                    ) : (<div className=' grid grid-cols-1 md:grid-cols-3 gap-4'>
                        {jobArr.map((job, index) => {
                            return <Job key={index} />
                        })}
                    </div>

                    )
                }

            </div>
        </div>
    );
};

export default Jobs;