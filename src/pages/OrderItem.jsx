import { useNavigate, useParams } from "react-router-dom";
import { LeftArrow } from "../assets";
import { f, formatPhoneNumber, formatPhoneNumber2 } from "../utils";
import Map from "../components/Map";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { getDistance, findNearest } from "geolib";

const OrderItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // const { socketMe } = useSocketContext();
  const [parsedOrder, setParsedOrder] = useState([]);
  const [checkedItem, setCheckedItem] = useState(null);
  const [orderItem, setOrderItem] = useState(null);
  const [spots, setSpots] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientAdress, setClientAdress] = useState(null);
  const [addressName, setAddressName] = useState("");
  const [orderLocation, setOrderLocation] = useState({});
  const [spotLocations, setSpotLocations] = useState([]);
  const [nearestSpot, setNearestSpot] = useState({});
  const [distance, setDistance] = useState("");

  const tableHead = ["Филиал"];

  const fetchData = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACK}/get_order/${id}`
    );
    setClientAdress(data.client_address);
    setOrderItem(data);
    const [latitude, longitude] = data.client_address.split(",").map(Number);

    setOrderLocation({
      latitude,
      longitude,
    });
  };

  const fetchSpot = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_API}/getSpot`);
    setSpots(data);
    setSpotLocations(
      data.map((item) => ({
        id: item.spot_id,
        latitude: item.lat,
        longitude: item.lng,
        name: item.name,
      }))
    );
  };

  useEffect(() => {
    fetchData();
    fetchSpot();
  }, []);

  useEffect(() => {
    setNearestSpot(findNearest(orderLocation, spotLocations));
  }, [orderItem, spots]);

  useEffect(() => {
    if (nearestSpot && orderItem) {
      let latitudeLongitude = orderItem.client_address.split(",");
      let lat = parseFloat(latitudeLongitude[0]);
      let lng = parseFloat(latitudeLongitude[1]);
      const orderAddress = {
        latitude: lat,
        longitude: lng,
      };
      setDistance(
        getDistance(
          { latitude: nearestSpot.latitude, longitude: nearestSpot.longitude },
          orderAddress
        )
      );
    }
  }, [nearestSpot]);

  useEffect(() => {
    if (orderItem) {
      const productsString = orderItem.products.replace(
        /([{,])(\s*)([a-zA-Z0-9_]+?):/g,
        '$1"$3":'
      );
      setParsedOrder(JSON.parse(productsString));
    }
  }, [orderItem]);

  useEffect(() => {
    if (clientAdress) {
      let latitudeLongitude = clientAdress?.split(",");
      let lat = parseFloat(latitudeLongitude[0]);
      let lng = parseFloat(latitudeLongitude[1]);
      const provider = new OpenStreetMapProvider();

      const searchAddress = async () => {
        try {
          const results = await provider.search({ query: `${lat},${lng}` });
          if (results.length) {
            // console.log("open", results);
            setAddressName(results[0].label);
          }
        } catch (error) {
          console.error("Error searching address:", error);
        }
      };

      searchAddress();
    }
  }, [clientAdress]);

  const backBtn = () => {
    navigate(-1);
    // socketMe?.emit("stopped_process_order", orderItem?.id)
  };
  const headers = {
    "Content-Type": "application/json",
  };
  // const submit = async (e) => {
  //   e.preventDefault();
  //   const productsString = orderItem.products.replace(
  //     /([{,])(\s*)([a-zA-Z0-9_]+?):/g,
  //     '$1"$3":'
  //   );

  //   let latitudeLongitude = orderItem?.client_address?.split(",");
  //   let lat = parseFloat(latitudeLongitude[0]);
  //   let lng = parseFloat(latitudeLongitude[1]);
  //   console.log(checkedItem);

  //   const sendData = JSON.parse(productsString);
  //   const deliver = orderItem.type == "delivery" || orderItem.type == "";
  //   const sendOrderPoster = {
  //     spot_id: checkedItem?.spot_id,
  //     // products: [
  //     //   {
  //     //     product_id: 3,
  //     //     count: 1,
  //     //   },
  //     //   {
  //     //     product_id: 5,
  //     //     count: 1,
  //     //   },
  //     // ],
  //     products: sendData.map((item) => ({
  //       product_id: +item.product_id,
  //       count: +item.amount,
  //     })),
  //     delivery_price: deliver ? 1000000 : 0,
  //     phone: orderItem.phone,
  //     service_mode: deliver ? 3 : 2,
  //     client_address: {
  //       address1: addressName,
  //       lat: `${lat}`,
  //       lng: `${lng}`,
  //     },
  //     comment: orderItem?.id,
  //   };
  //   console.log("postord", sendOrderPoster);
  //   console.log("ordItem", orderItem);
  //   try {
  //     setLoading(true);
  //     const resStatus = await axios.put(
  //       `${import.meta.env.VITE_BACK}/update_order_status/${+id}`,
  //       JSON.stringify({
  //         status: "accept",
  //       }),
  //       { headers }
  //     );
  //     const resSpot = await axios.put(
  //       `${import.meta.env.VITE_BACK}/update_order_spot/${+id}`,
  //       JSON.stringify({
  //         spot_id: `${+checkedItem.spot_id}`,
  //       }),
  //       { headers }
  //     );

  //     const postPoster = await axios.post(
  //       `${import.meta.env.VITE_API}/api/posttoposter`,
  //       JSON.stringify(sendOrderPoster),
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     // const tgRes = await axios.get(
  //     //   `https://api.telegram.org/bot7051935328:AAFJxJAVsRTPxgj3rrHWty1pEUlMkBgg9_o/sendMessage?chat_id=-1002211902296&text=`
  //     // )
  //     toast.success("Заказ успешно изменен!");

  //     console.log("poster", postPoster);
  //     console.log("st", resStatus);
  //     console.log("sp", resSpot);
  //     navigate("/");
  //   } catch (e) {
  //     setLoading(false);
  //     console.log(e);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const submit = async (e) => {
    e.preventDefault();
    const productsString = orderItem.products.replace(
      /([{,])(\s*)([a-zA-Z0-9_]+?):/g,
      '$1"$3":'
    );

    let latitudeLongitude = orderItem?.client_address?.split(",");
    let lat = parseFloat(latitudeLongitude[0]);
    let lng = parseFloat(latitudeLongitude[1]);

    const sendData = JSON.parse(productsString);
    const deliver = orderItem.type == "delivery" || orderItem.type == "";
    console.log("checked", checkedItem);
    const sendOrderPoster = {
      spot_id: checkedItem?.spot_id,
      products: sendData.map((item) => ({
        product_id: +item.product_id,
        count: +item.amount,
      })),
      // delivery_price: deliver ? 1000000 : 0,
      phone: orderItem.phone,
      service_mode: deliver ? 3 : 2,
      client_address: {
        address1: addressName,
        lat: `${lat}`,
        lng: `${lng}`,
      },
      comment: orderItem?.id,
    };

    console.log("postord", sendOrderPoster);
    console.log("ordItem", orderItem);

    try {
      setLoading(true);
      // Update order status
      const resStatus = await axios.put(
        `${import.meta.env.VITE_BACK}/update_order_status/${+id}`,
        JSON.stringify({ status: "accept" }),
        { headers }
      );

      // Update order spot
      const resSpot = await axios.put(
        `${import.meta.env.VITE_BACK}/update_order_spot/${+id}`,
        JSON.stringify({ spot_id: `${+checkedItem.spot_id}` }),
        { headers }
      );

      // Post order to external API
      const postPoster = await axios.post(
        `${import.meta.env.VITE_API}/api/posttoposter`,
        JSON.stringify(sendOrderPoster),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const yandexMapsLink = `https://yandex.com/maps/?pt=${lng},${lat}&z=16&l=map`;

      const orderAddress = {
        latitude: lat,
        longitude: lng,
      };

      getDistance(
        { latitude: checkedItem.lat, longitude: checkedItem.lng },
        orderAddress
      );
      // Format Telegram message
      const message = `
  📦 Новый заказ! №${orderItem.id}
  🛒 Название филиал: ${checkedItem.name}
  📞 Телефон: ${orderItem.phone}
  🏠 Адрес: ${addressName ?? addressName}
  🔗 [Посмотреть на карте](${yandexMapsLink})
  🗺️ Расстояние: ${(
    getDistance(
      { latitude: checkedItem.lat, longitude: checkedItem.lng },
      orderAddress
    ) / 1000
  ).toFixed(1)} км
  💵 Сумма заказа: ${f(orderItem?.all_price / 100)} сум
  💳 Метод оплаты: ${
    orderItem?.payment === "cash"
      ? "Наличные"
      : orderItem?.payment === "creditCard"
      ? "Карта (Оплачено)"
      : "Карта (Не оплачено)"
  }
  🎁 Бонусы: ${f(orderItem?.payed_bonus / 100)} сум
  💵 К оплате: ${f(orderItem?.payed_sum / 100)} сум
  🛍 Тип заказа: ${
    orderItem.type === "delivery"
      ? "Доставка"
      : orderItem.type === ""
      ? "Доставка"
      : `На вынос (${orderItem.type.replace(/^take_away\s*/, "")})`
  }
  
  `.trim();
  // 🚚 Доставка: ${deliver ? "10,000 сум" : "Не требуется"}

      // Send message to Telegram
      const tgRes = await axios.get(
        `https://api.telegram.org/bot7051935328:AAFJxJAVsRTPxgj3rrHWty1pEUlMkBgg9_o/sendMessage?chat_id=-1002211902296&text=${encodeURIComponent(
          message
        )}`
      );

      console.log(tgRes);

      toast.success("Заказ успешно изменен!");

      console.log("poster", postPoster);
      console.log("st", resStatus);
      console.log("sp", resSpot);
      navigate("/");
    } catch (e) {
      setLoading(false);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  console.log("nearspot", nearestSpot);

  console.log(orderItem);
  console.log(addressName);

  if (!orderItem || !spots) {
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
  return (
    <main className="text-cText flex gap-3 grow">
      <div className="container grow w-1/2 flex flex-col">
        <section className="p-4 shadow-shadowme px-9 flex items-center">
          <img
            onClick={backBtn}
            src={LeftArrow}
            alt=""
            className="w-4 cursor-pointer"
          />
          <p
            onClick={backBtn}
            className="text-2xl font-bold cursor-pointer px-5"
          >
            Заказы
          </p>
        </section>
        <section className="grow shadow-shadowme mt-3 py-6 px-9 space-y-2">
          <p className="text-2xl font-medium">
            {orderItem?.phone?.length > 11
              ? formatPhoneNumber(orderItem.phone)
              : formatPhoneNumber2(orderItem.phone)}
          </p>
          <p className="mt-3">{addressName ?? addressName}</p>
          {/* <p className="mt-3 font-semibold text-lg">Товары:</p> */}
          {/* <ol className="list-decimal my-2 mx-2">
            {orderItem?.products.map((prod, idx) => (
              <li key={prod.id} className="flex gap-1">
                <p>{idx + 1}.</p>
                <p>{prod.prod_name} </p> - <p> {f(prod.quantity)}</p> Штук -{" "}
                <p>({f(prod.price) + " x " + f(prod.quantity)}) </p>
                <p>{f(prod.price * prod.quantity)}</p>
              </li>
            ))}
          </ol> */}
          <p className="">
            <span className="text-lg font-semibold">Сумма заказа</span> -{" "}
            {f(orderItem?.all_price / 100)} сум
          </p>
          <p className="">
            <span className="text-lg font-semibold">Метод оплата</span> -{" "}
            {orderItem?.payment == "cash"
              ? "Наличные"
              : orderItem?.payment == "creditCard"
              ? "Карта (Оплачено)"
              : "Карта (Не оплачено)"}
          </p>
          <p className="">
            <span className="text-lg font-semibold">Бонусы</span> -{" "}
            {f(orderItem?.payed_bonus / 100)} сум
          </p>
          <p className="">
            <span className="text-lg font-semibold">K оплате</span> -{" "}
            {f(orderItem?.payed_sum / 100)} сум
          </p>
          <p className="">
            <span className="text-lg font-semibold">Тип заказа</span> -{" "}
            {orderItem.type == "delivery" && "Доставка"}
            {orderItem.type == "" && "Доставка"}
            {orderItem.type != "delivery" &&
              orderItem.type != "" &&
              `На вынос (${orderItem.type.replace(/^take_away\s*/, "")})`}
          </p>
          {orderItem.type == "delivery" && (
            <p className="">
              <span className="text-lg font-semibold">Доставка</span> - 10,000
              сум
            </p>
          )}

          {/* <span>
            <p>Товары:</p>
            <ol className="list-decimal my-2 mx-2 text-sm font-normal">
              {orderData?.products.map((prod, idx) => {
                const findProductName = myOrder?.products.find(
                  (item) => item.product_id == prod.product_id
                );
                return (
                  <li key={idx} className="flex gap-1">
                    <p>{prod.num.split(".").slice(0, 1)}. шт / гр |</p>
                    <p>{findProductName?.product_name}</p>
                  </li>
                );
              })}
            </ol>
          </span> */}
          <Map
            position={orderItem.client_address}
            nearestSpot={nearestSpot}
            spots={spots}
          />
        </section>
      </div>
      <div className="container grow w-1/2 flex flex-col">
        <p className="text-2xl font-bold p-4 shadow-shadowme px-9">Филиалы</p>
        <section className="grow shadow-shadowme mt-3 px-4 flex flex-col items-end justify-between">
          <div className="w-full">
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
                {spots.map((item, idx) => (
                  <tr key={idx} className="relative">
                    <td className="p-5">{idx + 1}.</td>
                    <td className="p-5">{item.name}</td>
                    <td className="p-5">
                      <label
                        onClick={() => setCheckedItem(item)}
                        className="absolute top-0 left-0 w-[85%] h-full"
                      ></label>
                      <input
                        name="spots"
                        type="radio"
                        id={item.id}
                        className="accent-primary w-4 h-4"
                        onChange={() => setCheckedItem(item)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 w-11/12 mx-auto flex items-center justify-between gap-5">
              <p className="text-lg font-semibold">Ближайший филиал</p>
              <p>
                {nearestSpot && nearestSpot.name} -{" "}
                {(distance / 1000).toFixed(1)} km
              </p>
            </div>
          </div>
          <button
            className={`p-2 px-6 text-sm rounded-sm bg-primary text-white ml-auto mb-5 ${
              !checkedItem?.spot_id && "bg-opacity-50"
            }`}
            onClick={submit}
            disabled={loading || !checkedItem?.spot_id}
          >
            {loading ? "Загрузка..." : "Переслать на филиал"}
          </button>
        </section>
      </div>
    </main>
  );
};

export default OrderItem;
