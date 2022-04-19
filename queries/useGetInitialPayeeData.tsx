import { IStreamAndHistory } from 'types';
import { useAccount } from 'wagmi';

export default function useGetInitalPayeeData(data: IStreamAndHistory) {
  const [{ data: accountData }] = useAccount();
  const accountAddress = accountData?.address.toLowerCase();
  const newTable: { [key: string]: number } = {};
  data.streams?.forEach((p) => {
    if (accountAddress === p.payerAddress.toLowerCase()) {
      newTable[p.payeeAddress.toLowerCase()] = 0;
    }
  });
  return newTable;
}
