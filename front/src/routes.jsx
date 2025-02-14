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
import Login from './pages/Login'
import UserProfile from './pages/UserProfile'
import TripList from './pages/Vehicle/Trip'
import Months from './pages/Closing/Month'
import TripExpenses from './pages/Vehicle/TripExpenses'
import { UserProvider } from './context/userContext'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/closing', element: <Closing /> },
      { path: '/closing-month', element: <Months /> },
      { path: '/load', element: <LoadCompanies /> },
      { path: '/load/:id', element: <Load /> },
      { path: '/companies', element: <CompanyList /> },
      { path: '/employee', element: <EmployeeList /> },
      { path: '/employee/:id', element: <EmployeeDetails /> },
      { path: '/vehicle-maintenance', element: <VehicleList /> },
      { path: '/vehicle-maintenance/:id', element: <VehicleMaintenance /> },
      { path: '/login', element: <Login /> },
      { path: '/user-profile', element: <UserProfile /> },
      { path: '/vehicle/trip', element: <TripList /> },
      { path: '/vehicle/trip-expenses/:id', element: <TripExpenses /> },
    ],
  },
])

export default function AppRoutes() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  )
}
