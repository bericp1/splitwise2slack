module.exports = exports = {
  constructErrorResponse: function(error, message, extra) {
    return {
      status: 'error',
      error: error || 'unknown',
      message: message || 'An unknown error occurred.',
      extra: extra || {}
    };
  }
};