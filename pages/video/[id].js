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

const Video = () => {
  const [videoListData, setVideoListData] = useState([]);
  const [selectedVideoSrc, setSelectedVideoSrc] = useState("");
  const [collectionId, setcollectionId] = useState(null);
  const [playNextVideoListData, setPlayNextVideoListData] = useState([]);

  const router = useRouter();
  const toast = useRef(null);
  const menu = useRef(null);

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
    setSelectedVideoSrc("https://www.youtube.com/embed/" + video.videoId);
  }

  function addToPlayNextQueue(newItem) {
    // Check if an item with the same ID already exists
    const existingItem = playNextVideoListData.find((item) => item.videoId === newItem.videoId);

    // If no existing item was found, create a new array with the new item
    if (!existingItem) {
      setPlayNextVideoListData((prevItems) => [...prevItems, newItem]);
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
            <div className="flex align-items-center gap-3">
              {/* <i className="pi pi-plus"></i> */}
              <Button
                icon="pi pi-plus"
                text
                size="large"
                onClick={() => {
                  addToPlayNextQueue(videoList);
                }}
              />
              {/* <Button icon="pi pi-plus" className="p-button-rounded"></Button> */}
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

  return (
    <>
      <Toast ref={toast} appendTo={null} />

      <div className="flex flex-row gap-3 w-screen overflow-x-hidden px-3">
        <div className="w-6" style={{ overflow: "scroll", position: "sticky", top: "10px" }}>
          {selectedVideoSrc ? (
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
            </>
          ) : (
            <div className="text-xl font-medium flex align-items-center justify-content-center bg-black-alpha-90 text-white" style={{ minHeight: "40vh" }}>
              Please select a video to play...!
            </div>
          )}

          <div className="bg-black-alpha-90" style={{ minHeight: "40vh", maxHeight: "40vh", overflow: "scroll" }}>
            {playNextVideoListData.length > 0 ? (
              <OrderList dataKey="id" value={playNextVideoListData} onChange={(e) => setPlayNextVideoListData(e.value)} itemTemplate={itemTemplate}></OrderList>
            ) : (
              <div className="text-xl font-medium flex align-items-center justify-content-center  text-white" style={{ minHeight: "40vh" }}>
                Add videos to play next
              </div>
            )}
          </div>
        </div>
        <div className="w-6 bg-black-alpha-90" style={{ maxHeight: "80vh", overflow: "scroll", position: "sticky", top: "10px" }}>
          <DataView
            value={videoListData} // Required: The array of data to display
            itemTemplate={listItemTemplate} // Required: The function that renders each item
            header={header} // Optional: Header content (e.g., layout switch)
            // paginator={true} // Optional: Enable pagination
            // rows={4} // Optional: Number of items per page
          />
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
      </div>
    </>
  );
};

export default Video;
