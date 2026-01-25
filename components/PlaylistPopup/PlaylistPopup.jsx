import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog"; // Proper modal component
import { Ripple } from "primereact/ripple";
import { useSelector } from "react-redux";
import { supabase } from "../../config/supabaseClient";

export default function PlaylistPopup({ playlistPopupVisible, onClose, selectedVideoItem }) {
  const user = useSelector((state) => state.initialState.user);

  //   const [playlists, setPlaylists] = useState([
  //     { id: 1, name: "My Favorites", count: 34, selected: false },
  //     { id: 2, name: "Workout Mix", count: 12, selected: true },
  //     { id: 3, name: "Chill Vibes", count: 28, selected: false },
  //     { id: 4, name: "Road Trip Anthems", count: 15, selected: false },
  //   ]);

  const [playlists, setPlaylists] = useState([]);

  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  async function fetchPlaylistData() {
    // fetch playlist data
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
            selected: selectedVideoItem && Object.keys(selectedVideoItem).length > 0 ? data[i].collection_id.includes(selectedVideoItem.collection_id) : false,
          });
        }
        setPlaylists(prepPlaylists);
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
    if (playlistPopupVisible && user && user.id !== "") {
      fetchPlaylistData();
    }
  }, [playlistPopupVisible]);

  const togglePlaylist = (id) => {
    setPlaylists(playlists.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)));
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    const newEntry = { id: Date.now(), name: newName, count: 0, selected: true };
    setPlaylists([...playlists, newEntry]);
    setNewName("");
    setIsCreating(false);
  };

  // Footer template for the Dialog
  const renderFooter = () => {
    if (!isCreating) {
      return (
        <div className="flex justify-content-start border-top-1 surface-border pt-3">
          <Button label="Create new playlist" icon="pi pi-plus" className="p-button-sm font-bold" onClick={() => setIsCreating(true)} />
        </div>
      );
    }

    return (
      <div className="flex flex-column gap-3 border-top-1 surface-border pt-3 w-full">
        <div className="flex flex-column align-items-start gap-1">
          <label className="text-xs font-semibold text-600 uppercase">Playlist Name</label>
          <InputText autoFocus placeholder="Enter title..." className="w-full p-inputtext-sm" value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div className="flex align-items-center justify-content-between">
          <Button icon={isPublic ? "pi pi-globe" : "pi pi-lock"} label={isPublic ? "Public" : "Private"} className=" p-button-secondary p-button-sm h-auto" onClick={() => setIsPublic(!isPublic)} />
          <div className="flex gap-2">
            <Button label="Cancel" className="p-button-text p-button-secondary p-button-sm" onClick={() => setIsCreating(false)} />
            <Button label="Create" className="p-button-sm" onClick={handleCreate} disabled={!newName.trim()} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog
      header="Save to..."
      visible={playlistPopupVisible}
      style={{ width: "380px" }}
      onHide={onClose} // This is the built-in onClose trigger
      footer={renderFooter()}
      draggable={false}
      resizable={false}
      closable={true} // Shows the 'X' icon in the header
      dismissableMask={false} // Closes when clicking outside (the overlay)
      className="playlist-dialog"
    >
      <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            onClick={() => togglePlaylist(playlist.id)}
            className="p-ripple flex align-items-center justify-content-between p-3 mb-1 border-round-lg cursor-pointer transition-colors transition-duration-150 hover:surface-100"
          >
            <Ripple />
            <div className="flex align-items-center gap-3">
              <div className="w-3rem h-3rem surface-100 border-round flex align-items-center justify-content-center">
                <i className="pi pi-folder text-400 text-2xl"></i>
              </div>
              <div className="flex flex-column">
                <span className="font-semibold text-800">{playlist.name}</span>
                <span className="text-xs text-500">{playlist.count} videos</span>
              </div>
            </div>
            <Checkbox checked={playlist.selected} readOnly />
          </div>
        ))}
      </div>
    </Dialog>
  );
}
