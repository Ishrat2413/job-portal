import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Login from './components/authentication/Login'
import Home from './components/components_lite/Home'
import Register from './components/authentication/Register'
import Profile from './components/components_lite/Profile'
import JobDetails from './components/components_lite/JobDetails'
import EmployerJobs from './components/employerComponents/EmployerJobs'
import PostJob from './components/employerComponents/PostJob'
import Applicants from './components/employerComponents/Applicants'
import AdminDashboard from './components/admin/AdminDashboard'
import PendingEmployers from './components/admin/PendingEmployers'

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/description/:id",
    element: <JobDetails />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  // employer
  {
    path: "/employer/jobs",
    element: <EmployerJobs />
  },
  {
    path: "/employer/jobs/create",
    element: <PostJob />
  },
  {
    path: "/employer/jobs/:id/applicants",
    element: <Applicants />
  },
  // admin
  {
    path: "admin",
    element: <AdminDashboard />
  },
  {
    path: "admin/pending-employers",
    element: <PendingEmployers />
  },
])

function App() {
  return (
    <>
      <RouterProvider router={appRouter}></RouterProvider>
    </>
  )
}

export default App
