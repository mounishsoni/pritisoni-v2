import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { supabase } from "../../config/supabaseClient";
import { Chip } from "primereact/chip";
import { Tooltip } from "primereact/tooltip";

const ReikiHealing = () => {
  const [videoListData, setVideoListData] = useState([]);
  const [selectedVideoSrc, setSelectedVideoSrc] = useState("");

  async function fetchVideos() {
    // fetch video data
    try {
      const { data, error } = await supabase
        .from("collection")
        .select("*")
        .eq("category_id", "53a0fc7a-50ef-4b4d-ac2a-a374dd859566")
        .order("created_dttm", { ascending: false });
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setVideoListData(data);
      }
    } catch (e) {
      // todo: add new error toast...
      //   toast.error(
      //     "System is unavailable.  Unable to fetch Client Data.  Please try again later or contact tech support!",
      //     {
      //       position: "bottom-right",
      //       autoClose: false,
      //       hideProgressBar: false,
      //       closeOnClick: true,
      //       pauseOnHover: true,
      //       draggable: true,
      //       progress: undefined,
      //       theme: "colored",
      //     }
      //   );
    }
  }

  useEffect(() => {
    fetchVideos();
  }, []);

  async function playSelectedVideo(video) {
    console.log(video.videoId);
    setSelectedVideoSrc("https://www.youtube.com/embed/" + video.videoId);
  }

  return (
    <>
      <div className="flex justify-content-center flex-wrap">
        {selectedVideoSrc ? (
          <iframe
            className="flex align-items-center justify-content-center mb-4 mt-2 border-round"
            width=" 590"
            height="300"
            src={selectedVideoSrc}
            frameborder="0"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen="allowfullscreen"
            mozallowfullscreen="mozallowfullscreen"
            msallowfullscreen="msallowfullscreen"
            oallowfullscreen="oallowfullscreen"
            webkitallowfullscreen="webkitallowfullscreen"
          ></iframe>
        ) : (
          <div
            className="text-2xl font-medium flex align-items-center justify-content-center mb-4 mt-2 border-round bg-black-alpha-90 text-white shadow-5"
            style={{ width: "590px", height: "300px" }}
          >
            Please select a video to play...!
          </div>
        )}
      </div>
      <div className="grid">
        {Array.from(videoListData).map((videoList) => (
          <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span
                    className="block font-medium text-xl mb-3 surface-overlay overflow-hidden text-overflow-ellipsis white-space-nowrap tooltip-show-full-title"
                    data-pr-tooltip={videoList.title}
                    data-pr-position="right"
                    style={{ width: "200px" }}
                  >
                    {videoList.title}
                  </span>

                  <Tooltip
                    target=".tooltip-show-full-title"
                    mouseTrack
                    mouseTrackLeft={10}
                  />

                  <div className="font-medium">
                    <Chip className="text-sm" label="PDF in Gujarati Version" />
                  </div>
                </div>
                <Button
                  className="pi pi-play"
                  tooltip="Play"
                  tooltipOptions={{ position: "top" }}
                  onClick={() => {
                    playSelectedVideo(videoList);
                  }}
                  style={{ width: "1rem", height: "2.5rem" }}
                />
              </div>
              {/* <span className="text-green-500 font-medium">24 new </span>
            <span className="text-500">since last visit</span> */}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ReikiHealing;
