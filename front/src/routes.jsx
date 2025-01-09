import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Closing from './pages/Closing'
import Load from './pages/Load'
import Companies from './pages/Load/Companies'

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
        element: <Companies />,
      },
      {
        path: '/load/:id',
        element: <Load />,
      },
    ],
  },
])

function AppRoutes() {
  return <RouterProvider router={router} />
}

export default AppRoutes
