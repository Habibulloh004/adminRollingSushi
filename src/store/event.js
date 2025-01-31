import { create } from "zustand";

export const useEvent = create((set) => ({
  productsData: [],
  categoryData: [],
  spotsData: [],
  clientData: [],
  activeTab: 1,
  isLoading: true,
  setActiveTab: (data) => set(() => ({ activeTab: data ? data : 1 })),
  setProductsData: (data) => set(() => ({ productsData: data })),
  setCategoryData: (data) => set(() => ({ categoryData: data })),
  setClientData: (data) => set(() => ({ clientData: data })),
  setSpotsData: (data) => set(() => ({ spotsData: data })),
  setIsLoading: (data) => set(() => ({ isLoading: data })),
}));

export const orderCreateInfo = create((set) => ({
  orderData: {
    spot_id: 0,
    phone: "",
    products: [],
    service_mode: 3,
    total: 0,
    client: null,
    pay_bonus:0,
    pay_sum: 0,
  },
  setOrderData: (data) => set(() => ({ orderData: data })),
}));

export const useProductStore = create((set) => ({
  products: [],
  initializeProducts: () => {
    const savedProducts = localStorage.getItem("products");
    const parsedProducts = savedProducts ? JSON.parse(savedProducts) : [];
    set({ products: parsedProducts });
  },
  setProductsData: (data) =>
    set(() => {
      localStorage.setItem("products", JSON.stringify(data));
      return {
        products: data,
      };
    }),
  setProducts: (data, product) =>
    set((state) => {
      state.initializeProducts();
      let updatedProducts;
      //modificator count
      if (product?.product_id) {
        // Find the product by ID in the state
        const findProduct = state.products.find(
          (p) => p.product_id === product.product_id
        );

        if (findProduct) {
          const hasModificator = findProduct.modifications.some(
            (mod) => mod.modificator_id == data?.modificator_id
          );

          updatedProducts = state.products.map((p) =>
            p.product_id === product.product_id
              ? {
                  ...p,
                  modifications: hasModificator
                    ? p.modifications.map((mod) =>
                        mod.modificator_id == data.modificator_id
                          ? { ...mod, count: mod.count + 1 }
                          : mod
                      )
                    : [...p.modifications, { ...data, count: 1 }],
                }
              : p
          );
        } else {
          // Product not found, add it with the modificator
          updatedProducts = [
            ...state.products,
            { ...product, count: 1, modifications: [{ ...data, count: 1 }] },
          ];
        }
      } else {
        //product count
        updatedProducts = state.products.some(
          (p) => p.product_id === data.product_id
        )
          ? state.products.map((p) =>
              p.product_id === data.product_id
                ? { ...p, count: p.count + 1 }
                : p
            )
          : [...state.products, { ...data, count: 1 }];
      }

      localStorage.setItem("products", JSON.stringify(updatedProducts));
      return { products: updatedProducts };
    }),

  incrementCount: (product_id, modif_id) =>
    set((state) => {
      if (product_id && !modif_id) {
        let updatedProducts = state.products.map((product) =>
          product.product_id === product_id
            ? { ...product, count: product.count + 1 }
            : product
        );

        localStorage.setItem("products", JSON.stringify(updatedProducts));
        return { products: updatedProducts };
      }
      if (product_id && modif_id) {
        const findProduct = state.products.find(
          (p) => p.product_id === product_id
        );
        if (findProduct) {
          const findModificator = findProduct.modifications.find(
            (mod) => mod.modificator_id === modif_id
          );
          if (findModificator) {
            const updatedModifications = findProduct.modifications.map((mod) =>
              mod.modificator_id === modif_id
                ? { ...mod, count: mod.count + 1 }
                : mod
            );
            localStorage.setItem(
              "products",
              JSON.stringify(
                state.products.map((p) =>
                  p.product_id === product_id
                    ? { ...p, modifications: updatedModifications }
                    : p
                )
              )
            );
            return {
              products: state.products.map((p) =>
                p.product_id === product_id
                  ? { ...p, modifications: updatedModifications }
                  : p
              ),
            };
          }
        }
      }
    }),
  decrementCount: (product_id, modif_id) =>
    set((state) => {
      if (product_id && !modif_id) {
        let updatedProducts = state.products
          .map((product) =>
            product?.product_id === product_id && product.count > 0
              ? { ...product, count: product.count - 1 }
              : product
          )
          .filter((product) => product?.count > 0);

        localStorage.setItem("products", JSON.stringify(updatedProducts));
        return { products: updatedProducts };
      }

      if (product_id && modif_id) {
        const updatedProducts = state.products.map((product) => {
          if (product?.product_id === product_id) {
            const updatedModifications = product.modifications
              .map((mod) =>
                mod?.modificator_id === modif_id && mod.count > 0
                  ? { ...mod, count: mod.count - 1 }
                  : mod
              )
              .filter((mod) => mod.count > 0);

            if (product.count > 0 || updatedModifications.length > 0) {
              return { ...product, modifications: updatedModifications };
            }
            return null;
          }
          return product;
        });

        let finalProducts = updatedProducts
          .map((product) => {
            if (product?.modifications?.length === 0) {
              return null;
            }
            return product;
          })
          .filter((p) => p !== null);

        localStorage.setItem("products", JSON.stringify(finalProducts));
        return { products: finalProducts };
      }
    }),
  resetProduct: () => set(() => ({ products: [] })),
}));
