import { Outlet } from "react-router-dom";

import Background from "../../ui/Background";
import Navbar from "../navbar/Navbar";
import Footer from "../Footer/Footer";
import ScrollManager from "./ScrollManager";

/**
 * Shared shell for every route: Background, Navbar and Footer render here
 * exactly once, and the routed page fills `<Outlet/>` in between — no page
 * component duplicates any of the three.
 */
const Layout = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Background />
      <ScrollManager />

      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
