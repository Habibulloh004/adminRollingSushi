import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { orderCreateInfo, useEvent, useProductStore } from "../../store/event";
import axios from "axios";
import Loader from "../loader";
import { CircleX, Send } from "lucide-react";

export default function OrderDialog() {
  const [isOpen, setIsOpen] = useState(false); // State to manage dialog open/close
  const { products, initializeProducts, resetProduct } = useProductStore();
  const { orderData, setOrderData } = orderCreateInfo();
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = () => {
    setOrderData({
      ...orderData,
      products: products,
    });

    if (orderData.phone && orderData?.client) {
      setIsOpen(true);
    } else {
      toast.error(
        "Информация о клиенте неполная, пожалуйста, проверьте всю информацию!"
      );
    }
  };

  const handleSubmitOrder = async () => {
    if (orderData.spot_id == 0) {
      toast.error("Вы не выбрали точку доставки!");
      return;
    } else if (orderData?.products.length <= 0) {
      toast.error("Вы не добавили ни одного продукта!");
      return;
    } else {
      try {
        setIsLoading(true);
        const { spot_id, products, service_mode, client } = orderData;

        const filterProducts = products?.map((p) => {
          return {
            product_id: +p.product_id,
            count: +p.count,
          };
        });

        let filterOrderData = {
          phone: client?.phone_number,
          products: filterProducts,
          service_mode: Number(service_mode),
          spot_id: Number(spot_id),
        };

        console.log(filterOrderData);

        if (filterOrderData) {
          const res = await axios.post(
            `${import.meta.env.VITE_API}/api/posttoposter`,
            filterOrderData
          );
          if (res) {
            setIsOpen(false);
            toast.success("Заказ успешно отправлен!");
            setOrderData({
              spot_id: 0,
              phone: "",
              products: [],
              service_mode: 3,
              total: 0,
              client: {},
            });
            localStorage.setItem("products", []);
            resetProduct();
          }
        }
      } catch (error) {
        console.log(error);
        toast.error("Что-то пошло не так. Повторите попытку!!!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const calculateProductTotal = (product, active) => {
    let total = 0;

    // Helper function to calculate the discounted price
    const applyDiscount = (price, discount) => {
      if (!discount) return price;

      if (discount?.params?.result_type == 2) {
        // Fixed discount
        return Math.max(0, price - discount.params.discount_value / 100);
      } else if (discount?.params?.result_type == 3) {
        // Percentage discount
        return (price * (100 - discount.params.discount_value)) / 100;
      }

      return price; // No discount
    };

    // Calculate product price
    let productPrice = Number(product?.price["1"]) / 100;
    if (active) {
      if (product?.discount?.active) {
        productPrice = applyDiscount(productPrice, product?.discount);
      }
    }
    total += productPrice * product?.count;

    return total;
  };

  useEffect(() => {
    initializeProducts();
    // const fetchData = async () => {
    //   try {
    //     const { data } = await axios.get(`/api/branch`);
    //     setBranches(data.data);
    //   } catch (error) {
    //     console.log(error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();
  }, [initializeProducts]);

  useEffect(() => {
    const calculateTotals = async () => {
      let activeNoDiscountProductsTotal = 0; // Aktiv, lekin discount yo'q

      // Mahsulotlarni tahlil qilish
      products.forEach((product) => {
        // 2. Aktiv, lekin discount yo'q
        activeNoDiscountProductsTotal += calculateProductTotal(product, true);
      });
      console.log({ activeNoDiscountProductsTotal });

      setOrderData({
        ...orderData,
        total: activeNoDiscountProductsTotal,
      });
    };

    calculateTotals();
  }, [products]);

  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild>
        <section className="bg-white shadow-md bg-whiteabsolute flex flex-col justify-center items-center left-0 bottom-0 w-full bg-background py-2 shadow-custom gap-2">
          <div className="w-full px-4 flex justify-between items-center">
            <h1 className="font-bold textNormal1">К оплате</h1>
            <p className="font-bold textNormal2">{orderData?.total} сум</p>
          </div>

          <Button
            className="text-white w-1/2 mx-auto bg-primary hover:bg-primary"
            onClick={handleOpen}
          >
            Оплатить
          </Button>
        </section>
      </DialogTrigger>
      <DialogContent className="bg-white h-screen max-w-11/12 max-h-screen bg-transparent p-0 border-0 rounded-none overflow-y-scroll no-scrollbar">
        {/* {loading ? (
          <div className="flex justify-center items-center gap-2">
            <Loader />
            <p className="text-center textNormal2 text-thin">Загрузка...</p>
          </div>
        ) : ( */}
        <main className="bg-white my-auto rounded-md flex justify-center overflow-hidden items-center flex-col p-4 w-[70%] max-h-[calc(100vh-20px)] mx-auto bg-background space-y-2">
          <DialogHeader>
            <DialogTitle asChild>
              <h1 className="textNormal1 text-thin text-center">Новый заказ</h1>
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <main className="w-full min-w-full grid grid-cols-3 gap-3">
            <OrderCheck products={products} />
            {/* <OrderMap branches={branches} /> */}
            <TotalInfo />
            <SelectSpots />
          </main>
          <section className="w-full col-span-8 flex justify-center items-center gap-2">
            <Button
              disabled={isLoading}
              onClick={handleSubmitOrder}
              className={`${
                isLoading && "opacity-70"
              } bg-white hover:bg-white border-[1px] shadow-sm flex justify-start items-center gap-2 w-40`}
            >
              {isLoading ? <Loader /> : <Send size={32} />}
              <h1 className="textSmall2 text-primary font-bold">Отправить</h1>
            </Button>
            <Button
              className="bg-white hover:bg-white border-[1px] shadow-sm flex justify-start items-center gap-2 w-40"
              onClick={() => setIsOpen(false)} // Close dialog on cancel
            >
              <CircleX size={32}  className="text-red-600"/>{" "}
              <h1 className="textSmall2 text-red-600 font-bold">Отмена</h1>
            </Button>
          </section>
        </main>
        {/* )} */}
      </DialogContent>
    </Dialog>
  );
}

// const OrderMap = ({ branches }) => {
//   const { orderData, setOrderData } = orderCreateInfo();
//   const defaultCoordinates = [41.311158, 69.279737];
//   const [coordinates, setCoordinates] = useState(defaultCoordinates); // Marker coordinates
//   const [mapCenter, setMapCenter] = useState(defaultCoordinates); // Map center coordinates
//   const [mapZoom, setMapZoom] = useState(10);

//   const handleAddBranch = (branch) => {
//     setOrderData({
//       ...orderData,
//       spot_id: branch?.spot_id,
//       spot_name: branch?.name,
//     });
//   };

//   useEffect(() => {
//     const { latitude, longitude } = orderData.location;
//     if (latitude !== 0 && longitude !== 0) {
//       setCoordinates([latitude, longitude]);
//       setMapCenter([latitude, longitude]);
//     } else {
//       setMapCenter([41.311158, 69.279737]);
//       setCoordinates(null);
//     }
//   }, []);

//   return (
//     <main className="col-span-3 space-y-2">
//       <section className="shadow-custom p-4">
//         <h1 className="text-center font-bold text-thin">Локация</h1>
//         <div className="relative border-border border-2 rounded-md h-[350px] w-full">
//           <YMaps query={{ apikey: apiKeyYandex }}>
//             <Map
//               width="100%"
//               height="100%"
//               state={{ center: mapCenter, zoom: mapZoom }}
//             >
//               {coordinates && (
//                 <Placemark
//                   geometry={coordinates}
//                   options={{
//                     iconLayout: "default#image",
//                     iconImageHref:
//                       "https://fkkpuaszmvpxjoqqmlzx.supabase.co/storage/v1/object/public/wassabi/1365700-removebg-preview.png",
//                     iconImageSize: [40, 40],
//                     iconImageOffset: [-20, -40],
//                   }}
//                   properties={{
//                     balloonContentHeader: `Клиент с адресом`,
//                     balloonContentBody: `<div>${`Клиент с адресом`}</div>`,
//                     hintContent: `Клиент с адресом`,
//                   }}
//                   modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
//                 />
//               )}
//               {branches.length > 0 && (
//                 <>
//                   {branches.map((branch, idx) => (
//                     <Placemark
//                       key={idx}
//                       onClick={() => {
//                         setOrderData({
//                           ...orderData,
//                           spot_id: branch?.spot_id,
//                         });
//                       }}
//                       geometry={[+branch?.lat, +branch?.lng]}
//                       options={{
//                         iconLayout: "default#image",
//                         iconImageHref:
//                           branch?.spot_id == orderData?.spot_id
//                             ? "https://fkkpuaszmvpxjoqqmlzx.supabase.co/storage/v1/object/public/wassabi/wassabi-location.png"
//                             : "https://fkkpuaszmvpxjoqqmlzx.supabase.co/storage/v1/object/public/wassabi/food.png", // Ensure this path is correct
//                         iconImageSize:
//                           branch?.spot_id == orderData?.spot_id
//                             ? [40, 40]
//                             : [35, 35], // Make sure these sizes are appropriate for your image
//                         iconImageOffset:
//                           branch?.spot_id == orderData?.spot_id
//                             ? [-20, -20]
//                             : [-17.5, -17.5], // Adjust if necessary
//                       }}
//                       properties={{
//                         balloonContentHeader: branch.name,
//                         balloonContentBody: `<div>${branch.name}</div>`,
//                         hintContent: branch.name,
//                       }}
//                       modules={[
//                         "geoObject.addon.balloon",
//                         "geoObject.addon.hint",
//                       ]}
//                     />
//                   ))}
//                 </>
//               )}
//               <ZoomControl options={{ float: "right" }} />
//             </Map>
//           </YMaps>
//         </div>
//       </section>
//       <section className="shadow-custom p-4 space-y-2">
//         <h1 className="text-center font-bold text-thin">Выбрать филиал</h1>
//         <div className="px-2 flex flex-col gap-2 max-h-[110px] overflow-y-scroll">
//           {branches?.map((item, i) => (
//             <div
//               onClick={() => handleAddBranch(item)}
//               key={i}
//               className={`${
//                 +item?.spot_id == +orderData?.spot_id
//                   ? "bg-primary"
//                   : "bg-thin-secondary"
//               } py-1 px-2 rounded-md cursor-pointer text-white border-border w-full flex justify-between items-center gap-3 `}
//             >
//               <h1 className="textSmall2 border-r-2 w-3/4">{item?.name}</h1>
//               <p className="w-1/4 text-center textSmall1">
//                 <span className="textSmall3">
//                   {
//                     orders?.filter(
//                       (c) =>
//                         +c.spot_id == +item?.spot_id && c.status == "cooking"
//                     )?.length
//                   }{" "}
//                 </span>{" "}
//                 <br />
//                 Кол.ож. заказ
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>
//     </main>
//   );
// };

const OrderCheck = () => {
  const { orderData } = orderCreateInfo();
  const { client, products } = orderData;

  return (
    <main className="col-span-1 shadow-custom p-4 rounded-md flex justify-between items-start flex-col h-full">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-thin px-2 textSmall1 py-1 text-left">
              Наименование
            </th>
            <th className="text-thin px-2 textSmall1 py-1 text-center">
              Кол-во
            </th>
            <th className="text-thin px-2 textSmall1 py-1 text-right">Цена</th>
            <th className="text-thin px-2 textSmall1 py-1 text-right">Итого</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="4" className="p-0">
              <div
                className="overflow-y-auto max-h-[400px]"
                style={{ display: "block" }}
              >
                <table className="w-full">
                  <tbody>
                    {products?.map((item, index) => {
                      const renderRow = (name, count, price) => {
                        const orgName = name.split("$")[0];
                        return (
                          <tr key={`${index}-${name}`} className="border-b">
                            <td className="text-foreground px-2 py-1 textSmall1 text-left">
                              {orgName}
                            </td>
                            <td className="text-thin px-2 py-1 textSmall1 text-center">
                              {count}
                            </td>
                            <td className="text-thin px-2 py-1 textSmall1 text-right">
                              {price} сум
                            </td>
                            <td className="text-thin px-2 py-1 textSmall1 text-right">
                              {price * count} сум
                            </td>
                          </tr>
                        );
                      };

                      if (item?.modifications?.length > 0) {
                        return (
                          <React.Fragment key={index}>
                            {item.modifications.map((m) =>
                              renderRow(
                                `${item.product_name} ${m.modificator_name}`,
                                m.count,
                                Number(m?.spots[0]?.price) / 100
                              )
                            )}
                          </React.Fragment>
                        );
                      } else {
                        return renderRow(
                          item.product_name,
                          item.count,
                          Number(item?.price["1"]) / 100
                        );
                      }
                    })}
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <ul className="h-[30%] w-full textSmall2 space-y-2 mt-2 text-thin">
        <li className="border-border pt-2 flex justify-between items-center gap-3">
          <h1 className="col-span-1">Клиент:</h1>
          <div className="col-span-2 flex flex-col gap-2 justify-start items-center">
            <p>{client?.firstname + " " + client?.lastname}</p>
          </div>
        </li>
        <li className="flex justify-between items-center gap-3">
          <h1 className="col-span-1">Номер телефона:</h1>
          <div className="col-span-2 flex flex-col gap-2 justify-start items-center">
            <p>{orderData?.phone}</p>
          </div>
        </li>
        <li className="flex justify-between items-center gap-3">
          <h1 className="col-span-1">Итого :</h1>
          <span className="col-span-2">{+orderData?.total} сум</span>
        </li>
      </ul>
    </main>
  );
};

const TotalInfo = () => {
  const { orderData, setOrderData } = orderCreateInfo();
  const totalAmount = +orderData?.total;
  const serviceMode = [
    { type: 2, title: "Навынос" },
    { type: 3, title: "Доставка" },
  ];

  return (
    <main className="col-span-1 h-full flex flex-col justify-start gap-3 shadow-custom p-4">
      <section className="w-full space-y-2">
        {serviceMode?.map((service, i) => (
          <Button
            type="ghost"
            onClick={() =>
              setOrderData({ ...orderData, service_mode: service?.type })
            }
            key={i}
            className={`${
              orderData?.service_mode == service?.type
                ? "bg-primary hover:bg-primary text-white"
                : "bg-white hover:bg-primary/10 text-primary"
            } p-2 rounded-md border border-border w-full `}
          >
            <h1 className="textSmall2">{service.title}</h1>
          </Button>
        ))}
      </section>
      <section className="w-full space-y-3">
        <div className="space-y-1 border-b-[1px] py-1">
          <h1 className="textSmall2 text-thin-secondary">Общая сумма</h1>
          <p className="textNormal1">{totalAmount} сум</p>
        </div>
        <div className="space-y-1 border-b-[1px] py-1">
          <h1 className="textSmall2 text-thin-secondary">Режим обслуживания</h1>
          <p className="textNormal1">
            {
              serviceMode?.find((sv) => sv?.type == orderData?.service_mode)
                ?.title
            }
          </p>
        </div>
      </section>
    </main>
  );
};
const SelectSpots = () => {
  const { orderData, setOrderData } = orderCreateInfo();
  const { spotsData } = useEvent();
  console.log(spotsData);

  return (
    <main className="h-col-span-1 h-full flex flex-col justify-between gap-3 shadow-custom px-4">
      <section className="h-full w-full space-y-2">
        {spotsData?.map((spot, i) => (
          <Button
            type="ghost"
            onClick={() =>
              setOrderData({ ...orderData, spot_id: spot?.spot_id })
            }
            key={i}
            className={`${
              orderData?.spot_id == spot?.spot_id
                ? "bg-primary hover:bg-primary text-white"
                : "bg-white hover:bg-primary/10 text-primary"
            } p-2 rounded-md border border-border w-full `}
          >
            <h1 className="textSmall2">{spot.name}</h1>
          </Button>
        ))}
      </section>
      <div className="space-y-2 py-1">
        <h1 className="textSmall2 text-thin-secondary border-b py-1">
          Адрес места
        </h1>
        <p className="textNormal1">
          {spotsData?.find((sv) => sv?.spot_id == orderData?.spot_id)?.name}
        </p>
        <p className="textSmall1">
          {spotsData?.find((sv) => sv?.spot_id == orderData?.spot_id)?.address}
        </p>
      </div>
    </main>
  );
};
