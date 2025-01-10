import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Closing from './pages/Closing'
import Load from './pages/Load'
import LoadCompanies from './pages/Load/LoadCompanies'
import CompanyList from './pages/Companies'
import EmployeeList from './pages/Employee'
import EmployeeDetails from './pages/Employee/Details'
import VehicleList from './pages/Vehicle'
import VehicleMaintenance from './pages/Vehicle/Maintenance'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      {
        path: '/closing',
        element: <Closing />,
      },
      {
        path: '/load',
        element: <LoadCompanies />,
      },
      {
        path: '/load/:id',
        element: <Load />,
      },
      {
        path: '/companies',
        element: <CompanyList />,
      },
      {
        path: '/employee',
        element: <EmployeeList />,
      },
      {
        path: '/employee/:id',
        element: <EmployeeDetails />,
      },
      {
        path: '/vehicle-maintenance',
        element: <VehicleList />,
      },
      {
        path: '/vehicle-maintenance/:id',
        element: <VehicleMaintenance />,
      },
    ],
  },
])

function AppRoutes() {
  return <RouterProvider router={router} />
}

export default AppRoutes
