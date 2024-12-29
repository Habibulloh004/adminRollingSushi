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
import { CircleX, Send, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

export default function OrderDialog() {
  const [isOpen, setIsOpen] = useState(false); // State to manage dialog open/close
  const { products, initializeProducts, resetProduct } = useProductStore();
  const { orderData, setOrderData } = orderCreateInfo();
  const [isLoading, setIsLoading] = useState(false);
  const { spotsData } = useEvent();
  const [open, setOpen] = useState(false);

  const handleResetOrder = () => {
    setIsOpen(false);
    setOpen(false);
    setOrderData({
      spot_id: 0,
      phone: "",
      products: [],
      service_mode: 3,
      total: 0,
      client: {},
      pay_bonus: 0,
      pay_sum: 0,
    });
    localStorage.setItem("products", []);
    resetProduct();
  };

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

  const formatCreatedAt = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Oylar 0 dan boshlanadi
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
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
        const { spot_id, products, service_mode, client, total } = orderData;

        const filterProductsExpress = products?.map((p) => {
          return {
            product_id: +p.product_id,
            count: +p.count,
          };
        });
        const filterProductsAbdugani = products?.map((p) => {
          return {
            product_id: +p.product_id,
            amount: +p.count,
          };
        });
        const spotName = spotsData?.find(
          (spot) => spot.spot_id == spot_id
        )?.name;
        const clinetAddress = orderData?.client?.addresses?.find(
          (address) => address?.id == orderData?.client?.client_address_id
        );

        let filterOrderDataAbdugani = {
          address_comment: "",
          all_price: Number(total * 100),
          client_address: "41.311300,69.279773",
          client_id: Number(client?.client_id),
          comment: "no",
          created_at: formatCreatedAt(),
          payed_bonus: orderData?.pay_bonus
            ? Number(orderData?.pay_bonus) * 100
            : 0,
          payed_sum: Number(orderData?.pay_sum * 100),
          payment: "cash",
          phone: `+${client?.phone_number}`,
          products: JSON.stringify(filterProductsAbdugani),
          promotion: "no",
          spot_id: Number(spot_id),
          status: "accept",
          type: service_mode == 3 ? "delivery" : `take_away ${spotName}`,
        };
        let filterOrderDataExpress = {
          phone: client?.phone_number,
          products: filterProductsExpress,
          service_mode: Number(service_mode),
          spot_id: Number(spot_id),
        };
        if (clinetAddress) {
          filterOrderDataAbdugani.address_comment = clinetAddress?.address1;
          filterOrderDataExpress.client_address_id =
            orderData?.client?.client_address_id;
        } else {
          filterOrderDataAbdugani.address_comment = orderData?.address1;
          filterOrderDataExpress.address = orderData?.address1;
        }
        console.log(filterOrderDataAbdugani);
        console.log(filterOrderDataExpress);
        if (filterOrderDataAbdugani) {
          const abdugani = await axios.post(
            `${import.meta.env.VITE_BACK}/add_order`,
            filterOrderDataAbdugani
          );
          const express = await axios.post(
            `${import.meta.env.VITE_API}/api/posttoposter`,
            filterOrderDataExpress
          );

          if (abdugani && express) {
            setIsOpen(false);
            toast.success("Заказ успешно отправлен!");
            setOrderData({
              spot_id: 0,
              phone: "",
              products: [],
              service_mode: 3,
              total: 0,
              client: {},
              pay_bonus: 0,
              pay_sum: 0,
            });
            localStorage.setItem("products", []);
            resetProduct();
            setOpen(false);
            console.log({ abdugani, express });
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
        pay_sum: activeNoDiscountProductsTotal,
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
      <DialogContent className="bg-white h-screen max-w-11/12 bg-transparent p-0 border-0 rounded-none overflow-y-scroll no-scrollbar">
        <main className="bg-white my-auto rounded-md flex justify-center overflow-hidden items-center flex-col p-4 w-[70%] mx-auto bg-background space-y-3">
          <DialogHeader>
            <DialogTitle asChild>
              <h1 className="textNormal1 text-thin text-center">Новый заказ</h1>
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <main className="w-full min-w-full grid grid-cols-3 gap-3">
            <OrderCheck products={products} />
            <TotalInfo />
            <SelectSpots />
          </main>
          <section className="w-full col-span-8 flex justify-end items-center gap-2 pt-4">
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
              <CircleX size={32} className="text-red-600" />{" "}
              <h1 className="textSmall2 text-red-600 font-bold">Отмена</h1>
            </Button>
            <AlertDialog
              open={open}
              onOpenChange={setOpen}
              className="z-[9999] max-w-11/12 mx-auto"
            >
              <AlertDialogTrigger asChild>
                <Button
                  className="bg-red-500 hover:bg-red-400 border-[1px] shadow-sm flex justify-start items-center gap-2"
                  onClick={() => setOpen(true)} // Close dialog on cancel
                >
                  <Trash2 className="text-white" />
                  <h1 className="textSmall2 text-white font-bold">
                    Закрыть без оплаты
                  </h1>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="z-[1000] rounded-md w-11/12 mx-auto bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Вы уверены, что хотите выполнить заказ?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Если вы действительно хотите выполнить заказ, нажмите кнопку
                    «Продолжить».
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setOpen(false)}>
                    Отмена
                  </AlertDialogCancel>

                  <Button
                    disabled={isLoading}
                    className="hover:bg-primary text-white"
                    onClick={handleResetOrder}
                  >
                    Продолжить
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </section>
        </main>
        {/* )} */}
      </DialogContent>
    </Dialog>
  );
}

const OrderCheck = () => {
  const { orderData, setOrderData } = orderCreateInfo();
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
                className="overflow-y-auto max-h-[250px]"
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
        <li className="border-border flex justify-between items-center gap-3">
          <h1 className="col-span-1">Клиент адрес:</h1>
          <div className="col-span-2 flex flex-col gap-2 justify-start items-center">
            <input
              type="text"
              className="w-full px-2 py-1 rounded-md border border-border "
              placeholder="Дополнительный адрес"
              value={orderData?.address1 || ""}
              onChange={(e) =>
                setOrderData({ ...orderData, address1: e.target.value })
              }
            />
          </div>
        </li>
        <li className="border-border pt-2 flex justify-between items-center gap-3">
          <h1 className="col-span-1">Клиент bonus:</h1>
          <div className="col-span-2 flex flex-col gap-2 justify-start items-center">
            <p>{orderData?.client?.bonus / 100} сум</p>
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

  useEffect(() => {
    if (orderData?.client?.bonus / 100) {
      setOrderData({
        ...orderData,
        pay_sum: Math.max(0, +orderData?.total - +orderData?.pay_bonus),
        pay_bonus: Math.min(
          +orderData?.client?.bonus / 100,
          +orderData?.pay_bonus
        ),
      });
    }
  }, [orderData?.pay_bonus]);

  return (
    <main className="col-span-1 h-full flex flex-col justify-between gap-3 shadow-custom p-4">
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
      <section>
        {orderData?.client?.bonus / 100 > 0 && (
          <div className="space-y-3 px-2">
            <div className="grid grid-cols-4 space-x-2">
              <label className="col-span-1 w-full flex justify-center items-center textSmall2 text-thin-secondary">
                Наличные
              </label>
              <input
                type="number"
                value={Number(orderData?.pay_sum) || ""}
                onChange={(e) =>
                  setOrderData({ ...orderData, pay_sum: e.target.value })
                }
                className="col-span-3 border p-2 rounded-md w-full"
                placeholder="Введите сумму"
              />
            </div>
            <div className="grid grid-cols-4 space-x-2">
              <label className="col-span-1 w-full flex justify-center items-center textSmall2 text-thin-secondary">
                Бонус
              </label>
              <input
                type="number"
                value={orderData?.pay_bonus == 0 ? null : orderData.pay_bonus}
                onChange={(e) =>
                  setOrderData({ ...orderData, pay_bonus: e.target.value })
                }
                className="col-span-3 border p-2 rounded-md w-full"
                placeholder="Введите сумму"
              />
            </div>
          </div>
        )}
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
  const clientData = orderData?.client;

  return (
    <main className="h-col-span-1 h-full flex flex-col justify-between gap-3 shadow-custom px-4">
      <section className="w-full space-y-2">
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
      <section className="max-h-[200px] overflow-y-scroll">
        {clientData?.addresses?.length > 0 && (
          <div className="space-y-2">
            {clientData?.addresses
              ?.slice()
              ?.reverse()
              ?.map((address) => {
                if (!address?.address1) {
                  return null;
                }
                return (
                  <div
                    onClick={() => {
                      setOrderData({
                        ...orderData,
                        client: {
                          ...orderData?.client,
                          client_address_id: address?.id,
                        },
                      });
                    }}
                    key={address?.id}
                    className={`${
                      address.id == orderData?.client?.client_address_id
                        ? "bg-primary/10"
                        : ""
                    } cursor-pointer w-full px-2 py-1 rounded-md border border-border`}
                  >
                    <h1 className="textSmall1">
                      <span>Адрес:</span> {address?.address1}
                    </h1>
                  </div>
                );
              })}
          </div>
        )}
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
