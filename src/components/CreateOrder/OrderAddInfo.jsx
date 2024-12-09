/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useEvent, useProductStore } from "../../store/event";
import {
  Carousel,
  CarouselContent,
  CarouselCounter,
  CarouselItem,
} from "../ui/carousel";
import ProductItem from "../productItem";
import { Button } from "../ui/button";
import { ChevronLeft, CircleX } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const OrderAddInfo = () => {
  const navigate = useNavigate();
  const { setProducts } = useProductStore();
  const { productsData, categoryData } = useEvent();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const [filterSearchData, setFilterSearchData] = useState([]);

  const topCategory = searchParams.get("topCategory");
  const category = searchParams.get("category");

  const handleAddProduct = (product, modif_product) => {
    setProducts(product, modif_product);
  };

  const handleFocus = () => setSearchFocus(true);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  console.log({ topCategory, category });

  useEffect(() => {
    if (!topCategory) {
      navigate("/create-order?topCategory=true");
    }
    const filterProducts = productsData?.filter((c) => {
      const matchesCategory = +c.menu_category_id === +category;
      return matchesCategory;
    });

    setData(filterProducts);

    const filteredData = [];
    if (typeof searchValue === "string" && searchValue.trim() !== "") {
      for (let i = 0; i < productsData?.length; i++) {
        const product = productsData[i];
        if (
          product?.product_name
            ?.toLowerCase()
            .includes(searchValue.toLowerCase())
        ) {
          filteredData.push(product);
        }
      }
    }
    if (filteredData?.length > 0) {
      setFilterSearchData(filteredData);
    } else {
      setFilterSearchData([]);
    }
  }, [topCategory, category, productsData, categoryData, searchValue]);

  return (
    <aside className="col-span-3 p-4">
      <section className="w-full space-y-2">
        <div className="flex justify-between items-center gap-3 w-full">
          <div className="flex justify-start items-center gap-2">
            {!searchFocus && topCategory && category && (
              <Button
                onClick={() => navigate("/create-order?topCategory=true")}
                className="hover:bg-transparent bg-transparent border text-primary textSmall3 font-medium px-2"
              >
                <ChevronLeft />
              </Button>
            )}
            {!searchFocus && (
              <h1 className="font-bold textNormal4">
                {topCategory && category ? "Товары" : "Категории"}
              </h1>
            )}
          </div>
          <div
            className={`flex pr-2 justify-start items-center gap-1 border-2 border-input rounded-lg shadow-sm bg-white transition-all ${
              searchFocus ? "w-full" : "w-auto"
            }`}
          >
            <div onClick={handleFocus} className="ml-2 cursor-pointer">
              {/* <Image src={searchIcon} alt="search" className="w-8 h-8" /> */}
            </div>
            <input
              onChange={handleChange}
              onFocus={handleFocus}
              type="text"
              value={searchValue}
              placeholder={"Поиск..."}
              className="w-full py-1 focus:outline-none font-medium text-thin border-0 p-0 bg-transparent"
            />
            {(searchValue || searchFocus) && (
              <CircleX
                className="cursor-pointer"
                onClick={() => {
                  setSearchValue("");
                  setSearchFocus(false);
                }}
              />
            )}
          </div>
        </div>
        {searchValue || searchFocus ? (
          <div className="p-2 w-full h-[calc(100vh-165px)] overflow-y-scroll px-2">
            {filterSearchData?.length > 0 ? (
              <>
                {filterSearchData.map((pr, idx) => {
                  const price = pr?.price["1"] / 100;
                  return (
                    <button
                      onClick={() => handleAddProduct(pr)}
                      key={idx}
                      className="py-2 w-full active:shadow-lg transition-all ease-linear duration-100 active:opacity-70 flex justify-between items-center gap-2 border-border border-b-2 rounded-none"
                    >
                      <h1>{pr?.product_name?.split("$")[0]}</h1>
                      <p>{price} сум</p>
                    </button>
                  );
                })}
              </>
            ) : (
              <h1>По запросу ничего не найдено</h1>
            )}
          </div>
        ) : (
          <>
            {/* Categories component */}
            {topCategory && !category && (
              <section className="space-y-4 w-full">
                <Carousel>
                  <CarouselContent className="">
                    {categoryData &&
                      Array.from(
                        { length: Math.ceil(categoryData?.length / 9) },
                        (_, i) => (
                          <CarouselItem
                            key={i}
                            className="overflow-hidden h-[calc(100vh-180px)] flex justify-center items-center w-full"
                          >
                            {/* 9 ta mahsulotdan iborat grid (3x3 layout) */}
                            <section className="grid grid-cols-3 grid-rows-3 gap-4 w-full h-full">
                              {categoryData
                                ?.slice(i * 9, i * 9 + 9)
                                ?.map((item, idx) => {
                                  const name = item.category_name.split("$")[0];
                                  return (
                                    <ProductItem
                                      key={idx}
                                      href={`/create-order?topCategory=true&category=${item.category_id}`}
                                      id={item.id}
                                      title={name}
                                      description="Классические суши от WASSABI"
                                      image={item?.category_photo_origin}
                                      className="w-full h-full flex justify-center items-center"
                                    />
                                  );
                                })}
                            </section>
                          </CarouselItem>
                        )
                      )}
                  </CarouselContent>
                  <CarouselCounter />
                </Carousel>
              </section>
            )}

            {/* Products component */}
            {topCategory && category && (
              <section className="space-y-4 w-full">
                <Carousel>
                  <CarouselContent className="">
                    {data &&
                      Array.from(
                        { length: Math.ceil(data.length / 9) },
                        (_, i) => (
                          <CarouselItem
                            key={i}
                            className="overflow-hidden h-[calc(100vh-180px)] flex justify-center items-center w-full"
                          >
                            {/* 9 items grid layout (3x3 layout) */}
                            <section className="grid grid-cols-3 grid-rows-3 gap-4 w-full h-full">
                              {data
                                ?.slice(i * 9, i * 9 + 9)
                                ?.map((item, idx) => {
                                  const name = item.product_name?.split("$")[0];
                                  return (
                                    <DropdownMenu key={idx}>
                                      <DropdownMenuTrigger asChild>
                                        <button
                                          onClick={() => handleAddProduct(item)}
                                          className={`${
                                            item?.modifications?.length > 0
                                              ? ""
                                              : "active:shadow-lg active:opacity-90"
                                          } relative transition-all ease-linear duration-100`}
                                        >
                                          <ProductItem
                                            href={"none"}
                                            id={item.product_id}
                                            title={name}
                                            image={item?.photo_origin}
                                            description={
                                              "Классические суши от WASSABI"
                                            }
                                            className="w-full h-full flex justify-center items-center"
                                          />
                                        </button>
                                      </DropdownMenuTrigger>
                                      {item?.modifications?.length > 0 && (
                                        <DropdownMenuContent className="">
                                          {item.modifications.map((m, idx) => (
                                            <DropdownMenuItem
                                              className="cursor-pointer"
                                              onClick={() =>
                                                handleAddProduct(m, item)
                                              }
                                              key={idx}
                                            >
                                              {m.modificator_name}
                                            </DropdownMenuItem>
                                          ))}
                                        </DropdownMenuContent>
                                      )}
                                    </DropdownMenu>
                                  );
                                })}
                            </section>
                          </CarouselItem>
                        )
                      )}
                  </CarouselContent>
                  <CarouselCounter />
                </Carousel>
              </section>
            )}
          </>
        )}
      </section>
    </aside>
  );
};

export default OrderAddInfo;
