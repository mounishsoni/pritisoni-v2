import Image from "next/image";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { classNames } from "primereact/utils";
import React, { forwardRef, useContext, useImperativeHandle, useRef } from "react";
import { LayoutContext } from "./context/layoutcontext";

const AppTopbar = forwardRef((props, ref) => {
  const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }));

  return (
    <div className="layout-topbar">
      {/* <Image
        aria-hidden
        src="/logo.svg"
        alt="Raftaar logo"
        width={100}
        height={100}
        className="mb-3"
      /> */}
      {/* <span className="text-2xl font-semibold uppercase">Priti Soni</span> */}

      <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
        <i className="pi pi-bars" />
      </button>

      <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
        <i className="pi pi-ellipsis-v" />
      </button>

      <div
        ref={topbarmenuRef}
        className={classNames("layout-topbar-menu", {
          "layout-topbar-menu-mobile-active": layoutState.profileSidebarVisible,
        })}
      >
        <button type="button" className="p-link layout-topbar-button">
          <i className="pi pi-heart"></i>
          <span>Favorite</span>
        </button>
        <button type="button" className="p-link layout-topbar-button">
          <i className="pi pi-bookmark"></i>
          <span>Playlist</span>
        </button>
        <button type="button" className="p-link layout-topbar-button">
          <i className="pi pi-clock"></i>
          <span>Watch Later</span>
        </button>
        {/* <Link href="/documentation">
          <button type="button" className="p-link layout-topbar-button">
            <i className="pi pi-cog"></i>
            <span>Settings</span>
          </button>
        </Link> */}
      </div>
    </div>
  );
});

export default AppTopbar;
