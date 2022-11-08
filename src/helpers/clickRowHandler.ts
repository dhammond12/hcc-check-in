import { MouseEvent } from 'react';

/**
 * Toggles the opening and closing of the row dropdown when a row is clicked.
 */
const clickRowHandler = (e: MouseEvent<HTMLTableRowElement>) => {
	const clickedRow = e.currentTarget;

	const dropdownRow = clickedRow.nextElementSibling as HTMLTableRowElement;
	if (!dropdownRow) {
		throw new Error('Table row is missing an adjacent dropdown row.');
	}

	const dropdownContent = dropdownRow.querySelector('.dropdown-content');
	if (!dropdownContent) {
		throw new Error('Table row is missing a dropdown content element.');
	}

	if (dropdownRow.classList.contains('visible')) {
		const inputs = dropdownContent.querySelectorAll('button,input,select,textarea,a');
		inputs.forEach((input) => {
			input.setAttribute('tabindex', '-1');
		});

		dropdownRow.style.height = '0';
		clickedRow.classList.remove('opened');

		const removeBordersOnTransitionEnd = () => {
			dropdownRow.classList.remove('visible');
			clickedRow.classList.remove('no-border');
			dropdownRow.removeEventListener('transitionend', removeBordersOnTransitionEnd);
		};

		dropdownRow.addEventListener('transitionend', removeBordersOnTransitionEnd);
	} else {
		const inputs = dropdownContent.querySelectorAll('button,input,select,textarea,a');
		inputs.forEach((input) => {
			input.setAttribute('tabindex', '0');
		});

		const expandToHeight = dropdownContent.getBoundingClientRect().height;
		clickedRow.classList.add('opened');
		clickedRow.classList.add('no-border');
		dropdownRow.classList.add('visible');
		dropdownRow.style.height = expandToHeight + 'px';
	}
};

export default clickRowHandler;
