import { Notify } from 'quasar'
import { AxiosError } from 'axios';

export default () => {
  const toastHandler = async (error: any) => {
    let message: string;
    if (error instanceof Response) {
      if (error.status >= 400 && error.status < 500) {
        const response = await error.json();
        const errors = response.errors;
        const errorMessage = response.errorMessage;
        if (errors && errors.length > 0) {
          message = Object.keys(errors)
            .map((key) => {
              return errors[key].join(', ');
            })
            .join(' ');
        } else if (errorMessage && typeof errorMessage === 'string') {
          message = errorMessage;
        } else {
          message = 'システムエラー'
        }
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
