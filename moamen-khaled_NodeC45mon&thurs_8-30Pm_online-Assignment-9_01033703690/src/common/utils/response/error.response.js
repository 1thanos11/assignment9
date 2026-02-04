export const globlErrorHandling = (err, req, res, next) => {
  const status = err.cause?.status || 500;

  return res.status(status).json({
    error_msg: err.message || "Internal Server Error",
    ...(err.cause?.extra && { extra: err.cause.extra }),
  });
};

export const ErrorException = ({
  message = "fail",
  cause = undefined,
} = {}) => {
  throw new Error(message, { cause });
};

export const NotFoundException = (message, extra = {}) => {
  return ErrorException({ message, cause: { status: 404, extra } });
};

export const conflictException = (message, extra = {}) => {
  return ErrorException({ message, cause: { status: 409, extra } });
};

export const invalidCredentials = (message, extra = {}) => {
  return ErrorException({ message, cause: { status: 400, extra } });
};
