import { ReactNode } from 'react';

type ModalProps = {
	children: ReactNode | ReactNode[];
	closeHandler: () => void;
	isLocked?: boolean;
	title?: string;
	prompt?: string;
};

export default ModalProps;
