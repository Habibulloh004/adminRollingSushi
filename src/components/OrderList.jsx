import { formatPhoneNumber, formatPhoneNumber2 } from "../utils";
import { Link } from "react-router-dom";


// eslint-disable-next-line react/prop-types
const OrderList = ({ orders }) => {
  const tableHead = ["Номер телефона", "Адрес Доставки"];

  return (
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
        {orders?.map((item, idx) => (
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
  );
};

export default OrderList;
