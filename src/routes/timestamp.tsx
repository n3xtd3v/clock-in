import { useEffect } from "react";
import { TableDemo } from "@/components/tableDemo";
import { useSelector, useDispatch } from "react-redux";
import { getDataAPI } from "@/lib/fetchData";
import { getTimestampsById } from "../../redux/timestamp/timestamp";

export default function Timestamp(): JSX.Element {
  const dispatch = useDispatch();

  const {
    access_token,
    user: { id },
  } = useSelector((state: any) => state.auth);

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
    <div>
      <TableDemo />
    </div>
  );
}
