import { API_URL } from './constants';
import { createClient } from 'urql';

const client = createClient({
  url: API_URL,
});

export default client;
