import { networkDetails } from '~/lib/networkDetails';
import { chains } from '~/lib/chains';

export function chainDetails(chainId: unknown) {
  if (typeof chainId !== 'string') return {};

  const id = Number(chainId);

  // handle routes like /salaries/ethereum/0x1234... & /salaries/1/0x1234
  if (Number.isNaN(id)) {
    const chain = chains.find((c) => c.name?.toLowerCase() === chainId.toLowerCase());
    const network = chain && networkDetails[chain?.id];
    return { network, chain };
  } else {
    const network = networkDetails[id];
    const chain = chains.find((c) => c.id === id);
    return { network, chain };
  }
}
