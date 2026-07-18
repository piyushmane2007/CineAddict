import { NavLink } from "react-router-dom";
import navLinks from "./NavLinks"

function DesktopMenu() {
  return (
    <ul className="hidden lg:flex items-center gap-8">
      {navLinks.map((link) => (
        <li key={link.path}>
          <NavLink
            to={link.path}
            className={({ isActive }) =>
              `transition-colors duration-300 font-medium ${
                isActive
                  ? "text-orange-500"
                  : "text-white hover:text-orange-400"
              }`
            }
          >
            {link.title}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default DesktopMenu;
