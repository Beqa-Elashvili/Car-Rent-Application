import { IoIosMenu } from "react-icons/io";
import { GiCarKey } from "react-icons/gi";
import { FaHandPeace } from "react-icons/fa";

export function Header() {
  return (
    <div className="absolute w-full text-white text-2xl z-10 top-2 flex justify-between px-2">
      <div className="flex items-center gap-2">
        <IoIosMenu className="text-3xl" />
        <p>Menu</p>
      </div>
      <div className="flex items-center gap-2">
        <GiCarKey className="te" />
        <p>Rental Cars</p>
      </div>
      <div>
        <h1 className="text-2xl flex items-center gap-2">
          Relax <FaHandPeace />
        </h1>
      </div>
    </div>
  );
}
