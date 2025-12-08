import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

// const skills = ["Html", "Css", "Javascript", "Reactjs"]
const isResume = true;

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const isRecruiter = user?.role === 'recruiter';

    return (
        <div className="bg-[#F5F8FF] min-h-screen">
            <Navbar />
            <div className='max-w-4xl mx-auto py-8 px-4'>
                <div className='bg-white border border-gray-100 rounded-2xl shadow-lg p-8 mb-8'>
                    <div className='flex justify-between items-start'>
                        <div className='flex items-center gap-6'>
                            <Avatar className="h-24 w-24 ring-4 ring-blue-50 cursor-pointer hover:scale-105 transition-transform">
                                <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                            </Avatar>
                            <div>
                                <h1 className='font-bold text-2xl text-gray-900'>{user?.fullname}</h1>
                                <p className="text-gray-600 mt-1 max-w-md">{user?.profile?.bio}</p>
                            </div>
                        </div>
                        <Button onClick={() => setOpen(true)} className="text-right border-gray-200 hover:bg-gray-50 rounded-lg" variant="outline"><Pen className="h-4 w-4 mr-2" /> Edit Profile</Button>
                    </div>

                    <div className='my-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                            <Mail className="h-5 w-5 text-gray-500" />
                            <span className="text-gray-700 font-medium">{user?.email}</span>
                        </div>
                        <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                            <Contact className="h-5 w-5 text-gray-500" />
                            <span className="text-gray-700 font-medium">{user?.phoneNumber}</span>
                        </div>
                    </div>

                    {!isRecruiter && (
                        <>
                            <div className='my-6'>
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills</h2>
                                <div className='flex flex-wrap items-center gap-2'>
                                    {
                                        user?.profile?.skills.length !== 0 ? user?.profile?.skills.map((item, index) => (
                                            <Badge key={index} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm font-normal rounded-full">
                                                {item}
                                            </Badge>
                                        )) : <span className="text-gray-500 italic">No skills added yet</span>
                                    }
                                </div>
                            </div>

                            <div className='grid w-full max-w-sm items-center gap-1.5'>
                                <Label className="text-md font-bold text-gray-900">Resume</Label>
                                {
                                    isResume ? (
                                        <a target='blank' href={user?.profile?.resume} className='text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors w-fit font-medium flex items-center gap-2'>
                                            {user?.profile?.resumeOriginalName}
                                        </a>
                                    ) : <span className="text-gray-500">NA</span>
                                }
                            </div>
                        </>
                    )}
                </div>

                {!isRecruiter && (
                    <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8'>
                        <h2 className='font-bold text-xl text-gray-900 mb-5'>Applied Jobs</h2>
                        <AppliedJobTable />
                    </div>
                )}
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile