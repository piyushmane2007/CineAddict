import { Clapperboard } from "lucide-react";
import { Link } from "react-router-dom";
const Logo = () => {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 text-orange-500 font-bold text-2xl transition hover:scale-105"
    >
      <Clapperboard size={25} />
      <span>CINEADDICT</span>
    </Link>
  );
};

export default Logo;
