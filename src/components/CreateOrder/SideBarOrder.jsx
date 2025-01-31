import { useEffect } from "react";
import { useEvent, useProductStore } from "../../store/event";
import Check from "./check";
import Client from "./client";
import { motion } from "framer-motion";
import { orderListData } from "../../utils";
import OrderDialog from "./OrderDialog";

const SideBarOrder = () => {
  const { categoryData, productsData } = useEvent();
  const {  initializeProducts } = useProductStore();
  const { activeTab, setActiveTab } = useEvent();

  const customComponent = (id) => {
    switch (id) {
      case 1:
        return (
          <Check
            categoryData={categoryData}
            productsData={productsData}
          />
        );
      case 2:
        return <Client />;

      default:
        return null;
    }
  };

  useEffect(() => {
    initializeProducts();
  }, []);

  return (
    <div className="col-span-2 relative flex justify-start items-start">
      <aside className="shadow-lg sticky top-10 left-0 h-[calc(100vh-80px)] w-full space-y-2 py-4">
        <section className="w-full flex items-center gap-6 shadow-custom rounded-md p-2">
          {orderListData?.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`${
                activeTab === item.id ? "text-white" : "text-thin shadow-md"
              } transition-all duration-300 ease-linear w-1/2 rounded-[6px] font-bold cursor-pointer relative py-1 flex justify-center items-center gap-[8px]`}
            >
              <h1 className="relative z-10 textSmall2">{item.title}</h1>
              {activeTab === item.id && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-primary rounded-[6px]"
                />
              )}
            </div>
          ))}
        </section>
        {/* Fixed overflow logic */}
        <section className="shadow-custom rounded-t-lg pt-1">
          <div className="overflow-y-auto h-[calc(100vh-240px)]">
            {customComponent(activeTab)}
          </div>
        </section>
        <OrderDialog />
      </aside>
    </div>
  );
};

export default SideBarOrder;
