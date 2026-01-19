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

const Video = () => {
  const [videoListData, setVideoListData] = useState([]);
  const [collectionId, setcollectionId] = useState(null);
  const [playNextVideoListData, setPlayNextVideoListData] = useState([]);

  const router = useRouter();
  const user = useSelector((state) => state.initialState.user);
  const dispatch = useDispatch();

  const toast = useRef(null);
  const menu = useRef(null);
  const menuRight = useRef(null);

  const playerRef = useRef(null);
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [selectedVideoDetails, setSelectedVideoDetails] = useState({});
  const [startSeconds, setStartSeconds] = useState(0);
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

  const opts = {
    height: "450px",
    width: "100%",
    playerVars: {
      autoplay: 0,
      start: startSeconds,
    },
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

  const items = (item) => [
    {
      // label: "Options",
      items: [
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

  async function fetchVideos() {
    // fetch video data
    try {
      if (collectionId) {
        const { data, error } = await supabase.from("playlist").select("*").eq("collection_id", collectionId).order("created_dttm", { ascending: false });
        if (error) {
          console.error("Error fetching data:", error);
        } else {
          setVideoListData(data);
        }
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

  useMemo(() => {
    if (router.query.id !== undefined) {
      setcollectionId(router.query.id);
    }
  }, [router.query]);

  useEffect(() => {
    fetchVideos();
  }, [collectionId]);

  function playSelectedVideo(video) {
    setSelectedVideoId(video.videoId);
    setSelectedVideoDetails(video);
  }

  function addToPlayNextQueue(newItem) {
    // Check if an item with the same ID already exists
    let newPlaylist = [...user?.playlist];
    const existingItem = newPlaylist.find((item) => item.videoId === newItem.videoId);

    // If no existing item was found, create a new array with the new item
    if (!existingItem) {
      // setPlayNextVideoListData((prevItems) => [...prevItems, newItem]);
      newPlaylist.push(newItem);
      dispatch(setUserData({ ...user, playlist: newPlaylist, currentIndex: user?.currentIndex ? user.currentIndex : 0 }));
    } else {
      // open toast
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "This video is already added in queue!",
      });
    }
  }

  function removeFromPlayNextQueue(idToRemove) {
    setPlayNextVideoListData((prevItems) => prevItems.filter((item) => item.videoId !== idToRemove.videoId));
  }

  const itemTemplate = (item) => {
    return (
      <div className="flex flex-wrap p-0 align-items-center gap-3">
        <img
          className="shadow-2 flex-shrink-0 border-round"
          width={64}
          src={`https://img.youtube.com/vi/${item.videoId}/default.jpg`}
          alt={item.title}
          onClick={() => {
            playSelectedVideo(item);
          }}
        />
        <div
          className="flex-1 flex flex-column gap-2 xl:mr-8"
          onClick={() => {
            playSelectedVideo(item);
          }}
        >
          <span className="font-bold">{item.title}</span>
          <div className="flex align-items-center gap-2">
            <span>{item.description}</span>
          </div>
        </div>
        <i
          className="pi pi-minus text-sm"
          onClick={() => {
            removeFromPlayNextQueue(item);
          }}
        ></i>
      </div>
    );
  };

  const listItemTemplate = (videoList, index) => {
    return (
      <div className="col-12" key={videoList.id}>
        <div className={classNames("flex flex-row align-items-start py-1 px-3 gap-4", { "border-top-1 surface-border": index !== 0 })}>
          <img
            className="w-7rem shadow-2 block mx-auto border-round"
            src={`https://img.youtube.com/vi/${videoList.videoId}/0.jpg`}
            alt={videoList.title}
            onClick={() => {
              playSelectedVideo(videoList);
            }}
          />
          <div className="flex flex-row justify-content-between align-items-start flex-1 gap-4">
            <div
              className="flex flex-column align-items-start gap-2"
              onClick={() => {
                playSelectedVideo(videoList);
              }}
            >
              <div className="text-xl font-bold text-900">{videoList.title}</div>
              {/* <Rating value={product.rating} readOnly cancel={false}></Rating> */}
              <div className="flex align-items-center gap-3">
                <span className="flex align-items-center gap-2">
                  {/* <i className="pi pi-tag"></i> */}
                  <span className="text-xs font-semibold">{videoList.description}</span>
                </span>
                {/* <Tag value={product.inventoryStatus} severity={getSeverity(product)}></Tag> */}
              </div>
            </div>
            {/* <div className="flex gap-2">
              <Button icon="pi pi-play" aria-label="Filter" />
              <Button icon="pi pi-bookmark" severity="secondary" aria-label="Bookmark" />
              <Button icon="pi pi-play" severity="success" aria-label="Search" />
              <Button icon="pi pi-plus" severity="info" aria-label="User" />
              <Button icon="pi pi-bell" severity="warning" aria-label="Notification" />
              <Button icon="pi pi-heart" severity="help" aria-label="Favorite" />
              <Button icon="pi pi-times" severity="danger" aria-label="Cancel" />
            </div> */}
            <div className="flex align-items-center gap-3">
              <Button
                icon="pi pi-plus"
                text
                size="large"
                onClick={() => {
                  addToPlayNextQueue(videoList);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Header content (optional, often used for layout options and sorting)
  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <div className="field col-12">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText placeholder="Search video" />
          </span>
        </div>
      </div>
    );
  };

  const header = renderHeader();

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
        {/* <div className="w-6" style={{ overflow: "scroll", position: "sticky", top: "10px" }}>
          {selectedVideoId ? (
            <>
              <iframe
                className="flex align-items-center justify-content-center shadow-4 w-full"
                style={{ minHeight: "40vh" }}
                // width=" 590"
                // height="300"
                src={selectedVideoSrc}
                frameborder="0"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen="allowfullscreen"
                mozallowfullscreen="mozallowfullscreen"
                msallowfullscreen="msallowfullscreen"
                oallowfullscreen="oallowfullscreen"
                webkitallowfullscreen="webkitallowfullscreen"
                onload='javascript:(function(o){o.style.height=o.contentWindow.document.body.scrollHeight+"px";}(this));'
              ></iframe>
              <YouTube videoId={selectedVideoId} opts={opts} onReady={onReady} onStateChange={onStateChange} style={{ minHeight: "40vh" }} />
            </>
          ) : (
            <div className="text-xl font-medium flex align-items-center justify-content-center bg-black-alpha-90 text-white" style={{ minHeight: "40vh" }}>
              Please select a video to play...!
            </div>
          )}

          <div className="bg-black-alpha-90" style={{ minHeight: "40vh", maxHeight: "40vh", overflow: "scroll" }}>
            {playNextVideoListData.length > 0 ? (
              <>
                <OrderList dataKey="id" value={playNextVideoListData} onChange={(e) => setPlayNextVideoListData(e.value)} itemTemplate={itemTemplate}></OrderList>
              </>
            ) : (
              <div className="text-xl font-medium flex align-items-center justify-content-center  text-white" style={{ minHeight: "40vh" }}>
                Add videos to play next
              </div>
            )}
          </div>
        </div> */}
        {/* <DataView
            value={videoListData} // Required: The array of data to display
            itemTemplate={listItemTemplate} // Required: The function that renders each item
            header={header} // Optional: Header content (e.g., layout switch)
          /> */}
        <div className="grid">
          {Array.from(videoListData).map((item) => (
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
                    <Menu model={items(item)} popup ref={menuRight} id="popup_menu_right" popupAlignment="right" />
                    <Button className="" icon="pi pi-ellipsis-v" onClick={(event) => menuRight.current.toggle(event)} aria-controls="popup_menu_right" aria-haspopup />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
        {/* <div className="grid w-full" style={{ overflow: "scroll" }}>
          {Array.from(videoListData).map((videoList) => (
            <div className="col-12">
              <div className="card mb-0 cursor-pointer custom-shadow-4-on-hover custom-shadow-1">
                <div className="flex justify-content-between">
                  <div
                    onClick={() => {
                      playSelectedVideo(videoList);
                    }}
                  >
                    <span
                      className="block font-medium text-lg mb-3 mr-3 surface-overlay overflow-hidden text-overflow-ellipsis white-space-nowrap tooltip-show-full-title"
                      data-pr-tooltip={videoList.title}
                      data-pr-position="right"
                      style={{ width: "200px" }}
                    >
                      {videoList.title}
                    </span>

                    <Tooltip target=".tooltip-show-full-title" mouseTrack mouseTrackLeft={10} />

                    <div className="font-medium">
                      <Chip className="text-sm" label={videoList.description} />
                    </div>
                  </div>
                  <i
                    className="pi pi-plus text-xl text-red-500 tooltip-show-full-title"
                    data-pr-tooltip="+ Add to queue"
                    data-pr-position="right"
                    data-pr-at="right+5 top"
                    data-pr-my="left center-2"
                    onClick={() => {
                      addToPlayNextQueue(videoList);
                    }}
                  />
                </div>
                <span className="text-green-500 font-medium">24 new </span>
            <span className="text-500">since last visit</span>
              </div>
            </div>
          ))}
        </div> */}
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

export default Video;
