import axios from "axios";
import { Filial, Orders } from "../assets/index";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API,
  headers: {
    "Content-Type": "application/json",
  },
});
export const axiosInstancePoster = axios.create({
  baseURL:
    "https://dev.joinposter.com/docs/v3/web/spots/getSpots?token=967898:49355888e8e490af3bcca79c5e6b1abf",
  headers: {
    "Content-Type": "application/json",
  },
});
// export const API = "        ";
export const TOKEN = "967898:49355888e8e490af3bcca79c5e6b1abf";

const sideBarItems = [
  {
    id: 1,
    icon: Orders,
    title: "Заказы",
    path: "/",
  },
  {
    id: 2,
    icon: Filial,
    title: "Филиалы",
    path: "/branches",
  },
  {
    id: 3,
    icon: "https://img.icons8.com/ios7/512w/FFFFFF/newspaper-.png",
    title: "Рассылка",
    path: "/news",
  },
  {
    id: 4,
    icon: "https://www.nicepng.com/png/full/334-3345112_create-an-inventory-add-property-icon-png.png",
    title: "Создать заказ",
    path: "/create-order",
  },
];

const filial = [
  { id: 1, name: "Филиал 1" },
  { id: 2, name: "Филиал 2" },
  { id: 3, name: "Филиал 3" },
];

const process = [
  { id: 1, name: "Все заказы", reqPath: "" },
  { id: 2, name: "Ожидаемые", reqPath: "accept" },
  { id: 4, name: "Готовится", reqPath: "cooking" },
  { id: 5, name: "Доставляется", reqPath: "delivery" },
  { id: 6, name: "Завершенные", reqPath: "finished" },
];

const orderProcess = [
  {
    id: 1,
    name: "Ожидается",
  },
  {
    id: 2,
    name: "Выполняется",
  },
  {
    id: 3,
    name: "Готовиться",
  },
  {
    id: 4,
    name: "Доставляется",
  },
  {
    id: 5,
    name: "Завершённые",
  },
];

const users = [
  { login: "yakkasaroyAdmin01", password: "yakkasaroyPassword01" },
  { login: "olmazorAdmin02", password: "olmazorPassword02" },
  { login: "mirzoulugbekAdmin03", password: "mirzoulugbekPassword03" },
];
export const orderListData = [
  {
    id: 1,
    title: "Чек",
  },
  {
    id: 2,
    title: "Клиент",
  },
];

export const authenticateUser = (login, password) => {
  const user = users.find(
    (user) => user.login === login && user.password === password
  );
  return user ? user : null;
};

export { filial, sideBarItems, process, orderProcess };

export const f = new Intl.NumberFormat("en-EN").format;

export function formatPhoneNumber(phoneNumber) {
  const numericPhoneNumber = phoneNumber.replace(/\D/g, "");

  const formattedPhoneNumber = `+${numericPhoneNumber.slice(
    0,
    3
  )} (${numericPhoneNumber.slice(3, 5)}) ${numericPhoneNumber.slice(
    5,
    8
  )}-${numericPhoneNumber.slice(8, 10)}-${numericPhoneNumber.slice(10)}`;

  return formattedPhoneNumber;
}

export function formatPhoneNumber2(phoneNumber) {
  if (!phoneNumber || phoneNumber.length == 9 || !phoneNumber.match(/^\d+$/)) {
    return phoneNumber; // Return original number if invalid
  }
  phoneNumber.trim();
  const countryCode = "+998";
  const firstPart = phoneNumber.slice(0, 2);
  const secondPart = phoneNumber.slice(3, 6);
  const thirdPart = phoneNumber.slice(6, 8);
  const fourthPart = phoneNumber.slice(8, 10);

  return `${countryCode} (${firstPart}) ${secondPart}-${thirdPart}-${fourthPart}`;
}
export function truncateText(text, maxLength) {
  if (text?.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
