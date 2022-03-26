import { DialogHeader, DialogWrapper, SetIsOpen } from 'components/Dialog';
import { CONTRACT_ADDRESS } from 'utils/constants';
import ethers from 'ethers';

interface Props {
  isOpen: boolean;
  setIsOpen: SetIsOpen;
}

export const Create = ({ isOpen, setIsOpen }: Props) => {
  return (
    <DialogWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
      <DialogHeader title="Create a new stream" setIsOpen={setIsOpen} />
      <form>
        <label>Select Token</label>
        <input></input>
      </form>
    </DialogWrapper>
  );
};
