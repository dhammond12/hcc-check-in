import { useEffect, useRef } from 'react';
import ModalProps from '../types/ModalProps';

/**
 * A hook to handle all state-related logic for the Modal component.
 */
const useModal = (props: ModalProps) => {
	/* ------------------------------- State refs ------------------------------- */

	const modalRef = useRef<HTMLDivElement>(null);
	const prevFocusedElement = useRef<HTMLElement | null>(null);

	/* ------------------------------ State effects ----------------------------- */

	/**
	 * Attaches listeners to the body to close the modal. Will trigger when the user
	 * clicks outside of the modal or presses the 'Escape' key.
	 */
	useEffect(() => {
		const closeModalOnClickHandler = (e: MouseEvent) => {
			// Do nothing when modal is locked
			if (props.isLocked) {
				return;
			}

			// Check if the element clicked is outside of the modal content box
			const target = e.target;
			if (target) {
				if (target instanceof Element) {
					if (target.closest('.modal') && !target.closest('.modal-content')) {
						props.closeHandler();
					}
				}
			}
		};

		const closeModalOnEscapeHandler = (e: KeyboardEvent) => {
			// Do nothing when modal is locked
			if (props.isLocked) {
				return;
			}

			// Check if the escape key is pressed
			if (e.key === 'Escape') {
				props.closeHandler();
			}
		};

		document.addEventListener('mousedown', closeModalOnClickHandler);
		document.addEventListener('keydown', closeModalOnEscapeHandler);

		return () => {
			document.removeEventListener('mousedown', closeModalOnClickHandler);
			document.removeEventListener('keydown', closeModalOnEscapeHandler);
		};
	}, [props]);

	/**
	 * Traps the focus to within the modal, disallowing the user to tab to background
	 * content. Also returns focus back to the background element that was focused
	 * before the modal was opened.
	 */
	useEffect(() => {
		if (!modalRef.current) {
			return;
		}
		const modal = modalRef.current;

		// Get element that was previously focused
		prevFocusedElement.current = document.activeElement as HTMLElement;

		// Get all input elements in the modal
		const inputs = modal.querySelectorAll<HTMLElement>('button,input,textarea,select');
		if (inputs.length === 0) {
			return;
		}

		// Autofocus to the first input element
		inputs[0].focus();

		// Tab handler to force the focus to the first or last input
		const focusTrapHandler = (e: KeyboardEvent) => {
			// Prevent key events if the modal is locked
			if (props.isLocked) {
				e.preventDefault();
				return;
			}

			let firstInput: HTMLElement | null = null;
			let lastInput: HTMLElement | null = null;
			// Find first input
			for (let i = 0; i < inputs.length - 1; i++) {
				if (inputs[i].getAttribute('tabindex') !== '-1') {
					firstInput = inputs[i];
					break;
				}
			}
			// Find last input
			for (let i = inputs.length - 1; i >= 0; i--) {
				if (inputs[i].getAttribute('tabindex') !== '-1') {
					lastInput = inputs[i];
					break;
				}
			}

			if (firstInput && lastInput) {
				if (e.key === 'Tab' && e.shiftKey) {
					if (document.activeElement === firstInput) {
						lastInput.focus();
						e.preventDefault();
					}
				} else if (e.key === 'Tab') {
					if (document.activeElement === lastInput) {
						firstInput.focus();
						e.preventDefault();
					}
				}
			}
		};

		// Attach key listener
		if (modal) {
			modal.addEventListener('keydown', focusTrapHandler);
		}

		// Remover listener on component unmount
		return () => {
			if (modal) {
				modal.removeEventListener('keydown', focusTrapHandler);
			}
			if (prevFocusedElement.current) {
				prevFocusedElement.current.focus();
				prevFocusedElement.current = null;
			}
		};
	}, [props.isLocked]);

	return {
		modalRef,
	};
};

export default useModal;
