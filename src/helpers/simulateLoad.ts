/**
 * A function to simulate asynchronous actions such as fetching data from an API
 * or submitting a form. Not to be used with production, but to showcase the
 * handling of the different states of fetching (loading, error, success, etc.).
 * @param loadTime Time in milliseconds to simulate loading.
 */
const simulateLoad = async (loadTime: number) => {
	return new Promise((resolve) => setTimeout(resolve, loadTime));
};

export default simulateLoad;
