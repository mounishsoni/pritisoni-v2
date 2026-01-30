import React, { useContext, useEffect, useState } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import Link from "next/link";
import { useSelector } from "react-redux";
import { supabase } from "../config/supabaseClient";
// import Image from "next/image";

const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);
  const user = useSelector((state) => state.initialState.user);
  const [fetchedMenuItems, setFetchedMenuItems] = useState([]);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  async function fetchMenuItems() {
    try {
      const { data, error } = await supabase.from("category").select("*").order("title", { ascending: true });

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        const sortedMenuItems = data.reduce((acc, cv) => {
          const var1 = acc.findIndex((item) => item.label == cv.label);
          if (var1 !== -1) {
            acc[var1].items.push(cv);
          } else {
            acc.push({ label: cv.label, items: [cv] });
          }

          return acc;
        }, []);

        // add default menu items
        sortedMenuItems.push({
          label: "Utilities",
          items: [
            {
              title: "Dashboard",
              icon: "pi pi-home",
              to: "/dashboard",
              // visible: false,
            },
            {
              title: "Mantra Counter",
              icon: "pi pi-plus-circle",
              to: "/mantra-counter",
              visible: ["SUPER_ADMIN"].includes(user.role) ? true : false,
            },
            {
              title: "Admin Panel",
              icon: "pi pi-shield",
              to: "/admin",
            },
            {
              title: "Logout",
              icon: "pi pi-fw pi-sign-out",
              to: "/logout",
            },
          ],
        });

        setFetchedMenuItems(sortedMenuItems);
      }
    } catch (err) {}
  }

  //   const model = [
  //     {
  //       label: Object.keys(fetchedMenuItems)[0],
  //       items: [
  //         {
  //           label:
  //             Object.values(fetchedMenuItems).length > 0
  //               ? Object.values(fetchedMenuItems)[0][0].title
  //               : "",
  //           icon: "pi pi-fw pi-home",
  //           to: "/shivYog",
  //           // visible: user.role === "SUPER_ADMIN" ? true : false,
  //         },
  //       ],
  //     },
  //     {
  //       label: Object.keys(fetchedMenuItems)[1],
  //       items: [
  //         {
  //           label:
  //             Object.values(fetchedMenuItems).length > 0
  //               ? Object.values(fetchedMenuItems)[1][0].title
  //               : "",
  //           icon: "pi pi-fw pi-home",
  //           to: "/shivYog",
  //           // visible: user.role === "SUPER_ADMIN" ? true : false,
  //         },
  //         {
  //           label:
  //             Object.values(fetchedMenuItems).length > 0
  //               ? Object.values(fetchedMenuItems)[1][1].title
  //               : "",
  //           icon: "pi pi-fw pi-users",
  //           to: "/maa",
  //         },
  //         {
  //           label:
  //             Object.values(fetchedMenuItems).length > 0
  //               ? Object.values(fetchedMenuItems)[1][2].title
  //               : "",
  //           icon: "pi pi-fw pi-map-marker",
  //           to: "/saundaryLehri",
  //         },
  //         {
  //           label:
  //             Object.values(fetchedMenuItems).length > 0
  //               ? Object.values(fetchedMenuItems)[1][3].title
  //               : "",
  //           icon: "pi pi-fw pi-map-marker",
  //           to: "/saundaryLehri",
  //         },
  //         {
  //           label:
  //             Object.values(fetchedMenuItems).length > 0
  //               ? Object.values(fetchedMenuItems)[1][4].title
  //               : "",
  //           icon: "pi pi-fw pi-map-marker",
  //           to: "/saundaryLehri",
  //         },
  //       ],
  //     },
  //     {
  //       label: "Utilities",
  //       items: [
  //         {
  //           label: "Logout",
  //           icon: "pi pi-fw pi-sign-out",
  //           to: "/logout",
  //         },
  //       ],
  //     },
  //   ];

  //   const model = [];
  //   Object.keys(fetchedMenuItems).length !== 0 ? .forEach((item, index) => {
  //     model.push({
  //       label: item.key,
  //       items: [
  //         {
  //           label: item.title,
  //           icon: "pi pi-fw pi-home",
  //           to: "/shivYog",
  //           // visible: user.role === "SUPER_ADMIN" ? true : false,
  //         },
  //         { label: "Maa", icon: "pi pi-fw pi-users", to: "/maa" },
  //         {
  //           label: "Saundary Lehri",
  //           icon: "pi pi-fw pi-map-marker",
  //           to: "/saundaryLehri",
  //         },
  //       ],
  //     });
  //     // if (index === 0) {
  //     //     monthsData.push(monthNames[d.getMonth() - 1]);
  //     // }
  //   });

  return (
    <MenuProvider>
      {/* <Image
        aria-hidden
        src="/logo.svg"
        alt="Raftaar logo"
        style={{ width: "100%" }}
        width={100}
        height={100}
        className="mb-3"
      /> */}
      <ul className="layout-menu">
        {fetchedMenuItems.map((item, i) => {
          return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
        })}
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;
