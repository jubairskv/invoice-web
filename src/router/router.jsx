import { createBrowserRouter } from "react-router-dom";
import Login from "../components/login";
import Home from "../components/home";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

const appRouter = createBrowserRouter([
  {
    path: "/invoice-web",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/invoice-web/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
]);

export default appRouter;
