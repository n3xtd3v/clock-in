import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { RiCameraFill } from "react-icons/ri";
import { RiCameraOffFill } from "react-icons/ri";
import { TbClockUp } from "react-icons/tb";
import { TbClockDown } from "react-icons/tb";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector, useDispatch } from "react-redux";
import { postDataAPI } from "@/lib/fetchData";
import { updateTimestamp } from "../../redux/timestamp/timestamp";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

export default function webcam() {
  const {
    access_token,
    user: { id, displayName },
  } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const { timestamps } = useSelector((state: any) => state.timestamp);
  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(true);
  const webcamRef = useRef<Webcam>(null);
  const [devices, setDevices] = useState([]);

  const handleDevices = useCallback(
    (mediaDevices: any) =>
      setDevices(mediaDevices.filter(({ kind }: any) => kind === "videoinput")),
    [setDevices]
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  const capture = async (timestampType: string) => {
    if (!access_token) {
      return toast("Warning", {
        description: `Please sign in!`,
      });
    }

    if (devices.length === 1 && isCaptureEnable === true) {
      const imageSrc = webcamRef?.current?.getScreenshot();
      let imgBase64: any = imageSrc;

      try {
        const data = {
          displayName,
          timestampType,
          imageURL: imgBase64,
          id,
        };

        const resTimestamp = await postDataAPI(
          "clock-in/timestamp",
          data,
          access_token
        );

        const { status, message, timestamps } = resTimestamp.data;

        if (status === "ok") {
          dispatch(updateTimestamp(timestamps));

          toast("Success", {
            description: `${message}`,
          });
        }
      } catch (error) {
        toast("Error", {
          description: `Timestamp ${error.response.data.message}`,
        });
      }
    } else {
      try {
        const data = {
          displayName,
          timestampType,
          id,
        };

        const resTimestamp = await postDataAPI(
          "clock-in/timestamp",
          data,
          access_token
        );

        const { status, message, timestamps } = resTimestamp.data;

        if (status === "ok") {
          dispatch(updateTimestamp(timestamps));

          toast("Success", {
            description: `${message}`,
          });
        }
      } catch (error) {
        toast("Error", {
          description: `Timestamp ${error.response.data.message}`,
        });
      }
    }
  };

  return (
    <div className="flex justify-center p-20">
      <div className="relative w-[426px] h-[240px] sm:w-[854px] sm:h-[480px] bg-inherit space-y-5">
        {isCaptureEnable ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            mirrored={true}
          />
        ) : (
          <div className="relative w-[426px] h-[240px] sm:w-[854px] sm:h-[480px] bg-inherit space-y-5"></div>
        )}

        <div
          className="absolute z-40 top-1 right-10 cursor-pointer text-5xl sm:text-8xl"
          onClick={() => setCaptureEnable(!isCaptureEnable)}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {isCaptureEnable ? <RiCameraFill /> : <RiCameraOffFill />}
              </TooltipTrigger>
              <TooltipContent>
                {isCaptureEnable ? "Turn off the camera" : "Turn on the camera"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div
          className="absolute z-50 bottom-10 left-10 cursor-pointer text-3xl rounded-lg sm:text-9xl bg-green-500 p-2 sm:p-5 text-white"
          onClick={() => capture("in")}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <TbClockUp />
              </TooltipTrigger>
              <TooltipContent>Clock in</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div
          className="absolute z-50 bottom-10 right-10 cursor-pointer text-3xl rounded-lg sm:text-9xl bg-red-500 p-2 sm:p-5 text-white"
          onClick={() => capture("out")}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <TbClockDown />
              </TooltipTrigger>
              <TooltipContent>Clock out</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Display Name</TableHead>
              <TableHead>Timestamp Type</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Photo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timestamps.map((timestamp: any, index: number) => (
              <TableRow key={timestamp.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{timestamp.displayName}</TableCell>
                <TableCell>{timestamp.timestampType}</TableCell>
                <TableCell>
                  {timestamp.createdAt.slice(0, 10) +
                    " " +
                    timestamp.createdAt.slice(11, 19)}
                </TableCell>
                <TableCell>
                  {timestamp.imageURL ? (
                    <img src={timestamp.imageURL} width={200} alt="photo" />
                  ) : (
                    "No image"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
