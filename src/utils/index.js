import axios from "axios";
import { Filial, Orders } from "../assets/index";

export const axiosInstance = axios.create({
  baseURL: "https://vm4983125.25ssd.had.wf:5000",
  headers: {
    "Content-Type": "application/json",
  },
});
export const axiosInstancePoster = axios.create({
  baseURL: "https://dev.joinposter.com/docs/v3/web/spots/getSpots?token=967898:49355888e8e490af3bcca79c5e6b1abf",
  headers: {
    "Content-Type": "application/json",
  },
});
// export const API = "https://vm4983125.25ssd.had.wf:5000";
export const TOKEN = "967898:49355888e8e490af3bcca79c5e6b1abf";

const sideBarItems = [
  {
    id: 1,
    icon: Orders,
    title: "Заказы",
    path: "/orders",
  },
  {
    id: 2,
    icon: Filial,
    title: "Филиалы",
    path: "/branches",
  },
];

const filial = [
  { id: 1, name: "Филиал 1" },
  { id: 2, name: "Филиал 2" },
  { id: 3, name: "Филиал 3" },
];

const process = [
  { id: 1, name: "Все заказы", reqPath: "" },
  { id: 2, name: "Ожидаемые" , reqPath: "accept"},
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
