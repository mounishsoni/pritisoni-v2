import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { supabase } from "../../config/supabaseClient";
import { Chip } from "primereact/chip";
import { Tooltip } from "primereact/tooltip";
import { useRouter } from "next/router";
import { OrderList } from "primereact/orderlist";
import { Toast } from "primereact/toast";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import YouTube from "react-youtube";
import VideoPlayerContent from "../../components/videoPlayer/VideoPlayerContent";
import { useDispatch, useSelector } from "react-redux";
import { setPlayListData, setUserData } from "../../features/slice/initialStatesSlice";
import { SplitButton } from "primereact/splitbutton";
import { Menu } from "primereact/menu";
import { Divider } from 'primereact/divider';

const playlist = () => {
  const toast = useRef(null);
  const [playlistData, setPlaylistData] = useState([]);
  const user = useSelector((state) => state.initialState.user);
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [selectedVideoDetails, setSelectedVideoDetails] = useState({});
  const menuRight = useRef(null);
  const [startSeconds, setStartSeconds] = useState(0);
  const playerRef = useRef(null);
  const [selectedVideoItem, setSelectedVideoItem] = useState([]);

  const onReady = (event) => {
    playerRef.current = event.target;

    // 1. Check if we have a saved time for this video
    const savedTime = localStorage.getItem(`yt-resume-${selectedVideoId}`);
    if (savedTime) {
      setStartSeconds(parseInt(savedTime));
      // event.target.seekTo(parseInt(savedTime), true);
    } else {
      setStartSeconds(0);
    }
  };

  const onStateChange = (event) => {
    // 2. State '1' means the video is playing
    if (event.data === 1) {
      const saver = setInterval(() => {
        const currentTime = event.target.getCurrentTime();
        localStorage.setItem(`yt-resume-${selectedVideoId}`, currentTime);
      }, 1000); // Save every 3 seconds

      // Clear interval when video pauses or ends
      event.target.saverInterval = saver;
    } else {
      clearInterval(event.target.saverInterval);
    }
  };

  // YouTube Player Options
  const videoPlayerBarOpts = {
    height: "128",
    width: "250",
    playerVars: {
      autoplay: 0, // Auto-play when the ID changes
      start: startSeconds,
    },
  };

  const saveToPlaylist = (item) => {
    toast.current.show({ severity: "success", summary: "Success", detail: item.title });
  };

  const items = [
    {
      // label: "Options",
      items: [
        {
          label: "Remove from favorite",
          icon: "pi pi-heart",
          command: async () => {
            if (confirm("Are you sure you want to remove this video from favorite?")) {
              const { data, error } = await supabase
                .from("favorite")
                .update({
                  collection_id: selectedVideoItem.collection_id,
                  user_id: user.id,
                  is_favorite: false,
                  // updt_ver_num: 0, // TODO: future update
                  updated_dttm: new Date(),
                })
                .eq("favorite_id", selectedVideoItem.favorite_id);
              toast.current.show({ severity: "success", summary: "Success", detail: "Video removed from favorite" });
            }
          },
        },
        {
          label: "Add to queue",
          icon: "pi pi-plus-circle",
          command: () => {
            toast.current.show({ severity: "info", summary: "Info", detail: "Video added to queue" });
          },
        },
        {
          label: "Save to playlist",
          icon: "pi pi-bookmark",
          command: () => {
            saveToPlaylist(item);
          },
        },
        {
          label: "Save to Watch later",
          icon: "pi pi-clock",
          command: () => {
            toast.current.show({ severity: "info", summary: "Info", detail: "Video saved to watch later" });
          },
        },
        {
          label: "Share",
          icon: "pi pi-share-alt",
          command: () => {
            toast.current.show({ severity: "success", summary: "Success", detail: "Video has been Shared" });
          },
        },

        // {
        //   label: "Custom template",
        //   template: (item, options) => {
        //     return (
        //       <div className="p-menuitem-content" data-pc-section="content" onMouseMove={(e) => options.onMouseMove(e)}>
        //         <a href="#" className="p-menuitem-link">
        //           Lorem ipsum
        //         </a>
        //       </div>
        //     );
        //   },
        // },
      ],
    },
  ];

  async function fetchPlaylist() {
    console.log(user);
    // fetch video data
    try {
      const { data, error } = await supabase.from("playlist_view").select("*").eq("user_id", user.id);
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setPlaylistData(data);
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
    fetchPlaylist();
  }, []);

  function playSelectedVideo(video) {
    setSelectedVideoId(video.videoId);
    setSelectedVideoDetails(video);
  }

  const cardHeader = (item) => {
    return (
      <img
        className="w-full shadow-2 border-round"
        src={`https://img.youtube.com/vi/${item.videoId}/0.jpg`}
        alt={item.title}
        onClick={() => {
          playSelectedVideo(item);
        }}
      />
    );
  };

  return (
    <>
      <Toast ref={toast} appendTo={null} />

      <Card style={{ height: "calc(100vh - 17rem)", overflowX: "scroll" }}>
        <h5>Playlist</h5>
        <Divider />

        <div className="grid">
          {Array.from(playlistData).map((item) => (
            <div className="col-12 md:col-6 lg:col-3">
              <Card
                className="align-items-center justify-content-center bg-primary font-bold m-2"
                header={cardHeader(item)}
                // title={item.title}
                // subTitle={item.description}
                // style={{ width: "450px" }}
              >
                <div class="grid">
                  <div class="col-10 sm:col-10 md:col-8 lg:col-10">
                    <div className="text-lg text-overflow-ellipsis white-space-nowrap overflow-hidden tooltip-show-full-title-card" data-pr-tooltip={item.title}>
                      {item.title}
                    </div>
                    <Tooltip target=".tooltip-show-full-title-card" mouseTrack mouseTrackLeft={10} />
                    <div className="font-italic">{item.description}</div>
                  </div>
                  <div class="col-2 sm:col-1 md:col-1 lg:col-1">
                    <Menu model={items} popup ref={menuRight} id="popup_menu_right" popupAlignment="right" />
                    <Button
                      className=""
                      icon="pi pi-ellipsis-v"
                      onClick={(event) => {
                        setSelectedVideoItem(item);
                        menuRight.current.toggle(event);
                      }}
                      aria-controls="popup_menu_right"
                      aria-haspopup
                    />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Card>

      <div className="video-player-bar">
        {selectedVideoId && selectedVideoDetails ? (
          <div class="grid">
            <div class="col-2 sm:col-6 md:col-4 lg:col-3">
              <YouTube
                videoId={selectedVideoId}
                opts={videoPlayerBarOpts}
                onReady={onReady}
                onStateChange={onStateChange}
                // onEnd={playNext} // 4. Automatically play next when finished
              />
            </div>
            <div class="col-6 sm:col-6 md:col-8 lg:col-9">
              <div class="text-xl font-bold text-overflow-ellipsis white-space-nowrap overflow-hidden max-w-100rem tooltip-show-full-title" data-pr-tooltip={selectedVideoDetails.title}>
                {selectedVideoDetails.title}
              </div>
              <Tooltip target=".tooltip-show-full-title" mouseTrack mouseTrackLeft={10} />
              <div class="text-lg font-italic text-overflow-ellipsis white-space-nowrap overflow-hidden max-w-100rem">{selectedVideoDetails.description}</div>
            </div>
          </div>
        ) : (
          <div class="flex text-xl font-bold align-items-center ml-5 h-10rem">Select a video to play...!</div>
        )}
      </div>
    </>
  );
};

export default playlist;
