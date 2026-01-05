import { InputText } from "primereact/inputtext";
import { Sidebar } from "primereact/sidebar";
import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import { Tooltip } from "primereact/tooltip";
import { OrderList } from "primereact/orderlist";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { setUserData } from "../../features/slice/initialStatesSlice";

export default function VideoPlayerContent({ selectedVideoDetails, playNextVideoListData }) {
  const user = useSelector((state) => state.initialState.user);
  const dispatch = useDispatch();
  const playerRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const playNext = () => {
    if (currentIndex < user?.playlist.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // YouTube Player Options
  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1, // Auto-play when the ID changes
    },
  };

  const [visibleBottom, setVisibleBottom] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const onReady = (event) => {
    playerRef.current = event.target;

    // Finds the 3rd <li> inside the element with id "menu"
    const currentlyPlayingElement = document.querySelector(`#playlist-table div:nth-child(2) ul li:nth-child(${currentIndex + 1})`);
    if (currentlyPlayingElement) {
      currentlyPlayingElement.style.background = "red";
    }
    const resetElementCSS = document.querySelectorAll(`#playlist-table div:nth-child(2) ul li:not(:nth-child(${currentIndex + 1}))`);
    if (resetElementCSS) {
      resetElementCSS.forEach((el) => {
        el.style.background = "#6366F1";
      });
    }

    // 1. Check if we have a saved time for this video
    // const savedTime = localStorage.getItem(`yt-resume-${selectedVideoId}`);
    // if (savedTime) {
    //   setStartSeconds(parseInt(savedTime));
    //   // event.target.seekTo(parseInt(savedTime), true);
    // } else {
    //   setStartSeconds(0);
    // }
  };

  useEffect(() => {
    if (selectedVideoDetails && Object.keys(selectedVideoDetails).length !== 0) {
      setIsPlayerReady(true);
    }
  }, [selectedVideoDetails]);

  const customHeader = (
    <div className="">
      <span className="font-bold">Amy Elsner</span>
    </div>
  );

  function removeFromPlayNextQueue(removeSelectedItem) {
    let playlistCopy = [...user?.playlist];
    playlistCopy = playlistCopy.filter((item) => item !== removeSelectedItem);
    dispatch(setUserData({ ...user, playlist: playlistCopy }));
  }

  const itemTemplate = (item) => {
    return (
      <div className="flex flex-wrap p-0 align-items-center gap-3">
        <img
          className="shadow-2 flex-shrink-0 border-round"
          width={64}
          src={`https://img.youtube.com/vi/${item.videoId}/default.jpg`}
          alt={item.title}
          //   onClick={() => {
          //     playSelectedVideo(item);
          //   }}
        />
        <div
          className="flex-1 flex flex-column gap-2 xl:mr-8"
          //   onClick={() => {
          //     playSelectedVideo(item);
          //   }}
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

  function updatePlaylist(e) {
    console.log(e);
    dispatch(setUserData({ ...user, playlist: e.value }));
    console.log("newUserCopy", user);
  }

  return (
    <>
      <div className="layout-video-player-modal">
        {isPlayerReady ? (
          <>
            <div className="display-video-player">
              <div class="grid">
                <div class="col-1">
                  <div class="p-2">
                    <img
                      className="shadow-2 border-round"
                      src={`https://img.youtube.com/vi/${selectedVideoDetails.videoId}/default.jpg`}
                      alt=""
                      onClick={() => {
                        setVisibleBottom(true);
                      }}
                    />
                  </div>
                </div>
                <div class="col-6 text-white line-height-3 p-3">
                  <div
                    class="text-xl font-bold text-overflow-ellipsis white-space-nowrap overflow-hidden max-w-100rem tooltip-show-full-title"
                    data-pr-tooltip={selectedVideoDetails.title}
                    data-pr-position="top"
                  >
                    {selectedVideoDetails.title}
                  </div>
                  <Tooltip target=".tooltip-show-full-title" />
                  <div class="text-lg font-italic text-overflow-ellipsis white-space-nowrap overflow-hidden max-w-100rem">{selectedVideoDetails.description}</div>
                </div>
              </div>
            </div>

            <Sidebar visible={visibleBottom} position="bottom" header={customHeader} onHide={() => setVisibleBottom(false)}>
              <h2>Now playing...</h2>
              <div class="grid">
                <div class="col-5">
                  <div class="p-3 border-round-sm">
                    <YouTube
                      videoId={user?.playlist[currentIndex]?.videoId}
                      opts={opts}
                      onReady={onReady}
                      //   onStateChange={onStateChange}
                      onEnd={playNext} // 4. Automatically play next when finished
                    />
                  </div>
                  <span style={{ margin: "0 15px" }}>
                    Video {currentIndex + 1} of {user?.playlist.length}
                  </span>
                  <div className="controls" style={{ marginTop: "20px" }}>
                    <Button className="pi pi-step-backward" onClick={playPrevious} disabled={currentIndex === 0}></Button>
                    <Button className="pi pi-step-forward" onClick={playNext} disabled={currentIndex === user?.playlist.length - 1}></Button>
                  </div>
                </div>
                <div class="col-7">
                  <div class="border-round-sm bg-primary font-bold">
                    {user?.playlist && user?.playlist.length > 0 ? (
                      <>
                        <OrderList id="playlist-table" dataKey="id" value={user?.playlist} itemTemplate={itemTemplate} onChange={(e) => updatePlaylist(e)}></OrderList>
                      </>
                    ) : (
                      <div className="text-xl font-medium flex align-items-center justify-content-center text-white" style={{ minHeight: "40vh" }}>
                        Add videos to play next
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Sidebar>
          </>
        ) : (
          "Please select a video to play...!"
        )}
      </div>
    </>
  );
}
