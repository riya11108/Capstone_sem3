import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { Button } from './ui/button';

import { motion } from 'framer-motion';

// ... (other imports remain, just adding motion)

const Browse = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const { searchedQuery } = useSelector(store => store.job);
    const dispatch = useDispatch();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                // Using limit=6 to match the Jobs page standard
                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}&page=${currentPage}&limit=6`, { withCredentials: true });
                if (res.data.success) {
                    setJobs(res.data.jobs);
                    setTotalPages(res.data.totalPages || 1);
                    setTotalJobs(res.data.totalJobs || 0);
                }
            } catch (error) {
                console.log(error);
                setJobs([]);
                setTotalJobs(0);
            } finally {
                setLoading(false);
            }
        }
        fetchJobs();
    }, [searchedQuery, currentPage]);

    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        }
    }, [])

    // Reset to page 1 on new search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchedQuery]);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    }

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    }

    return (
        <div className='bg-[#F5F8FF] min-h-screen'>
            <Navbar />
            <div className='max-w-7xl mx-auto py-10'>
                <h1 className='font-bold text-2xl my-6 text-gray-800 px-4'>Search Results ({totalJobs})</h1>
                <div className='px-4'>
                    {
                        loading ? (
                            <div className="flex justify-center items-center h-[50vh]">
                                <span className="text-gray-500 font-medium">Loading...</span>
                            </div>
                        ) : jobs.length <= 0 ? (
                            <div className="flex justify-center items-center h-[50vh]">
                                <span className="text-gray-500 font-medium text-lg">No Jobs Found</span>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {jobs.map((job) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        key={job?._id}>
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        )
                    }
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className='flex justify-center gap-6 mt-12 mb-6 items-center'>
                            <Button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className="bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-blue-600 shadow-sm"
                                variant="outline"
                            >
                                Previous
                            </Button>
                            <span className='text-gray-600 font-medium'>Page {currentPage} of {totalPages}</span>
                            <Button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className="bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-blue-600 shadow-sm"
                                variant="outline"
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Browse