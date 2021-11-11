export const notFoundHandler = (err , req, res, next) => {
  if (err.status === 404) {
    res.status(err.status).send({
      status: 404,
      error: 'Not found',
      message: 'The requested resource could not be found',
    });
      
  } else {
      next(err);
  }
};

export const badRequestHandler = (err , req, res, next) => {
  if (err.status === 400 || err.name === 'ValidationError') {
    res.status(err.status).send({
      status: 400,
      error: 'Bad request',
      message: 'The request could not be understood by the server due to malformed syntax',
    });
      
  } else {
      next(err);
  }
};

export const genericErrorHandler = (err , req, res, next) => {
  res.status(err.status || 500).send({
    status: err.status || 500,
    error: err.name || 'Internal server error',
    message: err.message || 'Something went wrong',
  });
};

