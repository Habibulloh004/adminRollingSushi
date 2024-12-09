import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { orderCreateInfo, useEvent } from "../../store/event";

const ITEMS_PER_PAGE = 20; // Sahifadagi elementlar soni

const Client = () => {
  let params = useParams();
  const client_id = params.client;
  const { orderData, setOrderData } = orderCreateInfo();
  const { clientData } = useEvent();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Joriy sahifa
  const { searchClientValue } = useEvent();
  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
    setCurrentPage(1); // Qidiruvda sahifani boshidan boshlash
  };
  const handleAddClient = (client) => {
    console.log({ client });
    setOrderData({ ...orderData, client, phone: client?.phone });
  };
  console.log(orderData);

  // Qidiruvga asoslangan filtrlangan ma'lumotlar
  const filteredData = clientData
    ? clientData.filter((c) => {
        return (
          c.phone.toLowerCase().includes(searchText) ||
          c.phone_number
            .toLowerCase()
            .includes(searchText || searchClientValue?.replace("+", "")) ||
          c.firstname.toLowerCase().includes(searchText) ||
          c.lastname.toLowerCase().includes(searchText)
        );
      })
    : [];

  // Hozirgi sahifadagi ma'lumotlarni hisoblash
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (searchClientValue) {
      setSearchText(String(searchClientValue) || "");
    }
  }, [searchClientValue]);

  // Jami sahifalar sonini hisoblash
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  return (
    <main className="space-y-2">
      <div className="w-full h-full relative">
        {/* Qidiruv qutisi */}
        <div className="px-2 py-1 rounded-md sticky top-0 left-0 bg-white w-full flex justify-between items-center gap-2">
          <div className="w-full flex justify-start items-center gap-1 border-2 border-input rounded-lg shadow-sm bg-white">
            <div className="ml-2">
              {/* <Image src={searchIcon} alt="search" className="w-8 h-8" /> */}
            </div>
            <input
              type="text"
              placeholder="Найти клиента"
              onChange={handleSearch}
              value={searchText || ""}
              className=" w-full py-1 outline-none font-medium text-thin border-0 p-0 bg-transparent pr-2"
            />
          </div>
        </div>

        {/* Klientlar roʻyxati */}
        <div className="space-y-1 px-2">
          {paginatedData.map((item, idx) => (
            <button
              onClick={() => handleAddClient(item)}
              key={idx}
              className={`${
                orderData?.client?.client_id == item?.client_id
                  ? "bg-primary text-white rounded-md"
                  : client_id == item?.client_id
                  ? "bg-white text-thin shadow-custom rounded-md"
                  : "text-thin"
              } w-full border-b border-gray-200 px-4 py-2 flex justify-between items-center gap-2`}
            >
              <h1 className="textSmall2 font-bold">
                {item?.firstname + " " + item?.lastname}
              </h1>
              <p className="textSmall2">{item?.phone}</p>
            </button>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4 space-x-2 pb-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Предыдущая
          </button>
          <p className="textSmall2">
            Страница {currentPage} из {totalPages}
          </p>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Следующая
          </button>
        </div>
      </div>
    </main>
  );
};

export default Client;
