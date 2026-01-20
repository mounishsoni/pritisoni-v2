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

const playlist = () => {
  return (
    <>
      <h1>Playlist page</h1>
    </>
  );
};

export default playlist;
