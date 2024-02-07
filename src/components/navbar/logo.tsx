import { TbClockUp } from "react-icons/tb";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to={"/"}>
      <div className="flex items-center gap-4 text-3xl">
        <TbClockUp className="hidden sm:block" />

        <p className="font-medium text-xl">Clock In</p>
      </div>
    </Link>
  );
}
