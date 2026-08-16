import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";
import { NavLink } from "react-router-dom";

import { leftLinks, rightLinks } from "../../../constants/navigation";
import { D, EASE_OUT_EXPO, T } from "../../../constants/motion";

interface NavMenuProps {
  side: "left" | "right";
}

const NavMenu = ({ side }: NavMenuProps) => {
  const links = side === "left" ? leftLinks : rightLinks;
  const reduced = useReducedMotion();

  /**
   * The reference cascades links left-to-right across the whole bar, so the
   * right group continues the left group's index rather than restarting.
   */
  const indexOffset = side === "right" ? leftLinks.length : 0;

  return (
    <ul className={clsx("flex items-center", "gap-6 xl:gap-7")}>
      {links.map((link, index) => (
        <motion.li
          key={link.href}
          className="flex items-center"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{
            duration: reduced ? 0.3 : D.navItem,
            delay: reduced
              ? 0
              : T.navItems + (indexOffset + index) * T.navItemStagger,
            ease: EASE_OUT_EXPO,
          }}
        >
          <NavLink
            to={link.href}
            end={link.href === "/"}
            aria-label={link.label}
            className={({ isActive }) =>
              clsx(
                "nav-link whitespace-nowrap transition-all duration-300",
                isActive && "active"
              )
            }
          >
            {link.label}
          </NavLink>
        </motion.li>
      ))}
    </ul>
  );
};

export default NavMenu;
