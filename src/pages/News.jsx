import axios from "axios";
import { useEffect, useState } from "react";

function News() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
  });
  const [news, setNews] = useState([]);

  const fetchNews = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_API}/getNews`);
    console.log(data);
    setNews(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API}/createNews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the form");
      }

      const data = await response.json();
      console.log("Server response:", data);
      setFormData({ title: "", subTitle: "" }); // Reset form
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = (id) => {
    setNews((prev) => prev.filter((item) => item._id !== id));
    axios.delete(`${import.meta.env.VITE_API}/deleteNews/${id}`);
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
          onClick={() => {
            setOpen((prev) => !prev);
          }}
        >
          Создать
        </li>
        <li
          className={`py-2 cursor-pointer px-4 rounded-md ${
            !open ? "bg-white/50" : "bg-primary/90 text-white"
          }`}
          onClick={() => {
            setOpen((prev) => !prev);
          }}
        >
          Смотреть
        </li>
      </ul>
      {!open ? (
        <div className="w-1/2 p-4 border border-gray-300 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-4">Отправить данные</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium" htmlFor="title">
                Заголовок
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block mb-1 text-sm font-medium"
                htmlFor="subTitle"
              >
                Подзаголовок
              </label>
              <textarea
                id="subTitle"
                name="subTitle"
                value={formData.subTitle}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              ></textarea>
            </div>

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
          <table className="min-w-full bg-white border border-gray-200 shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-600 border-b">
                  Заголовок
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-600 border-b">
                  Подзаголовок
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-600 border-b">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {news.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800 border-b">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 border-b">
                    {item.subTitle}
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
              {news.length == 0 && (
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
