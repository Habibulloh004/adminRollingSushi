import { useEffect, useState } from "react";
import { useSocketContext } from "../context/SocketContext";
import axios from "axios";
import toast from "react-hot-toast";
import { formatPhoneNumber, formatPhoneNumber2 } from "../utils";
import { Link } from "react-router-dom";
import Switch from "../components/Switch/Switch";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [ordersPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const { socketMe } = useSocketContext();
  const [audio] = useState(new Audio("../notification.mp3")); // Preload audio
  const [hasUserInteraction, setHasUserInteraction] = useState(false);

  const tableHead = ["Номер телефона", "Адрес Доставки"];

  const fetchData = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACK}/get_all_orders`);
    setOrders(res?.data.filter((item) => item.status == ""));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleNewOrder = (data) => {
      toast.success("Новый заказ");
      audio.play();
      setOrders((prev) => [...prev, data]);
      console.log(data);
    };

    socketMe?.on("orderItem", handleNewOrder);

    return () => socketMe?.off("orderItem", handleNewOrder);
  }, [socketMe]);


  const setInteractionState = () => {
    if (!hasUserInteraction) {
      audio.play();
    }
    setHasUserInteraction((prev) => !prev);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);


  return (
    <main className="grow text-cText container w-3/4 flex flex-col mb-4">
      {/* <button onClick={() => audio.play()}>click</button> */}

      <div className="text-2xl font-bold p-4 shadow-shadowme px-9">
        Заказы{" "}
        <span className="float-right">
          <Switch
            hasUserInteraction={hasUserInteraction}
            setInteractionState={setInteractionState}
          />
        </span>
      </div>
      <section className="shadow-shadowme mt-3 px-4 grow flex flex-col justify-between items-center pb-5">
        {loading ? (
          <div className="h-[500px] flex items-center">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-10 h-10 text-gray-200 animate-spin dark:text-gray-400 fill-primary"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <table className="w-full text-center">
            <thead className="border-b-2">
              <tr>
                <th></th>
                {tableHead.map((item) => (
                  <th key={item} className="py-5">
                    {item}
                  </th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item, idx) => (
                <tr key={idx} className={`relative border-b-2`}>
                  <td className="p-5">{idx + 1}</td>
                  <td className="p-5">
                    {item.phone.length > 11
                      ? formatPhoneNumber(item.phone)
                      : formatPhoneNumber2(item.phone)}
                  </td>
                  <td className="p-5">
                    <p
                      className="z-40 inline-block"
                      // onClick={() => {
                      //   addPointToMap(item.client_address), console.log(item);
                      // }}
                    >
                      {item.client_address}
                    </p>
                  </td>
                  <td className="p-5">
                    <Link
                      className="w-full top-0 left-0 h-full absolute cursor-pointer z-10"
                      to={`/${item.id}`}
                      onClick={() => {
                        socketMe?.emit("processing_order", item.id);
                      }}
                    ></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
};

export default Orders;
