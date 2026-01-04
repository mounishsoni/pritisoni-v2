import { InputText } from "primereact/inputtext";
import { Sidebar } from "primereact/sidebar";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import { Tooltip } from "primereact/tooltip";
import { OrderList } from "primereact/orderlist";

export default function VideoPlayerContent({ selectedVideoDetails, playNextVideoListData }) {
  const [visibleBottom, setVisibleBottom] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    if (selectedVideoDetails && Object.keys(selectedVideoDetails).length !== 0) {
      console.log("videoId", selectedVideoDetails.videoId);
      setIsPlayerReady(true);
    }
    console.log("videoId", selectedVideoDetails?.videoId);
    console.log("selectedVideoDetails", selectedVideoDetails);
  }, [selectedVideoDetails]);

  const customHeader = (
    <div className="">
      <span className="font-bold">Amy Elsner</span>
    </div>
  );

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
                <div class="col-5 border-1">
                  <div class="p-3 border-round-sm">
                    <YouTube videoId={selectedVideoDetails.videoId} />
                  </div>
                </div>
                <div class="col-7 border-1">
                  <div class="text-center p-3 border-round-sm bg-primary font-bold ">
                    {playNextVideoListData && playNextVideoListData.length > 0 ? (
                      <>
                        <OrderList dataKey="id" value={playNextVideoListData} itemTemplate={itemTemplate}></OrderList>
                      </>
                    ) : (
                      <div className="text-xl font-medium flex align-items-center justify-content-center  text-white" style={{ minHeight: "40vh" }}>
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
