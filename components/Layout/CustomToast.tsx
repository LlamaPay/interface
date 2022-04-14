import { Toaster } from 'react-hot-toast';

export const CustomToast = () => {
  return (
    <Toaster
      toastOptions={{
        success: {
          style: {
            background: '#008000',
            color: 'white',
          },
        },
        error: {
          style: {
            background: '#FF0000',
            color: 'white',
          },
        },
        loading: {
          style: {
            background: '#0066ff',
            color: 'white',
          },
        },
      }}
    />
  );
};
