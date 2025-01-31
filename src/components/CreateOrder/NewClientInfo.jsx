import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { useEvent } from "../../store/event";

const NewClientInfo = () => {
  const { clientData, setClientData } = useEvent();

  const [formData, setFormData] = useState({
    client_name: "",
    phone: "",
    email: "",
    client_groups_id_client: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [clientGroups, setClientGroups] = useState([]);
  const [errors, setErrors] = useState({
    client_name: "",
    phone: "",
    client_groups_id_client: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when the user starts typing
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Client-side validation
    const newErrors = {};

    if (!formData.client_name)
      newErrors.client_name = "Имя клиента обязательно";
    if (!formData.phone) newErrors.phone = "Телефон обязателен";

    // Validate phone length (must be 12 digits)
    const phone = formData?.phone.replace(/[^\d]/g, "");
    if (phone.length < 12) newErrors.phone = "Телефон должен содержать 12 цифр";

    if (!formData.client_groups_id_client)
      newErrors.client_groups_id_client = "Группа клиента обязательна";

    setErrors(newErrors);

    // If there are errors, stop the submission
    if (Object.keys(newErrors).length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API}/posterCreateClient`,
        {
          ...formData,
          phone: phone,
        }
      );
      console.log(res);
      if (res.data.error == 167  ) {
        setErrors({
          phone: "Этот номер уже существует",
        });
        return null;
      }
      if (res.data.error == 37 ) {
        setErrors({
          phone: "Введите правильный номер",
        });
        return null;
      }
      if (res.data.response) {
        const { data: client } = await axios.get(
          `${import.meta.env.VITE_API}/posterClient/${res.data.response}`
        );
        console.log(client);

        if (client.response[0]) {
          setClientData([client.response[0], ...clientData]);
        }
        setFormData({
          client_name: "",
          phone: "",
          email: "",
          client_groups_id_client: "",
          address: "",
        });
        setErrors({
          client_name: "",
          phone: "",
          client_groups_id_client: "",
        });
        toast.success("Клиент успешно создан!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API}/posterClientGroup`
        );
        setClientGroups(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="mx-auto bg-white p-6 rounded-md shadow-md">
      <div className="flex justify-between items-center gap-2">
        <h2 className="text-2xl font-bold mb-4">Создать нового клиента</h2>
        <NavLink
          to="/create-order?topCategory=true"
          className={"px-2 py-1 rounded-md border-border border-2"}
        >
          Назад в меню
        </NavLink>
      </div>
      <form onSubmit={handleSubmit} className="w-full grid grid-cols-2 gap-2">
        <div className="mb-4">
          <label
            htmlFor="client_name"
            className="block text-sm font-medium text-gray-700"
          >
            Имя клиента (Обязательно)
          </label>
          <input
            type="text"
            id="client_name"
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            className={`mt-1 block w-full px-4 py-2 border ${
              errors.client_name ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:ring-primary focus:border-primary`}
          />
          {errors.client_name && (
            <p className="text-red-500 text-sm">{errors.client_name}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Телефон (Обязательно)
          </label>
          <input
            type="tel" // Change from type="number" to type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`mt-1 block w-full px-4 py-2 border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:ring-primary focus:border-primary`}
            pattern="[0-9]{12}"
            maxLength={12}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Электронная почта
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="client_groups_id_client"
            className="block text-sm font-medium text-gray-700"
          >
            Группа клиента (Обязательно)
          </label>
          <select
            id="client_groups_id_client"
            name="client_groups_id_client"
            value={formData.client_groups_id_client}
            onChange={handleChange}
            className={`mt-1 block w-full px-4 py-2 border ${
              errors.client_groups_id_client
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md shadow-sm focus:ring-primary focus:border-primary`}
          >
            <option value="">Выберите группу</option>
            {clientGroups.map((group, idx) => (
              <option key={idx} value={group?.client_groups_id}>
                {group.client_groups_name}
              </option>
            ))}
          </select>
          {errors.client_groups_id_client && (
            <p className="text-red-500 text-sm">
              {errors.client_groups_id_client}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Адрес
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="col-span-2 w-full py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-400 fill-primary"
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
                <span className="sr-only">Загрузка...</span>
              </div>
            </div>
          ) : (
            "Создать клиента"
          )}
        </button>
      </form>
    </div>
  );
};

export default NewClientInfo;
