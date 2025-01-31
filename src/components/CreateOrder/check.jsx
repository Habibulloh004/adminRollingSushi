import { Minus, Plus } from "lucide-react";
import React from "react";
import { useProductStore } from "../../store/event";
import { truncateText } from "../../utils";

const Check = () => {
  const { incrementCount, decrementCount, products } = useProductStore();

  return (
    <main className="p-3">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-thin px-2 textSmall1 py-1 text-left">
              Наименование
            </th>
            <th className="text-thin px-2 textSmall1 py-1 text-center">
              Кол-во
            </th>
            <th className="text-thin px-2 textSmall1 py-1 text-right">
              Цена (сум)
            </th>
            <th className="text-thin px-2 textSmall1 py-1 text-right">
              Итого (сум)
            </th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            <>
              {products
                ?.slice()
                ?.reverse()
                ?.map((item, index) => {
                  const renderRow = (
                    name,
                    count,
                    product_id,
                    modif_id,
                    price
                  ) => {
                    const orgTitle = name?.split("$")[0];
                    return (
                      <tr key={`${index}-${name}`} className="border-b">
                        <td className="min-w-32 max-w-32 text-foreground px-2 py-1 textSmall2 text-left">
                          <h1 className="w-full">
                            {truncateText(orgTitle, 50)}
                          </h1>
                        </td>
                        <td className="text-thin px-2 py-1 textSmall2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                incrementCount(
                                  product_id,
                                  modif_id && modif_id
                                );
                              }}
                              className="p-1 text-primary hover:bg-border rounded-full shadow-md 
              active:bg-gray-100 transition-all ease-linear duration-100"
                            >
                              <Plus size={18} />
                            </button>
                            <h1 className="min-w-4">{count}</h1>
                            <button
                              onClick={() =>
                                decrementCount(product_id, modif_id && modif_id)
                              }
                              className="p-1 text-primary hover:bg-border rounded-full shadow-md 
              active:bg-gray-100 transition-all ease-linear duration-100"
                            >
                              <Minus size={18} />
                            </button>
                          </div>
                        </td>

                        <td className="text-thin px-2 py-1 textSmall2 text-right">
                          <h1 className=""> {price} </h1>
                          сум
                        </td>
                        <td className="text-thin px-2 py-1 textSmall2 text-right">
                          <h1>{price * count}</h1>
                          сум
                        </td>
                      </tr>
                    );
                  };

                  if (item?.modifications?.length > 0) {
                    return (
                      <React.Fragment key={index}>
                        {item.modifications.map((m) =>
                          renderRow(
                            `${item?.product_name} ${m?.modificator_name}`,
                            m?.count,
                            item?.product_id,
                            m?.modificator_id,
                            Number(m?.spots[0]?.price) / 100
                          )
                        )}
                      </React.Fragment>
                    );
                  } else {
                    return renderRow(
                      item?.product_name,
                      item?.count,
                      item?.product_id,
                      0,
                      Number(item?.price["1"]) / 100
                    );
                  }
                })}
            </>
          ) : (
            <tr>
              <td
                colSpan="4"
                className="text-foreground text-center textSmall2 py-1"
              >
                Товары недоступны
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
};
export default Check;
