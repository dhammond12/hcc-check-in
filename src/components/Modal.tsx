import ModalProps from '../types/ModalProps';
import useModal from '../hooks/useModal';

/**
 * Opens a popup box that locks focus away from the primary content. Can be exited
 * by clicking outside of the content or pressing the 'Escape' key.
 * @param props {@link ModalProps}
 */
const Modal = (props: ModalProps) => {
	const { modalRef } = useModal(props);

	return (
		<div
			ref={modalRef}
			className="modal"
		>
			<div className="modal-content">
				<div className="modal-content-header">
					{props.title && <h2>{props.title}</h2>}
					{props.prompt && <p>{props.prompt}</p>}
				</div>
				<div className="modal-content-body">{props.children}</div>
			</div>
		</div>
	);
};

export default Modal;
