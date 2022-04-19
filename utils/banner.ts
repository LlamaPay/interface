import Cookies from 'js-cookie';

export const NO_BANNER = 'noBanner';

export const closeBanner = () => {
  Cookies.set(NO_BANNER, 'true', { expires: 60 * 60 * 24 * 7 }); // 1 week
};
