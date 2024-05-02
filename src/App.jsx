import { Route, Routes } from "react-router-dom";
import { Fragment, lazy } from "react";
import OrderItem from "./pages/OrderItem";
// import io from "socket.io-client";
import { Toaster } from "react-hot-toast";
const Orders = lazy(() => import("./pages/Orders"));
const Layout = lazy(() => import("./Layout"));
const Branches = lazy(() => import("./pages/Branches"));


function App() {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Orders />} />
          <Route path=":id" element={<OrderItem />} />
          <Route path="branches" element={<Branches />} />
        </Route>
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </Fragment>
  );
}

export default App;
