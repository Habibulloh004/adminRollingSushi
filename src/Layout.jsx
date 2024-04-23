import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { Suspense } from "react";

const Layout = () => {
  return (
    <main className="w-full relative flex items-start">
      <div className="h-screen sticky top-0 left-0 w-2/12">
        <Sidebar />
      </div>
      <section className="section flex flex-col w-9/12 mx-auto mt-10 relative">
        <Suspense fallback={<p>Loading...</p>}>
          <Outlet />
        </Suspense>
      </section>
    </main>
  );
};

export default Layout;
