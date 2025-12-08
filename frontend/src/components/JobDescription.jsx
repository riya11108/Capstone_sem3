import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar'

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });

            if (res.data.success) {
                setIsApplied(true); // Update the local state
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] }
                dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id)) // Ensure the state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    return (
        <div className="bg-[#F5F8FF] min-h-screen">
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 py-8'>
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 space-y-8">
                    {/* Header Section */}
                    <div className='flex items-center justify-between'>
                        <div>
                            <h1 className='font-bold text-3xl text-gray-900 mb-4'>{singleJob?.title}</h1>
                            <div className='flex items-center gap-4 flex-wrap'>
                                <Badge className={'text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1'} variant="ghost">{singleJob?.position} Positions</Badge>
                                <Badge className={'text-[#F83002] font-bold bg-red-50 hover:bg-red-100 px-3 py-1'} variant="ghost">{singleJob?.jobType}</Badge>
                                <Badge className={'text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 px-3 py-1'} variant="ghost">{singleJob?.salary} LPA</Badge>
                            </div>
                        </div>
                        <Button
                            onClick={isApplied ? null : applyJobHandler}
                            disabled={isApplied}
                            className={`rounded-lg py-6 px-8 text-lg ${isApplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#3b6ccf] hover:bg-[#2f55a4] text-white shadow-md hover:shadow-lg transition-all duration-300'}`}>
                            {isApplied ? 'Already Applied' : 'Apply Now'}
                        </Button>
                    </div>

                    <div className="border-t border-gray-100"></div>

                    {/* Description Section */}
                    <div>
                        <h2 className='text-xl font-bold text-gray-900 mb-6'>Job Description</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className='font-semibold text-gray-700 mb-1'>Role</h3>
                                    <p className='text-gray-900 font-medium'>{singleJob?.title}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className='font-semibold text-gray-700 mb-1'>Location</h3>
                                    <p className='text-gray-900 font-medium'>{singleJob?.location}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className='font-semibold text-gray-700 mb-1'>Description</h3>
                                    <p className='text-gray-900 font-medium'>{singleJob?.description}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className='font-semibold text-gray-700 mb-1'>Experience</h3>
                                    <p className='text-gray-900 font-medium'>{singleJob?.experienceLevel} yrs</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className='font-semibold text-gray-700 mb-1'>Salary</h3>
                                    <p className='text-gray-900 font-medium'>{singleJob?.salary} LPA</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className='font-semibold text-gray-700 mb-1'>Applicants</h3>
                                    <p className='text-gray-900 font-medium'>{singleJob?.applications?.length}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className='font-semibold text-gray-700 mb-1'>Posted Date</h3>
                                    <p className='text-gray-900 font-medium'>{singleJob?.createdAt?.split("T")[0]}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobDescription