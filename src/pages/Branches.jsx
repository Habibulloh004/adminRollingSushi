import { Fragment, useEffect, useState } from "react";
import { formatPhoneNumber, formatPhoneNumber2, process } from "../utils";
import { motion } from "framer-motion";
import axios from "axios";

const Branches = () => {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(process[0]);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetchSpot();
    fetchOrder();
  }, []);
  const [selectedBranch, setSelectedBranch] = useState(spots[0]);

  const fetchSpot = async () => {
    const { data } = await axios.get(
      "https://sushiserver.onrender.com/getSpot"
    );
    setSpots(data);
    setSelectedBranch(data[0]);
  };

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://vm4983125.25ssd.had.wf:5000/get_spot/filter?spot_id=${
          selectedBranch?.spot_id || 1
        }&status=${
          selectedProcess?.reqPath == undefined ? "" : selectedProcess?.reqPath
        }`
      );
      setOrders(data);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (e) {
      setLoading(false);
      setOrders([]);
      console.log(e);
    }
  };


  useEffect(() => {
    fetchOrder();
  }, [selectedBranch, selectedProcess]);

  const getStatus = (status) => {
    switch (status) {
      case "":
        return "Все заказы";
      case "waiting":
        return "Ожидаемые";
      case "accept":
        return "Выполняемые";
      case "cooking":
        return "Готовые";
      case "delivery":
        return "Доставляется";
      case "finished":
        return "Завершенные";
      default:
        return "Unknown";
    }
  };

  console.log(spots);
  if (!spots.length) {
    return (
      <div className="h-[500px] w-full justify-center flex items-center">
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
    );
  }

  // console.log(spots);
  return (
    <main className="text-cText flex gap-3 grow mb-5">
      <div className="container grow w-1/2 flex flex-col">
        <section className="p-4 shadow-shadowme px-9 flex justify-between">
          <p className="text-2xl font-bold">Филиалы</p>
          <ul className="flex gap-5">
            {spots.map((item, idx) => (
              <li
                key={idx}
                onClick={() => {
                  setSelectedBranch(item);
                  console.log(item.spot_id);
                }}
                className={`cursor-pointer relative font-semibold px-4 py-1 text-primary`}
              >
                {+selectedBranch?.spot_id === +item.spot_id && (
                  <motion.div
                    layoutId="underline-1"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                  />
                )}
                {item.name}
              </li>
            ))}
          </ul>
        </section>
        <section className="p-4 mt-3 shadow-shadowme px-9 flex justify-between">
          <ul className="flex gap-5 w-full">
            {process.map((item) => {
              return (
                <li
                  key={item.id}
                  onClick={() => setSelectedProcess(item)}
                  className={`cursor-pointer relative font-semibold w-[16%] text-center p-1`}
                >
                  {selectedProcess.id === +item.id && (
                    <motion.div
                      layoutId="underline-2"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                    />
                  )}
                  {item.name}
                </li>
              );
            })}
          </ul>
        </section>
        <section className="shadow-shadowme mt-3 px-4 grow">
          {loading ? (
            <div className="h-[500px] w-full justify-center flex items-center">
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
                  <th className="w-[10%]"></th>
                  <th className="py-5 w-[25%]">Номер телефона</th>
                  <th className="py-5 w-[35%]">Адрес Доставки</th>
                  <th className="py-5">Статус</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((item, idx) => {
                  // const selectProcess = orderProcess.find(
                  //   (proc) => +proc.id === +item.processing + 1
                  // );
                  return (
                    <Fragment key={idx}>
                      <tr className={`relative border-b-2 cursor-pointer`}>
                        <td className="p-5 w-[10%] ">{item.id}</td>
                        <td className="p-5 w-[25%] ">
                          {" "}
                          {item.phone.length > 11
                            ? formatPhoneNumber(item.phone)
                            : formatPhoneNumber2(item.phone)}
                        </td>
                        <td className="p-5 w-[35%]">{item.client_address}</td>
                        <td className="p-5">{getStatus(item.status)}</td>
                      </tr>
                      {/* {openStates[item.id] && (
                      <tr>
                        <td></td>
                        <td></td>
                      </tr>
                    )} */}
                      {/* {openStates[item.id] && (
                      <tr className="transition-all border-b-2">
                        <td></td>
                        <td className="transition-all">
                          <ol className="list-decimal text-sm flex flex-col gap-1 py-2">
                            {item.products.map((prod, idx) => (
                              <li key={prod.id} className="flex">
                                <p>{idx + 1}.</p>
                                <p>{prod.prod_name} </p> -{" "}
                                <p> {f(prod.quantity)}</p> Штук -{" "}
                                <p>
                                  ({f(prod.price) + " x " + f(prod.quantity)}){" "}
                                </p>
                                <p>{f(prod.price * prod.quantity)}</p>
                              </li>
                            ))}
                          </ol>
                        </td>
                        <td></td>
                        <td></td>
                        <td className="flex flex-wrap gap-1 text-sm py-2 justify-center items-center">
                          {orderProcess.map((item) => (
                            <span
                              key={item.id}
                              className={`py-1 px-2 rounded-md cursor-pointer ${
                                +selectProcess.id === +item.id
                                  ? "bg-primary text-white"
                                  : "border-primary text-primary border"
                              }`}
                            >
                              {item.name}
                            </span>
                          ))}
                        </td>
                        <td className="w-[60px]"></td>
                      </tr>
                    )} */}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
};

export default Branches;
