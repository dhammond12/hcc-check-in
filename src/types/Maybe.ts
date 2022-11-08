/**
 * Often called 'optionals' in other languages, this is an alternative to exception
 * driven programming. Will return an object with the properties of 'error' and
 * 'data'. This forces you to check for errors before proceeding with the returned value.
 * @example
 * const tryGetSum = getSum(1 + 2);
 * if (tryGetSum.error) {
 *      // An error occured, handle error...
 * } else {
 *      // Will print '3' to console
 *      console.log(tryGetSum.data);
 * }
 */
type Maybe<D = null, C = unknown> =
	| {
			error: null;
			data: D;
	  }
	| {
			error: {
				message: string;
				exception?: any;
				customParams?: C;
			};
	  };

export default Maybe;
