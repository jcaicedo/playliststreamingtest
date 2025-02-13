import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu, moveMenuSelection,setSelectedMenuIndex } from "../redux/store";
import { useEffect } from "react";

const menuItems = [
  { name: "Home", path: "/", icon: "fas fa-home" },
  { name: "Game of Thrones", path: "/series/1399", icon: "fas fa-tv" },
];

export default function Sidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { menuMinimized, selectedMenuIndex } = useSelector((state) => state.ui);

  //Update index when location changes

  useEffect(() => {

    const currentIndex = menuItems.findIndex((item)=> item.path === location.pathname)
    if(currentIndex !== -1){
      dispatch(setSelectedMenuIndex(currentIndex))
    }
  }, [location.pathname, dispatch]);

  // Keyboard navigation

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        dispatch(toggleMenu());
      }

      if (!menuMinimized) {
        if (e.key === "ArrowDown") {
          dispatch(moveMenuSelection((selectedMenuIndex + 1) % menuItems.length));
        } else if (e.key === "ArrowUp") {
          dispatch(moveMenuSelection((selectedMenuIndex - 1 + menuItems.length) % menuItems.length));
        } else if (e.key === "Enter") {
          navigate(menuItems[selectedMenuIndex].path);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuMinimized, selectedMenuIndex, dispatch, navigate]);

  return (
    <nav className={`sidebar ${menuMinimized ? "minimized" : ""}`}>
      <button className="menu-toggle" onClick={() => dispatch(toggleMenu())}>☰</button>
      {menuItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={`menu-item ${selectedMenuIndex === index ? "selected" : ""}`}
          onClick={() => dispatch(setSelectedMenuIndex(index))}
        >
          <i className={item.icon}></i>
          <span>{item.name}</span>
        </Link>
      ))}
    </nav>
  );
}
