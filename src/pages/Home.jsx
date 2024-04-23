import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/orders");
  }, []);
  return <div>Home</div>;
};

export default Home;
