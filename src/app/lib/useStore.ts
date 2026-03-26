import { create } from 'zustand';

const useStore = create((set) => ({
  property: {},
  addProperty: (item: any) =>
    set((state: any) => ({
      property: {
        ...state.property,
        ...item,
      },
    })),
}));

export default useStore;
