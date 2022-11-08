import CheckInStatus from './CheckInStatus';

type CheckIn = {
	id: number;
	name: string;
	reason: string;
	time: Date;
	status: CheckInStatus;
	notes?: string;
};

export default CheckIn;
