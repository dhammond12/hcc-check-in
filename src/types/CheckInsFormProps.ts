import AddCheckInFormError from './CheckInsFormError';
import Maybe from './Maybe';
import CheckInNew from './CheckInNew';

type CheckInsFormProps = {
	addCheckIn: (checkIn: CheckInNew) => Maybe<null, AddCheckInFormError>;
	closeHandler: () => void;
};

export default CheckInsFormProps;
