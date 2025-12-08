import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className='text-center bg-gradient-to-br from-[#F5F8FF] to-white py-20'>
            <div className='flex flex-col gap-8 my-10 items-center justify-center max-w-5xl mx-auto'>
                <span className='px-6 py-2 rounded-full bg-white text-[#5188f8] font-bold border border-blue-100 shadow-sm'>No. 1 Job Search Website</span>
                <h1 className='text-6xl font-extrabold leading-tight'>Search, Apply & <br /> Get Your <span className='text-[#5188f8]'>Dream Jobs</span></h1>
                <p className='text-lg text-gray-500 max-w-2xl mx-auto'>Bridging the gap between your skills and your dream career. Find opportunities that match your passion.</p>
                <div className='flex w-[60%] shadow-lg border border-gray-200 pl-6 pr-2 py-2 rounded-full items-center gap-4 mx-auto bg-white hover:shadow-xl transition-shadow duration-300'>
                    <input
                        type="text"
                        placeholder='Find your dream jobs...'
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none border-none w-full text-lg text-gray-700'
                    />
                    <Button onClick={searchJobHandler} className="rounded-full bg-[#5188f8] hover:bg-[#3b6ccf] p-6">
                        <Search className='h-6 w-6 text-white' />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection