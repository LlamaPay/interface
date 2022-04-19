import { useGetNativeBalance } from 'queries/useGetNativeBalance';

interface PayeeBalanceProps {
  id: string;
}

export default function PayeeBalance({ id }: PayeeBalanceProps) {
  return useGetNativeBalance(id);
}
