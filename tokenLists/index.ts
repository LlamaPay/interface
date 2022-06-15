import { ITokenList } from 'types';
import fuji from './fuji';
import kovan from './kovan';
import meter from './meter';
import rinkeby from './rinkeby';

interface ILists {
  [key: number]: ITokenList;
}

const tokenLists: ILists = {
  4: rinkeby,
  42: kovan,
  43113: fuji,
  82: meter,
};

export default tokenLists;
