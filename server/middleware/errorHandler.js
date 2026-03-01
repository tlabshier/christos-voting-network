function errorHandler(err, req, res, next) {
  console.error('Server error:', err.message);

  // Claude API specific errors
  const status = err.status || err.statusCode;
  if (status === 429 || status === 529) {
    return res.status(503).json({
      error: {
        code: 'CLAUDE_API_ERROR',
        message: 'Analysis service temporarily unavailable. Please try again later.',
      },
    });
  }

  // JSON parse errors from Claude response
  if (err instanceof SyntaxError && err.message.includes('JSON')) {
    return res.status(502).json({
      error: {
        code: 'ANALYSIS_PARSE_ERROR',
        message: 'Could not parse analysis results. Please try again.',
      },
    });
  }

  // Generic server error
  res.status(500).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : err.message,
    },
  });
}

module.exports = errorHandler;
