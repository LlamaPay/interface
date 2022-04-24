import Cookies from 'js-cookie';

export const NO_BANNER = 'noBanner';

export const closeBanner = () => {
  Cookies.set(NO_BANNER, 'true', { expires: 2628000000 }); // 1 month
};
