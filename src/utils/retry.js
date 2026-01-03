// Retry utility with exponential backoff for network requests
const axios = require('axios');

/**
 * Retry configuration options
 * @typedef {Object} RetryOptions
 * @property {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @property {number} initialDelay - Initial delay in milliseconds (default: 1000)
 * @property {number} maxDelay - Maximum delay in milliseconds (default: 10000)
 * @property {number} backoffMultiplier - Multiplier for exponential backoff (default: 2)
 * @property {Function} shouldRetry - Function to determine if error should be retried (default: retries on network/timeout errors)
 * @property {Function} onRetry - Optional callback called before each retry
 */

/**
 * Default retry predicate - retries on network errors, timeouts, and 5xx errors
 */
function defaultShouldRetry(error) {
  if (!error) return false;
  
  // Network errors (ECONNRESET, ENOTFOUND, ETIMEDOUT, etc.)
  if (error.code && ['ECONNRESET', 'ENOTFOUND', 'ETIMEDOUT', 'ECONNREFUSED', 'EAI_AGAIN'].includes(error.code)) {
    return true;
  }
  
  // Axios timeout
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return true;
  }
  
  // 5xx server errors (retryable)
  if (error.response) {
    const status = error.response.status;
    if (status >= 500 && status < 600) {
      return true;
    }
  }
  
  // 429 Too Many Requests
  if (error.response?.status === 429) {
    return true;
  }
  
  return false;
}

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateDelay(attempt, initialDelay, maxDelay, backoffMultiplier) {
  const exponentialDelay = initialDelay * Math.pow(backoffMultiplier, attempt);
  const jitter = Math.random() * 0.3 * exponentialDelay; // Add up to 30% jitter
  return Math.min(exponentialDelay + jitter, maxDelay);
}

/**
 * Retry an async function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {RetryOptions} options - Retry configuration
 * @returns {Promise} Result of the function
 */
async function retryWithBackoff(fn, options = {}) {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    shouldRetry = defaultShouldRetry,
    onRetry = null
  } = options;
  
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on last attempt or if error shouldn't be retried
      if (attempt >= maxRetries || !shouldRetry(error)) {
        throw error;
      }
      
      // Calculate delay before retry
      const delay = calculateDelay(attempt, initialDelay, maxDelay, backoffMultiplier);
      
      // Call onRetry callback if provided
      if (onRetry && typeof onRetry === 'function') {
        onRetry(error, attempt + 1, delay);
      } else {
        console.warn(`[RETRY] Attempt ${attempt + 1}/${maxRetries} failed: ${error.message}. Retrying in ${Math.round(delay)}ms...`);
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

/**
 * Create an axios request with automatic retry
 * @param {Function} requestFn - Function that returns an axios request promise
 * @param {RetryOptions} options - Retry configuration
 * @returns {Promise} Axios response
 */
async function axiosWithRetry(requestFn, options = {}) {
  return retryWithBackoff(requestFn, options);
}

/**
 * Wrapper for axios.get with retry
 */
async function axiosGetWithRetry(url, config = {}, retryOptions = {}) {
  return axiosWithRetry(() => axios.get(url, config), retryOptions);
}

/**
 * Wrapper for axios.post with retry
 */
async function axiosPostWithRetry(url, data, config = {}, retryOptions = {}) {
  return axiosWithRetry(() => axios.post(url, data, config), retryOptions);
}

/**
 * Wrapper for axios.request with retry
 */
async function axiosRequestWithRetry(config, retryOptions = {}) {
  return axiosWithRetry(() => axios.request(config), retryOptions);
}

module.exports = {
  retryWithBackoff,
  axiosWithRetry,
  axiosGetWithRetry,
  axiosPostWithRetry,
  axiosRequestWithRetry,
  defaultShouldRetry,
  calculateDelay,
};


