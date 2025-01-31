import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function News() {
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Выбранный язык
  const [formData, setFormData] = useState({
    en: { title: "", body: "" },
    ru: { title: "", body: "" },
    uz: { title: "", body: "" },
  });

  const [news, setNews] = useState([]);

  const fetchNews = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_API}/getNews`);
    setNews(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Отправка данных:", formData);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/createNews`,
        formData
      );
      console.log("Server response:", response.data);
      setFormData({
        en: { title: "", body: "" },
        ru: { title: "", body: "" },
        uz: { title: "", body: "" },
      });
      fetchNews(); // Перезагрузка новостей после отправки
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);
    }
  };

  const handleDelete = async (id) => {
    setNews((prev) => prev.filter((item) => item._id !== id));
    const res = await axios.delete(
      `${import.meta.env.VITE_API}/deleteNews/${id}`
    );
    console.log(res);
    if (res.status == 200) {
      toast.success("Уведомление успешно удалено!");
      return;
    }
    toast.error("Что-то пошло не так! Попробуйте еще раз!");
  };

  useEffect(() => {
    fetchNews();
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
          Создать
        </li>
        <li
          className={`py-2 cursor-pointer px-4 rounded-md ${
            !open ? "bg-white/50" : "bg-primary/90 text-white"
          }`}
          onClick={() => setOpen(true)}
        >
          Смотреть
        </li>
      </ul>

      {!open ? (
        <div className="w-1/2 p-4 border border-gray-300 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-4">Отправить данные</h2>
          <form onSubmit={handleSubmit}>
            {["uz", "ru", "en"].map((lang) => (
              <div key={lang}>
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium">
                    Title ({lang.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={formData[lang].title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [lang]: { ...prev[lang], title: e.target.value },
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium">
                    Body ({lang.toUpperCase()})
                  </label>
                  <textarea
                    value={formData[lang].body}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [lang]: { ...prev[lang], body: e.target.value },
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  ></textarea>
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90"
            >
              Отправить
            </button>
          </form>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Выбор языка */}
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
                  Тело
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-600 border-b">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800 border-b">
                    {item[selectedLanguage]?.title || "Нет данных"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 border-b">
                    {item[selectedLanguage]?.body || "Нет данных"}
                  </td>
                  <td className="px-6 py-4 text-center border-b">
                    <button
                      className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
                      onClick={() => handleDelete(item._id)}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
              {news.length === 0 && (
                <tr>
                  <td className="text-center py-2 text-sm" colSpan={3}>
                    Больше данных нет
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

export default News;
