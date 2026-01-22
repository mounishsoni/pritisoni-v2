import { useRouter } from "next/router";
import Link from "next/link";
import { Ripple } from "primereact/ripple";
import { classNames } from "primereact/utils";
import React, { useEffect, useContext } from "react";
import { CSSTransition } from "react-transition-group";
import { MenuContext } from "./context/menucontext";
import { useSelector } from "react-redux";

const AppMenuitem = (props) => {
  const { activeMenu, setActiveMenu } = useContext(MenuContext);
  const router = useRouter();
  const item = props.item;
  const key = props.parentKey ? props.parentKey + "-" + props.index : String(props.index);
  const isActiveRoute = item.to && router.pathname === item.to;
  const active = activeMenu === key || activeMenu.startsWith(key + "-");
  const user = useSelector((state) => state.initialState.user);

  useEffect(() => {
    if (item.to && router.pathname === item.to) {
      setActiveMenu(key);
    }

    const onRouteChange = (url) => {
      if (item.to && item.to === url) {
        setActiveMenu(key);
      }
    };

    router.events.on("routeChangeComplete", onRouteChange);

    return () => {
      router.events.off("routeChangeComplete", onRouteChange);
    };
  }, []);

  const itemClick = (event) => {
    //avoid processing disabled items
    // if (item.disabled) {
    //   event.preventDefault();
    //   return;
    // }

    //execute command
    // if (item.command) {
    //   item.command({ originalEvent: event, item: item });
    // }

    // toggle active state
    // if (item.items) setActiveMenu(active ? props.parentKey : key);
    // else setActiveMenu(key);

    router.push(event);
  };

  const subMenu = item.items && item.visible !== false && (
    <CSSTransition timeout={{ enter: 1000, exit: 450 }} classNames="layout-submenu" in={props.root ? true : active} key={item.title}>
      <ul>
        {item.items.map((child, i) => {
          return <AppMenuitem item={child} index={i} className={child.badgeClass} parentKey={key} key={child.title} />;
        })}
      </ul>
    </CSSTransition>
  );

  return (
    <li className={classNames({ "layout-root-menuitem": props.root, "active-menuitem": active })}>
      {props.root && item.visible !== false && <div className="layout-menuitem-root-text">{item.label}</div>}
      {/* {(!item.to || item.items) && item.visible !== false ? (
                <a href={item.url} onClick={(e) => itemClick(e)} className={classNames(item.class, 'p-ripple no-underline')} target={item.target} tabIndex="0">
                    <i className={classNames('layout-menuitem-icon', item.icon)}></i>
                    <span className="layout-menuitem-text">{item.title}</span>
                    {item.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                    <Ripple />
                </a>
            ) : null} */}

      {!item.items && item.visible !== false ? (
        <Link
          //   href="/video?id=e63d812c-eb4d-4481-b8be-48e640b4a392"
          href="#"
          replace={item.replaceUrl}
          target={item.target}
          onClick={(e) => {
            if (!item.to) {
              router.push(`/${encodeURIComponent(item.label?.toLowerCase())}/${encodeURIComponent(item.category_id)}`);
            } else {
              router.push(item.to);
            }
          }}
          className={classNames(item.class, "p-ripple no-underline", { "active-route": isActiveRoute })}
          tabIndex={0}
        >
          <i className={classNames("layout-menuitem-icon", item.icon)}></i>
          <span className="layout-menuitem-text">{item.title}</span>
          {item.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
          <Ripple />
        </Link>
      ) : null}

      {subMenu}
    </li>
  );
};

export default AppMenuitem;
