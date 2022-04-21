import { ITokenList } from 'types';
import avaxMainnet from './avaxMainnet';
import fuji from './fuji';
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
  {
    chainId: 43113,
    list: fuji,
  },
  {
    chainId: 43114,
    list: avaxMainnet,
  },
];

export default tokenLists;
