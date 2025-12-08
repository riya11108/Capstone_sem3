import { Job } from "../models/job.model.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Somethin is missing.",
                success: false
            })
        };
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}
// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        // Prevent caching
        res.header("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", "0");

        let query = {};
        const lowerKeyword = keyword.toLowerCase();

        // Check for Salary Filter
        if (lowerKeyword.includes("lpa") || lowerKeyword.includes("greater than")) {
            if (lowerKeyword === "1-10 lpa") {
                query.salary = { $gte: 1, $lt: 10 };
            } else if (lowerKeyword === "10-20 lpa") {
                query.salary = { $gte: 10, $lt: 20 };
            } else if (lowerKeyword === "20-30 lpa") {
                query.salary = { $gte: 20, $lt: 30 };
            } else if (lowerKeyword.includes("greater than 30")) {
                query.salary = { $gte: 30 };
            }
        } else if (keyword) {
            // Standard search
            query = {
                $or: [
                    { title: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
                    { location: { $regex: keyword, $options: "i" } }, // Added location search
                ]
            };
        }

        const sort = req.query.sort || "newest";
        let sortOption = { createdAt: -1 };
        if (sort === "newest") sortOption = { createdAt: -1 };
        else if (sort === "oldest") sortOption = { createdAt: 1 };
        else if (sort === "salary_high") sortOption = { salary: -1 };
        else if (sort === "salary_low") sortOption = { salary: 1 };

        const jobs = await Job.find(query)
            .populate({ path: "company" })
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        const totalJobs = await Job.countDocuments(query);
        const totalPages = Math.ceil(totalJobs / limit);

        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            totalJobs,
            totalPages,
            currentPage: page,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path: 'company',
            createdAt: -1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (requirements) updateData.requirements = requirements.split(",");
        if (salary) updateData.salary = Number(salary);
        if (location) updateData.location = location;
        if (jobType) updateData.jobType = jobType;
        if (experience) updateData.experienceLevel = experience;
        if (position) updateData.position = position;
        if (companyId) updateData.company = companyId;

        const job = await Job.findByIdAndUpdate(jobId, updateData, { new: true });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            })
        };

        return res.status(200).json({
            message: "Job updated successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findByIdAndDelete(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            })
        };

        return res.status(200).json({
            message: "Job deleted successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}
