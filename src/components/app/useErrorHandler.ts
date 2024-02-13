import { Notify } from 'quasar'
import { AxiosError } from 'axios';

export default () => {
  // eslint-disable-next-line
  const toastHandler = async (error: any) => {
    let message: string;
    if (error instanceof Response) {
      if (error.status == 400) {
        const response = await error.json();
        const errors = response.errors;
        message = Object.keys(errors).map((key) => {
          return errors[key].join(', ');
        }).join(' ');
      } else {
        message = error.statusText;
      }
    } else if (error instanceof AxiosError) {
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
