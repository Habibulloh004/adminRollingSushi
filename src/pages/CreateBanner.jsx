import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function CreateBanner() {
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Selected language
  const [banners, setBanners] = useState([]);
  const [formData, setFormData] = useState({
    file: null, // For banner image
    lang: "en", // Language for title and description
    path: "", // Default path, now editable
    title: "",
    subtitle: "news",
    description: "", // Rich text will be stored as plain text here for simplicity
  });

  const fetchBanners = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACK}/banner/get_banners`
      );
      setBanners(data?.banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDescriptionChange = (e) => {
    setFormData({ ...formData, description: e });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sendData = new FormData();
    sendData.append("file", formData.file);
    sendData.append("lang", formData.lang);
    sendData.append("path", formData.path);
    sendData.append("title", formData.title);
    sendData.append("subtitle", formData.subtitle);
    sendData.append("description", formData.description);

    const requestOptions = {
      method: "POST",
      body: sendData,
      redirect: "follow",
      mode: "no-cors",
    };

    fetch(`${import.meta.env.VITE_BACK}/banner/add_banner`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setFormData({
          file: null,
          lang: "en",
          path: "/category",
          title: "",
          subtitle: "",
          description: "",
        });
        fetchBanners(); // Refresh banners after upload
        toast.success("Banner successfully uploaded!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Something went wrong! Please try again.");
      });

    // try {
    //   const response = await axios.post(
    //     `${import.meta.env.VITE_BACK}/banner/add_banner`,
    //     JSON.stringify(sendData),
    //     {
    //       headers: {
    //         "Content-Type": "multipart/form-data"
    //       },
    //     }
    //   );
    //   console.log("Server response:", response.data);
    //   //   setFormData({
    //   //     file: null,
    //   //     lang: "en",
    //   //     path: "/category",
    //   //     title: "",
    //   //     subtitle: "",
    //   //     description: "",
    //   //   });
    //   fetchBanners(); // Refresh banners after upload
    //   toast.success("Banner successfully uploaded!");
    // } catch (error) {
    //   console.error("Error uploading banner:", error);
    //   toast.error("Something went wrong! Please try again.");
    // }
  };

  const handleDelete = async (id) => {
    const requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };

    fetch(
      `${import.meta.env.VITE_API}/banner/delete_banner/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setBanners((prev) => prev.filter((banner) => banner.id !== id)); // Using 'id' instead of '_id' based on your data
        toast.success("Banner successfully deleted!");
      })
      .catch((error) => {
        console.error(error);

        toast.error("Something went wrong! Please try again.");
      });
    // try {
    //   // const res = await axios.delete(
    //   //   `${import.meta.env.VITE_API}/banner/delete_banner/${id}`
    //   // );
    // } catch (error) {
    //   console.error("Error deleting banner:", error);
    // }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <>
      <ul className="flex gap-5 items-center my-3 mb-5">
        <li
          className={`py-2 cursor-pointer px-4 rounded-md ${
            open ? "bg-white/50" : "bg-primary/90 text-white"
          }`}
          onClick={() => setOpen(false)}
        >
          Загрузить
        </li>
        <li
          className={`py-2 cursor-pointer px-4 rounded-md ${
            !open ? "bg-white/50" : "bg-primary/90 text-white"
          }`}
          onClick={() => {
            setOpen(true);
            fetchBanners();
          }}
        >
          Просмотреть
        </li>
      </ul>

      {!open ? (
        <div className="w-1/2 p-4 border border-gray-300 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-4">Загрузить баннер</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">
                Изображение баннера
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Язык</label>
              <select
                name="lang"
                value={formData.lang}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="en">EN</option>
                <option value="ru">RU</option>
                <option value="uz">UZ</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Путь</label>
              <input
                type="text"
                name="path"
                value={formData.path}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="/category"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">
                Заголовок
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">
                Подзаголовок
              </label>
              <select
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="news">Новости</option>
                <option value="discount">Скидка</option>
                <option value="promotion">Акция</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Описание</label>
              <ReactQuill
                value={formData.description}
                onChange={handleDescriptionChange}
                className="bg-white"
                theme="snow"
                defaultValue={formData.description}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90"
            >
              Загрузить баннер
            </button>
          </form>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex justify-end items-center mb-2">
            <label className="text-sm font-medium mr-2">Выбрать язык:</label>
            <select
              className="border border-gray-300 rounded p-1"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="en">EN</option>
              <option value="ru">RU</option>
              <option value="uz">UZ</option>
            </select>
          </div>

          <table className="min-w-full bg-white border border-gray-200 shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-600 border-b">
                  Заголовок
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-600 border-b">
                  Описание
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-600 border-b">
                  Подзаголовок
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-600 border-b">
                  Дата создания
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-600 border-b">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {banners &&
                banners.map((banner) => {
                  if (banner.lang != selectedLanguage) return;

                  return (
                    <tr key={banner.id} className="hover:bg-gray-50">
                      <td className="px-2 py-4 text-sm text-gray-800 border-b">
                        {banner.title || "Нет данных"}
                      </td>
                      <td className="px-2 py-4 text-xs text-gray-800 border-b">
                        {banner.description || "Нет данных"}
                      </td>
                      <td className="px-2 py-4 text-sm text-gray-800 border-b">
                        {banner.subtitle || "Нет данных"}
                      </td>
                      <td className="px-2 py-4 text-sm text-gray-800 border-b">
                        {banner.createdAt || "Нет данных"}
                      </td>
                      <td className="px-2 py-4 text-center border-b">
                        <button
                          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
                          onClick={() => handleDelete(banner.id)}
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  );
                })}
              {banners.length === 0 && (
                <tr>
                  <td className="text-center py-2 text-sm" colSpan={4}>
                    Баннеров нет
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default CreateBanner;
