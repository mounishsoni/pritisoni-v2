import Image from "next/image";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { classNames } from "primereact/utils";
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState } from "react";
import { LayoutContext } from "./context/layoutcontext";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import YouTube from "react-youtube";
import VideoPlayerContent from "../components/videoPlayer/VideoPlayerContent";

const AppVideoPlayerFooterBar = () => {
  return <>{/* <VideoPlayerContent /> */}</>;
};

export default AppVideoPlayerFooterBar;
