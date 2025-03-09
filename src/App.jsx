import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { Fragment, lazy, useEffect, Suspense } from "react";
import OrderItem from "./pages/OrderItem";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { useEvent } from "./store/event";
import CreateBanner from "./pages/CreateBanner";
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
  const {
    setProductsData,
    setCategoryData,
    setClientData,
    setIsLoading,
    setSpotsData,
  } = useEvent();

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
    const fetchData = async () => {
      try {
        const [posterClients, posterCategories, posterProducts, posterSpots] =
          await Promise.all([
            axios.get(`${import.meta.env.VITE_API}/posterClients`),
            axios.get(`${import.meta.env.VITE_API}/posterCategories`),
            axios.get(`${import.meta.env.VITE_API}/posterProducts`),
            axios.get(`${import.meta.env.VITE_API}/getSpot`),
          ]);
        setCategoryData(posterCategories?.data);
        setProductsData(posterProducts?.data);
        setClientData(posterClients?.data);
        setSpotsData(posterSpots?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
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
              path="create-banner"
              element={
                <PrivateRoute>
                  <CreateBanner />
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
