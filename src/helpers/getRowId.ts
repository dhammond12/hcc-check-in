import { MouseEvent } from 'react';
import Maybe from '../types/Maybe';

/**
 * Gets the id of the check-in that is associated with the row when a button is clicked. Looks
 * for the 'data-id' attribute on the parent row of the clicked button.
 */
const getRowId = (e: MouseEvent<HTMLButtonElement>): Maybe<number> => {
	const button = e.currentTarget;

	const parentRow = button.closest('tr');
	if (!parentRow) {
		return {
			error: {
				message: 'Missing parent row on check-in action button.',
			},
		};
	}

	const id = parentRow.getAttribute('data-id');
	if (!id) {
		return {
			error: {
				message: 'Missing data-id attribute on check-in action button.',
			},
		};
	}

	const idToNumber = Number(id);
	if (isNaN(idToNumber)) {
		return {
			error: {
				message: 'Data-id attribute must be a number on check-in action button.',
			},
		};
	}

	return {
		error: null,
		data: idToNumber,
	};
};

export default getRowId;
