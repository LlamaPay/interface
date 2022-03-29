import { useMutation } from 'react-query';
import { checkHasApprovedEnough, ICheckTokenAllowance } from 'utils/tokenUtils';

const checkApproval = async (data: ICheckTokenAllowance) => {
  try {
    const { res, err } = await checkHasApprovedEnough(data);
    if (err) {
      return false;
    } else return res;
  } catch (error) {
    return false;
  }
};

function useTokenApproval() {
  return useMutation((data: ICheckTokenAllowance) => checkApproval(data));
}

export default useTokenApproval;
