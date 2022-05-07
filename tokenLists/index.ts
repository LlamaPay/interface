import { ITokenList } from 'types';
import fuji from './fuji';
import kovan from './kovan';
import rinkeby from './rinkeby';

interface ILists {
  [key: number]: ITokenList;
}

const tokenLists: ILists = {
  4: rinkeby,
  42: kovan,
  43113: fuji,
};

export default tokenLists;
