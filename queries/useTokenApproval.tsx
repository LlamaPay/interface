import { useMutation } from 'react-query';
import { checkHasApprovedEnough, ICheckTokenAllowance } from 'utils/tokenUtils';

const approveToken = async (data: ICheckTokenAllowance) => {
  console.log(data.approvedForAmount);
  try {
    const { res, err } = await checkHasApprovedEnough(data);
    console.log(res, err);
    if (err) {
      return false;
    } else return res;
  } catch (error) {
    return false;
  }
};

function useTokenApproval() {
  return useMutation((data: ICheckTokenAllowance) => approveToken(data));
}

export default useTokenApproval;
