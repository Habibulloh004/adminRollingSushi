import { Route, Routes } from "react-router-dom";
import { Fragment, lazy } from "react";
import OrderItem from "./pages/OrderItem";
// import io from "socket.io-client";
import { Toaster } from "react-hot-toast";
const Orders = lazy(() => import("./pages/Orders"));
const Layout = lazy(() => import("./Layout"));
const Branches = lazy(() => import("./pages/Branches"));

function App() {
  // const [users, setUsers] = useState([]);
  // useEffect(() => {
  //   const socket = io("https://vm4983125.25ssd.had.wf:5000"); // Replace with your server URL

  //   socket.on("connect", () => {
  //     console.log("Socket connected");
  //   });

  //   socket.on("onlineUsers", (data) => {
  //     console.log(data);
  //     setUsers(data);
  //   });
    
  //   socket.on("disconnect", () => {
  //     console.log("Socket disconnected");
  //   });

  //   // return () => {
  //   //   socket.disconnect();
  //   // };
  // }, []);

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
