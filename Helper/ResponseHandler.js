async function responseHandler(res, success, message, data ){
    res.status(statusCode).json({
        success,
        message,
        error: {
          statusCode,
          message,
          error,
        },
      });
}

module.exports = responseHandler;