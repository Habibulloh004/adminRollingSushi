import { ChevronRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { truncateText } from "../utils";

export default function ProductItem(props) {
  // eslint-disable-next-line react/prop-types
  const { title, href, image } = props;
  // eslint-disable-next-line react/prop-types
  const orgTitle = title.split("***")[0];
  const navigate = useNavigate();
  const imageUrl = image
    ? `https://joinposter.com${image}`
    : "https://img.taste.com.au/lNnNoTvU/taste/2010/01/sushi-187034-1.jpg";
  return (
    <>
      {href == "none" ? (
        <main className="h-full bg-white shadow-md p-4 rounded-md space-y-2 flex flex-col justify-between items-between">
          <div className="cursor-pointer flex justify-between items-between gap-2">
            <h1 className="font-bold textNormal1 text-start">
              {truncateText(title, 30)}
            </h1>
            <Plus className="text-gray-500" />
          </div>
          <div className="relative w-full min-h-20 h-full">
            <img
              className={" object-cover h-full w-full"}
              src={imageUrl}
              alt={"img"}
            />
          </div>
        </main>
      ) : (
        <div
          onClick={() => navigate(href)}
          className="bg-white p-4 rounded-md shadow-md space-y-2 flex flex-col justify-between items-between"
        >
          <div className="cursor-pointer flex justify-between items-between gap-2">
            <h1 className="font-bold textNormal1 text-start">
              {truncateText(orgTitle, 30)}
            </h1>
            <div className="w-4">
              <ChevronRight className="text-gray-500" />
            </div>
          </div>
          <div className="relative w-full min-h-20 h-full">
            <img
              className={"object-cover h-full w-full"}
              src={imageUrl}
              alt={"img"}
            />
          </div>
        </div>
      )}
    </>
  );
}
