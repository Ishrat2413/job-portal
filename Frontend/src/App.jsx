import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Login from './components/authentication/Login'
import Home from './components/components_lite/Home'
import Register from './components/authentication/Register'

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
])

function App() {
  return (
    <>
      <RouterProvider router={appRouter}></RouterProvider>
    </>
  )
}

export default App
