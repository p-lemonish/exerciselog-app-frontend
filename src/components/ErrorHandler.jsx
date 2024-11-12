export function handleApiError(err, logout, navigate) {
  if (err.response) {
    const { status, data } = err.response;

    switch (status) {
      case 400:
        return parseValidationErrors(data);
      case 401:
        logout();
        navigate('/login');
        return 'Unauthorized access. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'A conflict occurred. Please check your input.';
      case 500:
        return 'An internal server error occurred. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  } else {
    return 'Unable to connect to the server. Please check your network connection.';
  }
}

function parseValidationErrors(data) {
  if (typeof data === 'object') {
    return Object.values(data).flat().join(' ');
  }
  return 'Invalid input. Please check your data.';
}
