import axios from 'axios';

type ApiErrorDetails = {
  field?: string;
  message?: string;
};

type ApiErrorPayload = {
  message?: string;
  details?: ApiErrorDetails[];
};

export function getErrorMessage(
  error: unknown,
  fallback = 'Ocurrió un error inesperado.',
) {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    const details = error.response?.data?.details
      ?.map(detail => detail.message)
      .filter((message): message is string => Boolean(message));

    if (details && details.length > 0) {
      return details.join('\n');
    }

    return error.response?.data?.message ?? error.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
