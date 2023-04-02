import { Notify } from 'quasar'
import { AxiosError } from 'axios';

export default () => {
  // eslint-disable-next-line
  const toastHandler = (error: any) => {
    let message: string;
    if (error instanceof AxiosError) {
      message = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = error;
    }

    Notify.create({
      message,
      color: 'negative',
      position: 'top',
      icon: 'error',
      actions: [
        {
          color: 'white',
          icon: 'close',
        }
      ],
    });
  }

  return {
    toastHandler
  }
}
