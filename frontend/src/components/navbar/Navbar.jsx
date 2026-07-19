import { useState } from "react";
import { Search, Menu } from "lucide-react";

import Logo from "./Logo";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b  bg-black/40 backdrop-blur-md">
      <nav className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <DesktopMenu />

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search Button */}
          <button
            className="rounded-full p-2 text-white transition hover:bg-zinc-800 hover:text-orange-500"
            aria-label="Search"
          >
            <Search size={22} />
          </button>

          {/* Mobile Menu Button */}
          <button
            className="rounded-full p-2 text-white transition hover:bg-zinc-800 lg:hidden"
            onClick={() => setIsOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </header>
  );
}

export default Navbar;
