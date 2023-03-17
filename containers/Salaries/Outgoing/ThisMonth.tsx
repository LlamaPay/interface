import { Box } from '../../common/Box';

export function ThisMonth({ userAddress, chainId }: { userAddress: string; chainId: number }) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-exo text-3xl font-extrabold">This Month</h1>
      <Box className="min-h-[338px]"></Box>
    </div>
  );
}
