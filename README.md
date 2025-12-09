# JobNest – Smart Job Portal System

## 1. Project Title
**JobNest** — A Modern Job Hunting and Recruitment Platform

## 2. Problem Statement
Students and fresh graduates often struggle to find relevant job opportunities due to scattered and unorganized job postings across multiple platforms. Meanwhile, employers face difficulty reaching qualified candidates.

**JobNest** solves this by providing a centralized platform where:
- **Students** can search, apply, and track job applications.
- **Recruiters** can post jobs, manage applicants, and make hiring decisions.

---

## 3. System Architecture

### Architecture Flow:
- **Frontend**: React + Vite + Tailwind CSS  
- **Communication**: Axios  
- **Backend**: Node.js + Express.js  
- **Database**: MongoDB Atlas  

### Additional Services:
- **Authentication**: JWT role-based login (Student / Recruiter)  
- **Cloud Storage (optional future)**: Cloudinary for resumes  

### Deployment:
- **Frontend**: Vercel / Netlify  
- **Backend**: Render / Railway  
- **Database**: MongoDB Atlas  

---

## 4. Key Features

### Category | Features
- **Authentication & Authorization**:  
  Sign up/login for students and recruiters, JWT protected routes  

- **Student Dashboard**:  
  Search jobs, apply, track statuses (Applied/Accepted/Rejected)  

- **Recruiter Dashboard**:  
  Add company, post jobs, manage applicants, update application status  

- **CRUD Functionalities**:  
  Manage companies, jobs, user profiles, applications  

- **Routing**:  
  Home, Login, Signup, Dashboard, Job Details, Profile, Application Status  

- **Search, Filters & Sorting**:  
  Find jobs based on role, skills, location, latest postings  

- **Notifications (Optional)**:  
  Updates when application status changes  

- **Hosting**:  
  Fully deployed system with persistent cloud database  

---

## 5. Tech Stack

### Layer | Technologies
- **Frontend**: React.js, React Router, TailwindCSS, Axios  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB Atlas  
- **Authentication**: JWT Authentication  
- **AI (Future)**: Resume match or job suggestion feature  
- **Hosting**: Vercel/Netlify (Frontend), Render/Railway (Backend)  

---

## 6. API Overview

### Endpoint | Method | Description | Access
- **/api/auth/register** | POST | Register student or recruiter | Public  
- **/api/auth/login** | POST | Login and receive token | Public  
- **/api/jobs** | GET | Retrieve all job postings | Authenticated  
- **/api/jobs/:id** | GET | Retrieve single job details | Authenticated  
- **/api/jobs** | POST | Create new job posting | Recruiter Only  
- **/api/jobs/:id** | PUT | Update job posting | Recruiter Only  
- **/api/jobs/:id** | DELETE | Delete job posting | Recruiter Only  
- **/api/apply/:jobId** | POST | Apply to job | Student Only  
- **/api/applications/:id/status** | PUT | Accept/Reject applications | Recruiter Only  

---

## 7. Project Timeline (Optional)

### Phase | Work | Duration
- **Phase 1**: Research + UI Planning | 3–5 Days  
- **Phase 2**: Backend + Database + Auth | 1–2 Weeks  
- **Phase 3**: Frontend + Integrations | 1–2 Weeks  
- **Phase 4**: Testing + Deployment | 1 Week  
- **Phase 5**: Optional Enhancements (Search/UI/AI) | Continuous  

---

**End of Proposal — JobNest**