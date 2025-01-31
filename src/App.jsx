import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { Fragment, lazy, useEffect, Suspense } from "react";
import OrderItem from "./pages/OrderItem";
import { Toaster } from "react-hot-toast";
// import Login from "./pages/Login";
// import Orders from "./pages/Orders";

const Layout = lazy(() => import("./Layout"));
const Login = lazy(() => import("./pages/Login"));
const Orders = lazy(() => import("./pages/Orders"));
const Branches = lazy(() => import("./pages/Branches"));
const News = lazy(() => import("./pages/News"));
const CreateOrder = lazy(() => import("./pages/CreateOrder"));

// eslint-disable-next-line react/prop-types
function PrivateRoute({ children }) {
  const authUser = localStorage.getItem("auth");
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const authUser = localStorage.getItem("auth");
    const currentPath = window.location.pathname;

    if (authUser) {
      if (currentPath === "/login") {
        navigate(`/`);
      }
    } else {
      if (currentPath !== "/login") {
        navigate("/login");
      }
    }
  }, []);

  return (
    <Fragment>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route
              index
              element={
                <PrivateRoute>
                  <Orders />
                </PrivateRoute>
              }
            />
            <Route
              path=":id"
              element={
                <PrivateRoute>
                  <OrderItem />
                </PrivateRoute>
              }
            />
            <Route
              path="news"
              element={
                <PrivateRoute>
                  <News />
                </PrivateRoute>
              }
            />
            <Route
              path="create-order"
              element={
                <PrivateRoute>
                  <CreateOrder />
                </PrivateRoute>
              }
            />
            <Route
              path="branches"
              element={
                <PrivateRoute>
                  <Branches />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </Suspense>
      <Toaster position="top-center" reverseOrder={false} />
    </Fragment>
  );
}

export default App;
