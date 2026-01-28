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
import { Divider } from "primereact/divider";

const playlist = () => {
  const router = useRouter();

  const toast = useRef(null);
  const [playlistData, setPlaylistData] = useState([]);
  const user = useSelector((state) => state.initialState.user);
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [selectedVideoDetails, setSelectedVideoDetails] = useState({});
  const menuRight = useRef(null);
  const [startSeconds, setStartSeconds] = useState(0);
  const playerRef = useRef(null);
  const [selectedVideoItem, setSelectedVideoItem] = useState([]);

  async function fetchPlaylist() {
    // fetch video data
    try {
      const { data, error } = await supabase.from("unique_playlist_view").select("*").eq("user_id", user.id);
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        const prepPlaylists = [];
        for (var i = 0; i < data.length; i++) {
          prepPlaylists.push({
            id: i + 1,
            name: data[i].folder_name,
            count: data[i].total_collection,
          });
        }
        setPlaylistData(prepPlaylists);
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
    if (user && user.id !== "") {
      fetchPlaylist();
    }
  }, [user]);

  return (
    <>
      <Toast ref={toast} appendTo={null} />

      <Card style={{ height: "calc(100vh - 9rem)", overflowX: "scroll" }}>
        <h5>Playlist</h5>
        <Divider />

        <div className="overflow-y-auto">
          {playlistData.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => router.push(`/playlist/${playlist.name}`)}
              className="p-ripple flex align-items-center justify-content-between p-3 mb-1 border-round-lg cursor-pointer transition-colors transition-duration-150 hover:surface-100"
            >
              <div className="flex align-items-center gap-3">
                <div className="w-3rem h-3rem surface-100 border-round flex align-items-center justify-content-center">
                  <i className="pi pi-folder text-400 text-2xl"></i>
                </div>
                <div className="flex flex-column">
                  <span className="font-semibold text-800">{playlist.name}</span>
                  <span className="text-xs text-500">{playlist.count} videos</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

export default playlist;
