import create from 'zustand';
import { persist } from 'zustand/middleware';

type AddressStore = {
  payeeAddresses: { id: string; shortName: string }[];
  updateAddress: (id: string, shortName: string) => void;
};

export const useAddressStore = create<AddressStore>(
  persist(
    (set) => ({
      payeeAddresses: [{ id: 'llamapay', shortName: '1' }],
      updateAddress: (id: string, shortName: string) =>
        set((state) => {
          const isDuplicate = state.payeeAddresses.find((p) => p.id === id);

          if (isDuplicate) {
            return {
              payeeAddresses: state.payeeAddresses.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      id,
                      shortName,
                    }
                  : item
              ),
            };
          } else {
            return { payeeAddresses: [...state.payeeAddresses, { id, shortName }] };
          }
        }),
    }),
    {
      name: 'payee-addresses', // unique name
    }
  )
);
