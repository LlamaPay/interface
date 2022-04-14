import { ITokenList } from 'types';
import kovan from './kovan';
import rinkeby from './rinkeby';

interface ILists {
  chainId: number;
  list: ITokenList[];
}

const tokenLists: ILists[] = [
  {
    chainId: 4,
    list: rinkeby,
  },
  {
    chainId: 42,
    list: kovan,
  },
];

export default tokenLists;
