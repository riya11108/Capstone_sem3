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
    const [sort, setSort] = useState("newest");

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}&page=${currentPage}&limit=6&sort=${sort}`, { withCredentials: true });
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
    }, [searchedQuery, currentPage, sort]);

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
        <div className="bg-[#F5F8FF] min-h-screen">
            <Navbar />
            <div className='max-w-7xl mx-auto py-8'>
                <div className='flex gap-5'>
                    <div className='w-[20%]'>
                        {/* Sticky Sidebar */}
                        <div className="sticky top-20 bg-white shadow-sm rounded-lg p-4 border border-blue-50">
                            <FilterCard />
                        </div>
                    </div>
                    {
                        loading ? (
                            <div className="flex-1 flex justify-center items-center h-[50vh]">
                                <span className="text-gray-500 font-medium">Loading jobs...</span>
                            </div>
                        ) : jobs.length <= 0 ? (
                            <div className="flex-1 flex justify-center items-center h-[50vh]">
                                <span className="text-gray-500 font-medium text-lg">No Jobs Found</span>
                            </div>
                        ) : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5 custom-scrollbar'>
                                <div className='flex justify-between items-center mb-6'>
                                    <h2 className="text-2xl font-bold text-gray-800">Job Listings</h2>
                                    <div className="relative">
                                        <select
                                            value={sort}
                                            onChange={(e) => setSort(e.target.value)}
                                            className='appearance-none bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500 cursor-pointer shadow-sm font-medium transition-colors'
                                        >
                                            <option value="newest">Newest</option>
                                            <option value="oldest">Oldest</option>
                                            <option value="salary_high">Salary: High to Low</option>
                                            <option value="salary_low">Salary: Low to High</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                    {
                                        jobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className='flex justify-center gap-6 mt-10 mb-6 items-center'>
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
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Jobs