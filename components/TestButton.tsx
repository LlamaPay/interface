import useDepositGnosis from 'queries/useDepositGnosis';

export default function TestButton() {
  const { mutate } = useDepositGnosis();

  function yeet() {
    mutate({
      llamaContractAddress: '0xd2cbcc8cd99e6ea70001b6cfb7b983db69286cfa',
      tokenContractAddress: '0x332c7ac34580dfef553b7726549cec7015c4b39b',
      amountToDeposit: '100000000000000000000',
    });
  }

  return (
    <button className="primary-button" onClick={yeet}>
      Pls work
    </button>
  );
}
