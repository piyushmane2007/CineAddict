import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import navLinks from "./NavLinks";

function MobileMenu({ isOpen, setIsOpen }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed top-0 right-0 h-full w-72 bg-zinc-950 border-l border-zinc-800 z-50 lg:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-end p-5">
              <button onClick={() => setIsOpen(false)}>
                <X className="text-white" size={28} />
              </button>
            </div>

            <ul className="flex flex-col gap-2 px-6">
              {navLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                          isActive
                            ? "bg-orange-500 text-white"
                            : "text-zinc-300 hover:bg-zinc-800 hover:text-orange-400"
                        }`
                      }
                    >
                      <Icon size={20} />
                      {link.title}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;
