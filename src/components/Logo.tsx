import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

/**
 * The application logo.
 */
const Logo = () => {
	return (
		<div className="logo">
			<FontAwesomeIcon icon={faCircleCheck} />
			<span>Check In</span>
		</div>
	);
};

export default Logo;
