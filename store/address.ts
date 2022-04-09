// import create from 'zustand';
// import { persist } from 'zustand/middleware';

// type AddressStore = {
//   payeeAddresses: { id: string; shortName: string }[];
//   updateAddress: (id: string, shortName: string) => void;
// };

// export const useAddressStore = create<AddressStore>(
//   persist(
//     (set) => ({
//       payeeAddresses: [],
//       updateAddress: (id: string, shortName: string) =>
//         set((state) => ({ payeeAddresses: [...state.payeeAddresses, { id, shortName }] })),
//     }),
//     {
//       name: 'payee-addresses', // unique name
//     }
//   )
// );

export const useAddressStore = () => {
  return null;
};
