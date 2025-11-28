import React from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const filterData = [
    {
        filterType: "Location",
        array: [
            "habi",
            "jabi",
            "kabi",
            "labi",
            "kabbh"
        ],
    },
    {
        filterType: "Job Type",
        array: ["Full-time", "Part-time", "Remote"],
    },
]
const Filter = () => {
    return (
        <div>
            <p>Filter Jobs</p>
            <hr className='mt-3' />
            <RadioGroup>
                {filterData.map((data, index) => (
                    <div key={index}>
                        <h2>{data.filterType}</h2>
                        {
                            data.array.map((item, index) => (

                                <div key={index}>
                                    <RadioGroupItem value={item} >

                                    </RadioGroupItem>
                                    <label>{item}</label>
                                </div>

                            ))
                        }
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
};

export default Filter;