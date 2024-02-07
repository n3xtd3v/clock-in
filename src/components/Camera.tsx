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
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
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
    user: { username, id },
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

      function DataURIToBlob(dataURI: string) {
        const splitDataURI = dataURI.split(",");
        const byteString =
          splitDataURI[0].indexOf("base64") >= 0
            ? atob(splitDataURI[1])
            : decodeURI(splitDataURI[1]);
        const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

        const ia = new Uint8Array(byteString.length);

        for (let i = 0; i < byteString.length; i++)
          ia[i] = byteString.charCodeAt(i);

        return new Blob([ia], { type: mimeString });
      }

      const file = DataURIToBlob(imgBase64);

      const formData = new FormData();
      formData.append("photo", file, `${username}-image.jpg`);

      try {
        const res = await axios.post(
          "http://localhost:3000/api/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: access_token,
            },
          }
        );

        const { pathname } = res.data;

        const data = {
          username,
          timestampType,
          imageURL: pathname,
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

          toast("Success.", {
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
          username,
          timestampType,
          id,
        };

        const resTimestamp = await postDataAPI(
          "clock-in/timestamp",
          data,
          access_token
        );

        const { status, message } = resTimestamp.data;

        if (status === "ok") {
          toast("Success.", {
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
    <div className="relative w-[426px] h-[240px] sm:w-[640px] sm:h-[360px] md:w-[854px] md:h-[480px] lg:w-[1280px] lg:h-[720px] bg-background px-4">
      {isCaptureEnable && (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          mirrored={true}
        />
      )}

      <div
        className="absolute z-50 top-10 right-10 cursor-pointer text-4xl"
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

      <div className="absolute z-50 bottom-10 right-10 cursor-pointer text-4xl">
        {timestamps[0]?.timestampType === "in" ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <TbClockDown
                  className="animate-ping"
                  onClick={() => capture("out")}
                />
              </TooltipTrigger>
              <TooltipContent>Clock in</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <TbClockUp
                  className="animate-ping"
                  onClick={() => capture("in")}
                />
              </TooltipTrigger>
              <TooltipContent>Clock in</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
