import { Outlet } from "react-router-dom";
import Navbar from "../../components/NavBar/NavBar";

function AppLayout() {
  return (
    <>
      <div>
        <Navbar />
        <main className="pt-[64px]">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default AppLayout;
