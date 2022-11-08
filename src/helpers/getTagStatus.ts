import CheckInStatus from '../types/CheckInStatus';

/**
 * Gets the CSS class that will style the check-in status tag.
 */
const getTagStatus = (status: CheckInStatus): string => {
	switch (status) {
		case 'Waiting':
			return 'warning';
		case 'Assigned':
			return 'neutral';
		case 'Completed':
			return 'good';
		default:
			throw new Error(`Unknown tag status '${status}'.`);
	}
};

export default getTagStatus;
