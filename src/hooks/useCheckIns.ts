import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CheckInsFormError from '../types/CheckInsFormError';
import CheckIn from '../types/CheckIn';
import Maybe from '../types/Maybe';
import CheckInNew from '../types/CheckInNew';
import simulateLoad from '../helpers/simulateLoad';
import TableStatus from '../types/TableStatus';
import getRowId from '../helpers/getRowId';
import CheckInStatus from '../types/CheckInStatus';
import clickRowHandler from '../helpers/clickRowHandler';
import getTagStatus from '../helpers/getTagStatus';

/**
 * A hook to handle all state-related logic for the CheckIns page. This design
 * of separating the UI from the logic is known as
 * {@link https://en.wikipedia.org/wiki/Separation_of_concerns separation of concerns}.
 */
const useCheckIns = () => {
	/* ------------------------------- State refs ------------------------------- */

	const headerTabsRef = useRef<HTMLUListElement>(null);

	/* ----------------------------- State variables ---------------------------- */

	const [tableStatus, setTableStatus] = useState<TableStatus>({
		state: 'loading',
	});
	const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
	const [selectedTab, setSelectedTab] = useState<number>(0);
	const [isResetFormVisible, setIsResetFormVisible] = useState<boolean>(false);
	const [isAddFormVisible, setIsAddFormVisible] = useState<boolean>(false);
	const [headerTabUnderlineTop, setHeaderTabUnderlineTop] = useState<number>(0);
	const [headerTabUnderlineLeft, setHeaderTabUnderlineLeft] = useState<number>(0);
	const [headerTabUnderlineWidth, setHeaderTabUnderlineWidth] = useState<number>(0);

	/**
	 * Memoized list of check-ins that match the currently selected filter
	 */
	const filteredCheckIns = useMemo(() => {
		const checkInsCopy = [...checkIns];

		return checkInsCopy.filter((checkIn) => {
			switch (selectedTab) {
				case 0:
					return true;
				case 1:
					return checkIn.status === 'Waiting';
				case 2:
					return checkIn.status === 'Assigned';
				case 3:
					return checkIn.status === 'Completed';
				default:
					throw new Error(`Tab '${selectedTab}' is not a valid selection.`);
			}
		});
	}, [checkIns, selectedTab]);

	/**
	 * Memoized totals for each check-in status
	 */
	const checkInTotals = useMemo(() => {
		const totalWaiting = checkIns.reduce((prev, curr) => {
			if (curr.status === 'Waiting') {
				return prev + 1;
			}
			return prev;
		}, 0);

		const totalAssigned = checkIns.reduce((prev, curr) => {
			if (curr.status === 'Assigned') {
				return prev + 1;
			}
			return prev;
		}, 0);

		const totalCompleted = checkIns.reduce((prev, curr) => {
			if (curr.status === 'Completed') {
				return prev + 1;
			}
			return prev;
		}, 0);

		return { totalWaiting, totalAssigned, totalCompleted };
	}, [checkIns]);

	/* ----------------------------- State functions ---------------------------- */

	/**
	 * Validates form fields and adds a new check-in to the checkIns array
	 */
	const addCheckIn = (checkIn: CheckInNew): Maybe<null, CheckInsFormError> => {
		// Validate name field
		if (checkIn.name.trim().length === 0) {
			return {
				error: {
					message: 'Name field cannot be blank.',
					customParams: {
						name: 'This field cannot be blank.',
					},
				},
			};
		}

		// Sort checkIns array by id from largest to smallest
		const checkInsCopy = [...checkIns];
		const sortedCheckIns = checkInsCopy.sort((a, b) => {
			if (b.id > a.id) {
				return 1;
			} else if (a.id > b.id) {
				return -1;
			} else {
				throw new Error(`Check-in id collision found for id '${b.id}'`);
			}
		});

		// First index will be the highest id in the array. Use this to
		// create an id for the new check-in
		const highestId = sortedCheckIns[0]?.id ?? 0;
		const newId = highestId + 1;
		const CheckInNew = {
			id: newId,
			...checkIn,
		};

		// Add new check-in to the end of checkIns array
		setCheckIns((prev) => [...prev, CheckInNew]);
		return { error: null, data: null };
	};

	/**
	 * Removes all checks-ins in the state and local storage
	 */
	const removeAllCheckIns = () => {
		window.localStorage.removeItem('checkIns');
		setCheckIns([]);
		setIsResetFormVisible(false);
	};

	/**
	 * Deletes the check-in when the delete button is clicked
	 */
	const setDeleteHandler = (e: MouseEvent<HTMLButtonElement>) => {
		const tryGetId = getRowId(e);
		if (tryGetId.error) {
			throw new Error(tryGetId.error.message);
		}

		const id = tryGetId.data;

		setCheckIns((prev) => {
			const checkInsCopy = [...prev];
			const checkInToDeleteIndex = checkInsCopy.findIndex((checkIn) => checkIn.id === id);
			if (checkInToDeleteIndex === -1) {
				throw new Error(`Check-in with an id of '${id}' was not found.`);
			}

			checkInsCopy.splice(checkInToDeleteIndex, 1);
			return checkInsCopy;
		});

		e.stopPropagation();
	};

	/**
	 * Helper function used with the handlers belows. Finds a check-in in the array by id
	 * and updates its status to the specified status parameter.
	 */
	const updateCheckInStatus = useCallback(
		(id: number, status: CheckInStatus) => {
			setCheckIns((prev) => {
				const checkInsCopy = [...prev];
				const checkInToUpdate = checkInsCopy.find((checkIn) => checkIn.id === id);
				if (!checkInToUpdate) {
					throw new Error(`Check-in with an id of '${id}' was not found.`);
				}

				checkInToUpdate.status = status;
				return checkInsCopy;
			});
		},
		[setCheckIns]
	);

	/**
	 * Moves the check-in to the appointment when the assign button is clicked
	 */
	const setAssignedHandler = (e: MouseEvent<HTMLButtonElement>) => {
		const tryGetId = getRowId(e);
		if (tryGetId.error) {
			throw new Error(tryGetId.error.message);
		}

		const id = tryGetId.data;
		updateCheckInStatus(id, 'Assigned');
		e.stopPropagation();
	};

	/**
	 * Moves the check-in back to the lobby when the unassign button is clicked
	 */
	const setUnassignedHandler = (e: MouseEvent<HTMLButtonElement>) => {
		const tryGetId = getRowId(e);
		if (tryGetId.error) {
			throw new Error(tryGetId.error.message);
		}

		const id = tryGetId.data;
		updateCheckInStatus(id, 'Waiting');
		e.stopPropagation();
	};

	/**
	 * Completes the check-in when the complete button is clicked
	 */
	const setCompletedHandler = (e: MouseEvent<HTMLButtonElement>) => {
		const tryGetId = getRowId(e);
		if (tryGetId.error) {
			throw new Error(tryGetId.error.message);
		}

		const id = tryGetId.data;
		updateCheckInStatus(id, 'Completed');
		e.stopPropagation();
	};

	/* ------------------------------ State effects ----------------------------- */

	/**
	 * Initial fetch for cached check-ins from the local storage if it exists
	 */
	useEffect(() => {
		const fetchCheckIns = async () => {
			setTableStatus({ state: 'loading', text: 'Fetching check-ins...' });

			await simulateLoad(1500);

			// Check if check-ins are saved in local storage
			const cachedCheckIns = window.localStorage.getItem('checkIns');
			if (cachedCheckIns) {
				try {
					var checkInsToJson: CheckIn[] = JSON.parse(cachedCheckIns);
				} catch (error: any) {
					throw new Error('Cached check-ins is an invalid JSON and cannot be parsed.');
				}

				// When saved to local storage, the dates are cast to strings
				// This will transform each date string back into a Date object
				checkInsToJson.forEach((checkIn) => {
					checkIn.time = new Date(checkIn.time);
				});

				// Set check-ins array
				setCheckIns(checkInsToJson);
			}

			setTableStatus({ state: 'idle' });
		};
		fetchCheckIns();
	}, [setCheckIns, setTableStatus]);

	/**
	 * Saves the check-ins array to local storage whenever the array is mutated
	 */
	useEffect(() => {
		if (tableStatus.state !== 'loading') {
			window.localStorage.setItem('checkIns', JSON.stringify(checkIns));

			if (checkIns.length === 0) {
				setTableStatus({
					state: 'empty',
					text: 'Oops, nothing to see here',
				});
			} else {
				setTableStatus({ state: 'idle' });
			}
		}
	}, [checkIns, tableStatus.state]);

	/**
	 * Controls the underline animation for the tabs whenever a tab is changed
	 */
	useEffect(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const selectedButton = entry.target.querySelector('button.selected');
				if (!selectedButton) {
					throw new Error('Unable to determine the selected tab in the header.');
				}

				const selectedButtonRect = selectedButton.getBoundingClientRect();
				setHeaderTabUnderlineLeft(selectedButtonRect.left);
				setHeaderTabUnderlineTop(selectedButtonRect.bottom);
				setHeaderTabUnderlineWidth(selectedButtonRect.width);
			}
		});

		if (!headerTabsRef.current) {
			return;
		}
		resizeObserver.observe(headerTabsRef.current);

		return () => resizeObserver.disconnect();
	}, [selectedTab]);

	return {
		headerTabsRef,
		tableStatus,
		checkIns,
		filteredCheckIns,
		removeAllCheckIns,
		setDeleteHandler,
		addCheckIn,
		selectedTab,
		setSelectedTab,
		clickRowHandler,
		setAssignedHandler,
		setUnassignedHandler,
		setCompletedHandler,
		getTagStatus,
		checkInTotals,
		isAddFormVisible,
		setIsAddFormVisible,
		isResetFormVisible,
		setIsResetFormVisible,
		headerTabUnderlineLeft,
		headerTabUnderlineTop,
		headerTabUnderlineWidth,
	};
};

/* --------------------------------- Helpers -------------------------------- */

export default useCheckIns;
