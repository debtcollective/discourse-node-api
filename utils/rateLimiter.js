/**
 * Our simple/naive rate limiting strategy for now hashtag good enough
 **/
const sleepAsync = seconds => {
  return new Promise(res => {
    const ms = seconds * 1000;
    const start = Date.now();
    while (Date.now() - start < ms) {}
    res();
  });
};

/**
 * @param limitRate whether or not to use rate limiting
 * @param seconds num seconds to sleep between api calls
 *
 * @return a function that takes an api call, and limits the rate of api calls if limitRate
 **/
const constructRateLimiter = function constructRateLimiter(useRateLimiter, sleepSeconds) {
  return apiCall => (useRateLimiter ? sleepAsync(sleepSeconds).then(() => apiCall) : apiCall);
};

module.exports = constructRateLimiter;
