import { ITokenList } from 'types';
import fuji from './fuji';
import goerli from './goerli';
import kovan from './kovan';
import rinkeby from './rinkeby';

interface ILists {
  [key: number]: ITokenList;
}

const tokenLists: ILists = {
  4: rinkeby,
  42: kovan,
  43113: fuji,
  5: goerli,
};

export default tokenLists;
