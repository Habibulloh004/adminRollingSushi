import { NavLink } from "react-router-dom";
import { Logo } from "../assets";
import { sideBarItems } from "../utils";

const Sidebar = () => {
  function getDate() {
    const today = new Date();
    const month =
      today.getMonth() + 1 < 10
        ? `0${today.getMonth() + 1}`
        : today.getMonth() + 1;
    console.log(today.getMonth());
    const day = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
    const year = today.getFullYear();
    return `${day}.${month}.${year}`;
  }

  function getDateTime() {
    const today = new Date();
    const hour =
      today.getHours() < 10 ? "0" + today.getHours() : today.getHours();
    const minute =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();

    return `${hour}:${minute}`;
  }

  return (
    <aside className="w-full h-full bg-primary shadow-sidebar flex flex-col justify-between">
      <div className="container mx-auto w-10/12 pt-8">
        <article className="img-container cursor-pointer">
          <img src={Logo} alt="" />
        </article>
        <ul className="flex flex-col w-10/12 mx-auto gap-8 mt-6">
          {sideBarItems.map((item) => (
            <li key={item.id}>
              <NavLink
                style={({ isActive }) => {
                  return {
                    fontWeight: isActive ? 700 : 400,
                  };
                }}
                to={`${item.path}`}
                className="flex items-center gap-4 w-8"
              >
                <img src={item.icon} alt="" />
                <p className="text-white">{item.title}</p>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="font-medium flex items-end gap-4 text-secondary pb-8 w-10/12 mx-auto">
        <p className="text-right text-4xl">{getDateTime()}</p>
        <p className="text-right text-xl">{getDate()}</p>
      </div>
    </aside>
  );
};

export default Sidebar;
