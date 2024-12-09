import SideBarOrder from "../components/CreateOrder/SideBarOrder";
import OrderAddInfo from "../components/CreateOrder/OrderAddInfo";
import { useEvent } from "../store/event";
import Loader from "../components/loader";

const CreateOrder = () => {
  const { isLoading } = useEvent();
  if (isLoading) {
    return (
      <div className="flex gap-2 mx-auto w-11/12 z-10 justify-center items-center mt-24 mb-40">
        <Loader />
      </div>
    );
  }
  return (
    <main className={"w-full mx-auto grid grid-cols-5 gap-3 pb-10"}>
      <SideBarOrder />
      <OrderAddInfo />
    </main>
  );
};

export default CreateOrder;
