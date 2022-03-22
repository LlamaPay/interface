import { useQuery } from 'urql';

export const query = `
    query {
      llamaPayFactories(first: 5) {
        id
        count
        address
        createdTimestamp
      }
      llamaPayContracts(first: 5) {
        id
        address
        factory {
        id
        }
        token
      }
    }
`;

const useFactoriesAndContracts = () => {
  const [result] = useQuery({
    query,
  });

  return result;
};

export default useFactoriesAndContracts;
