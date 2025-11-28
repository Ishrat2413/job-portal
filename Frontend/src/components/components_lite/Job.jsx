import React from 'react';
import { Button } from '../ui/button';
import { Bookmark } from 'lucide-react';
import { Avatar } from '../ui/avatar';

const Job = () => {
    return (
        <div>
            <p>3 days ago</p>
            <Button variant="outline" className='rounded-full' size="icon">
                <Bookmark />
            </Button>
            <div className='flex items-center'>
                <Button variant="outline" className='rounded-full' size="icon">
                <Avatar src="https://ibb.co.com/9kb3Y3dT" />
                <p>Company Name</p>
            </Button>
            </div>
        </div>
    );
};

export default Job;