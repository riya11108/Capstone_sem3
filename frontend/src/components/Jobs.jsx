import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import { Button } from './ui/button'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';

const Jobs = () => {
    const { searchedQuery } = useSelector(store => store.job);
    const [jobs, setJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}&page=${currentPage}&limit=6`, { withCredentials: true });
                if (res.data.success) {
                    setJobs(res.data.jobs);
                    setTotalPages(res.data.totalPages || 1);
                }
            } catch (error) {
                console.log(error);
                setJobs([]); // Clear jobs on error or empty
            } finally {
                setLoading(false);
            }
        }
        fetchJobs();
    }, [searchedQuery, currentPage]);

    // Reset to page 1 when query changes
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
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>
                    <div className='w-20%'>
                        <FilterCard />
                    </div>
                    {
                        loading ? <span>Loading...</span> : jobs.length <= 0 ? <span>Job not found</span> : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
                                    {
                                        jobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className='flex justify-center gap-4 mt-8 mb-4 items-center'>
                                        <Button
                                            onClick={prevPage}
                                            disabled={currentPage === 1}
                                            variant="outline"
                                        >
                                            Previous
                                        </Button>
                                        <span className='text-sm text-gray-600'>Page {currentPage} of {totalPages}</span>
                                        <Button
                                            onClick={nextPage}
                                            disabled={currentPage === totalPages}
                                            variant="outline"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Jobs