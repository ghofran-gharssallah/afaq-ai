import { motion, useReducedMotion } from "framer-motion";

import Logo from "./Logo";
import NavMenu from "./NavMenu";
import CTAButton from "./CTAButton";
import MobileMenu from "./MobileMenu";

import { D, EASE_OUT_EXPO, T } from "../../../constants/motion";

const Navbar = () => {
  const reduced = useReducedMotion();

  return (
    <motion.header
      className="fixed top-5 left-0 right-0 z-50"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: -130 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{
        duration: reduced ? 0.3 : D.navShell,
        delay: T.navShell,
        ease: EASE_OUT_EXPO,
      }}
    >
      <div className="flex justify-center px-6">
        <nav
          className="
            glass
            relative

            w-[1000px]
            max-w-[82vw]

            h-[80px]

            rounded-[24px]

            px-8

            shadow-[0_12px_45px_rgba(79,40,183,.14)]
          "
        >
          <div className="glow absolute inset-0 rounded-[24px]" />

          {/* Desktop */}
          <div
            className="
              hidden
              lg:grid

              h-full

              grid-cols-[300px_auto_380px]

              items-center
            "
          >
            {/* Left Menu */}
            <div className="flex justify-end pr-10">
              <NavMenu side="left" />
            </div>

            {/* Logo */}
            <div className="flex justify-center">
              <Logo />
            </div>

            {/* Right Menu */}
            <div className="flex items-center justify-start pl-10 gap-6">
              <NavMenu side="right" />

              <CTAButton />
            </div>
          </div>

          {/* Mobile */}
          <div className="flex h-full items-center justify-between px-4 lg:hidden">
            <MobileMenu />
          </div>
        </nav>
      </div>
    </motion.header>
  );
};

export default Navbar;