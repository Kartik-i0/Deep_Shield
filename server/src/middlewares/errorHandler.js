export function errorHandler(err, req, res, next) {
  console.error('[DeepShield Error]', err);

  const statusCode = err.statusCode || (err.name === 'MulterError' ? 400 : 500);
  const message = err.message || 'An unexpected internal server error occurred.';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      type: err.name || 'Error',
      code: err.code || 'INTERNAL_ERROR',
    },
  });
}

