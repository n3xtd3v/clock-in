import { Link, useNavigate } from "react-router-dom";
import Logo from "./logo";
import ThemeSwitcher from "./themeSwitcher";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { postDataAPI } from "@/lib/fetchData";
import { signOut } from "../../../redux/auth/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    access_token,
    user: { username },
  } = useSelector((state: any) => state.auth);

  const handleSignout = async () => {
    try {
      const res = await postDataAPI("auth/signout-ldap", "", "");

      const { message, status } = res.data;

      if (status === "ok") {
        toast("Success.", {
          description: `${message}`,
        });

        localStorage.removeItem("firstLogin");

        dispatch(signOut());

        navigate("/signin");
      }
    } catch (error) {
      toast("Error", {
        description: `${error.response.data.message}`,
      });
    }
  };

  return (
    <div className="fixed z-50 top-0 left-0 right-0 flex items-center justify-between py-4 px-4">
      <Logo />

      <div className="flex items-center gap-4">
        {access_token ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghostNoneFocus">{username}</Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleSignout}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/signin">
            <Button variant="ghostNoneFocus">Sign in</Button>
          </Link>
        )}

        <ThemeSwitcher />
      </div>
    </div>
  );
}
