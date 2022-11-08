type TableStatus = {
	state: 'idle' | 'loading' | 'error' | 'empty';
	text?: string;
};

export default TableStatus;
