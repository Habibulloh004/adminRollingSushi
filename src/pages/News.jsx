import { useState } from "react";

function News() {
  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
  });

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

  return (
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
          <label className="block mb-1 text-sm font-medium" htmlFor="subTitle">
            Подзаголовок
          </label>
          <input
            type="text"
            id="subTitle"
            name="subTitle"
            value={formData.subTitle}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* <div className="mb-4">
          <label className="block mb-1 text-sm font-medium" htmlFor="text">
            Текст
          </label>
          <textarea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            rows="4"
          />
        </div> */}

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90"
        >
          Отправить
        </button>
      </form>
    </div>
  );
}

export default News;
