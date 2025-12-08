import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { Button } from './ui/button';

// const randomJobs = [1, 2,45];

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
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10'>
                <h1 className='font-bold text-xl my-10'>Search Results ({totalJobs})</h1>
                <div className='grid grid-cols-3 gap-4'>
                    {
                        loading ? <span>Loading...</span> : jobs.length <= 0 ? <span>No Jobs Found</span> : jobs.map((job) => {
                            return (
                                <Job key={job._id} job={job} />
                            )
                        })
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
        </div>
    )
}

export default Browse