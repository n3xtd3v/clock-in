import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/navbar/Navbar";
import Camera from "@/components/Camera";
import { postDataAPI } from "@/lib/fetchData";
import { refreshToken } from "../../redux/auth/authSlice";
import { getDataAPI } from "@/lib/fetchData";
import { getTimestampsById } from "../../redux/timestamp/timestamp";

export default function Root(): JSX.Element {
  const {
    access_token,
    user: { id },
  } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  let { pathname } = useLocation();

  useEffect(() => {
    (async () => {
      const firstLogin = localStorage.getItem("firstLogin");

      if (firstLogin) {
        const res = await postDataAPI("auth/refresh_token", "", "");

        const {
          access_token,
          user: { username, no, ...rest },
        } = res.data;

        dispatch(
          refreshToken({ user: { username, no, ...rest }, access_token })
        );
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (id && access_token) {
        const res = await getDataAPI(`clock-in/timestamps/${id}`, access_token);

        const { timestamps } = res.data;

        dispatch(getTimestampsById(timestamps));
      }
    })();
  }, [id, access_token]);

  return (
    <>
      <Navbar />

      <main>{pathname === "/" ? <Camera /> : <Outlet />}</main>

      <Toaster />
    </>
  );
}
