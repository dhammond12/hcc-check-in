import { useState, ChangeEvent, FormEvent } from 'react';
import simulateLoad from '../helpers/simulateLoad';
import FormStatus from '../types/FormStatus';
import CheckInNew from '../types/CheckInNew';
import CheckInsFormProps from '../types/CheckInsFormProps';

/**
 * A hook to handle all state-related logic for the CheckInsForm page. This design
 * of separating the UI from the logic is known as
 * {@link https://en.wikipedia.org/wiki/Separation_of_concerns separation of concerns}.
 */
const useCheckInsForm = (props: CheckInsFormProps) => {
	/* ----------------------------- State variables ---------------------------- */

	const [name, setName] = useState<string>('');
	const [nameError, setNameError] = useState<string>('');
	const [reason, setReason] = useState<string>('Enrollment');
	const [notes, setNotes] = useState<string>('');
	const [formStatus, setFormStatus] = useState<FormStatus>({ state: 'idle' });

	/* ----------------------------- State functions ---------------------------- */

	const setNameHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const input = e.currentTarget;
		setName(input.value);

		if (!input.value.trim().length) {
			setNameError('This field cannot be blank.');
		} else {
			setNameError('');
		}
	};

	const submitFormHandler = async (e: FormEvent) => {
		e.preventDefault();

		setFormStatus({
			state: 'loading',
			text: 'Creating...',
		});

		await simulateLoad(1000);

		const CheckInNew: CheckInNew = {
			name,
			reason,
			time: new Date(),
			status: 'Waiting',
			notes,
		};

		const tryAddCheckIn = props.addCheckIn(CheckInNew);
		if (tryAddCheckIn.error) {
			const error = tryAddCheckIn.error;
			setFormStatus({ state: 'error', text: error.message });
			if (error.customParams) {
				if (error.customParams.name) {
					setNameError(error.customParams.name);
				}
			}
		} else {
			setFormStatus({ state: 'success', text: 'Check-in created' });
			setName('');
			setReason('Enrollment');
			setNotes('');
		}
	};

	return {
		name,
		setName,
		setNameHandler,
		nameError,
		reason,
		setReason,
		notes,
		setNotes,
		formStatus,
		setFormStatus,
		submitFormHandler,
	};
};

export default useCheckInsForm;
