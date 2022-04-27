import * as React from 'react';
import BigNumber from 'bignumber.js';
import { ITokenBalance } from 'queries/useTokenBalances';
import { DisclosureState } from 'ariakit';
import useStreamToken from 'queries/useStreamToken';
import { IFormElements } from 'components/Stream/CreateStream/types';
import { secondsByDuration } from 'utils/constants';
import { useAddressStore } from 'store/address';

export function useCreateStreamForm({ tokens, dialog }: { tokens: ITokenBalance[]; dialog?: DisclosureState }) {
  const { mutate: streamToken, isLoading: confirmingStream, data: transactionDetails } = useStreamToken();

  // store address of the token to stream as ariakit/select is a controlled component
  const [tokenAddress, setTokenAddress] = React.useState(tokens[0]?.tokenAddress ?? '');

  const handleTokenChange = (token: string) => {
    // find the prop in tokens list, prop is the one used to format in tokenOptions above
    const data = tokens?.find((t) => t.name === token);

    if (data) {
      setTokenAddress(data.tokenAddress);
    } else setTokenAddress(token);
  };

  const updateAddress = useAddressStore((state) => state.updateAddress);

  // create stream on submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as typeof e.target & IFormElements;
    const amountToStream = form.amountToStream.value;
    const streamDuration = form.streamDuration?.value;
    const payeeAddress = form.addressToStream?.value;

    // save address to local storage
    const shortName = form.shortName?.value;
    if (shortName && shortName !== '') {
      updateAddress(payeeAddress, shortName);
    }

    const duration = streamDuration === 'year' ? 'year' : 'month';

    if (tokenAddress !== '' && payeeAddress) {
      // check if token exist in all tokens list
      const tokenDetails = tokens.find((t) => t.tokenAddress === tokenAddress) ?? null;

      if (tokenDetails) {
        // format amount to bignumber
        // convert amt to seconds
        const amtPerSec = new BigNumber(amountToStream).times(1e20).div(secondsByDuration[duration]);

        // query mutation
        streamToken(
          {
            method: 'CREATE_STREAM',
            amountPerSec: amtPerSec.toFixed(0),
            payeeAddress: payeeAddress,
            llamaContractAddress: tokenDetails?.llamaContractAddress,
          },
          {
            onSuccess: () => {
              if (dialog) {
                dialog.toggle();
              }
            },
          }
        );
      }
    }
  };

  const tokenOptions = tokens.map((t) => t.tokenAddress);

  return { confirmingStream, transactionDetails, handleTokenChange, handleSubmit, tokenOptions };
}
