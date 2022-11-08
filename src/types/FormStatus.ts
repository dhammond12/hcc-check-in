type FormStatus = {
	state: 'idle' | 'loading' | 'error' | 'success';
	text?: string;
};

export default FormStatus;
