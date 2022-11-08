import useCheckInsForm from '../hooks/useCheckInsForm';
import CheckInsFormProps from '../types/CheckInsFormProps';
import Modal from '../components/Modal';

/**
 * The form to create a new check-in.
 */
const CheckInsForm = (props: CheckInsFormProps) => {
	const { name, setNameHandler, nameError, reason, setReason, notes, setNotes, formStatus, submitFormHandler } = useCheckInsForm(props);

	return (
		<Modal
			title="New Check-In"
			closeHandler={props.closeHandler}
			isLocked={formStatus.state === 'loading'}
		>
			<form
				onSubmit={submitFormHandler}
				className={formStatus.state === 'loading' ? 'locked' : ''}
			>
				<div className="form-fieldset">
					<div className={'form-field' + (nameError ? ' error' : '')}>
						<label htmlFor="name">NAME *</label>
						<input
							type="text"
							id="name"
							value={name}
							onChange={setNameHandler}
						/>
						<span className="form-field-error">{nameError}</span>
					</div>
					<div className="form-field">
						<label htmlFor="reason">REASON *</label>
						<select
							id="reason"
							value={reason}
							onChange={(e) => setReason(e.target.value)}
						>
							<option value="Enrollment">Enrollment</option>
							<option value="Careers">Careers</option>
							<option value="Financial Aid">Financial Aid</option>
							<option value="Registration">Registration</option>
							<option value="Other">Other</option>
						</select>
					</div>
					<div className="form-field">
						<label htmlFor="notes">NOTES</label>
						<textarea
							id="notes"
							rows={4}
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
						></textarea>
					</div>
				</div>
				<div className="form-fieldset">
					<ul className="actions">
						<li>
							<button
								type="button"
								className="basic"
								onClick={props.closeHandler}
							>
								CANCEL
							</button>
						</li>
						<li>
							<button
								type="submit"
								className="primary"
							>
								ADD
							</button>
						</li>
					</ul>
				</div>
				<div className={'form-footer ' + formStatus.state}>
					<span>{formStatus.text}</span>
				</div>
			</form>
		</Modal>
	);
};

export default CheckInsForm;
