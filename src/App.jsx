import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./infrastructure/layout/AppLayout";
import { routes } from "./infrastructure/routes/routes";
import NotFound from "./ui/Error";
import LoginPage from "./components/NavBar/Login";
import SignupPage from "./components/NavBar/SignUp"

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",               
    element: <SignupPage />,
  },
  {
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: routes,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
