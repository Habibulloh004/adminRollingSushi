import { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import { Logo } from "../assets";
import { authenticateUser } from "../utils";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({
    login: "",
    password: "",
  });

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      navigate(`/`);
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const role = authenticateUser(user.login, user.password);
    if (role) {
      localStorage.setItem("auth", JSON.stringify(role));
      navigate(`/`);
    } else {
      toast.error("Неправильный логин или пароль");
    }
  };

  return (
    <main className="flex justify-center items-center w-screen h-screen bg-primary">
      <div className="container flex flex-col gap-5">
        <img src={Logo} className="w-80 mx-auto" alt="" />
        <form
          className="flex flex-col items-center justify-center gap-5 w-3/12 mx-auto"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            id="branch"
            placeholder="Название филиала"
            className="border w-full peer focus:outline-none focus:ring-0 p-2 rounded-sm"
            onChange={(e) => {
              setUser((prev) => ({ ...prev, login: e.target.value }));
            }}
          />
          <article className="flex flex-col relative w-full">
            <input
              type={`${show ? "text" : "password"}`}
              placeholder="Пароль"
              id="password"
              className="border w-full peer focus:outline-none focus:ring-0 p-2 rounded-sm"
              onChange={(e) => {
                setUser((prev) => ({ ...prev, password: e.target.value }));
              }}
            />
            <span className="absolute w-full cursor-pointer">
              {show ? (
                <FaRegEye
                  onClick={() => setShow(false)}
                  className="w-5 absolute right-2 top-0 translate-y-3/4 "
                />
              ) : (
                <FaRegEyeSlash
                  onClick={() => setShow(true)}
                  className="w-5 absolute right-2 top-0 translate-y-3/4 "
                />
              )}
            </span>
          </article>
          <button
            onClick={handleSubmit}
            className="w-full bg-[#0a2b2389] text-white rounded-sm py-2"
          >
            Отправить
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;
