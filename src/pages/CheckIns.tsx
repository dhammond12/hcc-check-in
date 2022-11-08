import React from 'react';
import NoResultsSVG from '../images/no-results.svg';
import { faCheck, faChevronRight, faPlus, faBomb, faTrashCan, faUserPlus, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useCheckIns from '../hooks/useCheckIns';
import Modal from '../components/Modal';
import CheckInsForm from './CheckInsForm';

/**
 * The list of all check-ins.
 */
const CheckIns = () => {
	const {
		headerTabsRef,
		tableStatus,
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
	} = useCheckIns();

	return (
		<div className="page">
			<h1 className="page-title">Lobby</h1>
			<div className="table-header">
				<ul
					ref={headerTabsRef}
					className="table-header-tabs"
				>
					<li>
						<button
							className={selectedTab === 0 ? 'selected' : ''}
							onClick={() => setSelectedTab(0)}
						>
							<span>ALL</span>
							<span className={'badge' + (selectedTab === 0 ? ' primary' : '')}>{filteredCheckIns.length}</span>
						</button>
					</li>
					<li>
						<button
							className={selectedTab === 1 ? 'selected' : ''}
							onClick={() => setSelectedTab(1)}
						>
							<span>WAITING</span>
							<span className="badge">{checkInTotals.totalWaiting}</span>
						</button>
					</li>
					<li>
						<button
							className={selectedTab === 2 ? 'selected' : ''}
							onClick={() => setSelectedTab(2)}
						>
							<span>ASSIGNED</span>
							<span className="badge">{checkInTotals.totalAssigned}</span>
						</button>
					</li>
					<li>
						<button
							className={selectedTab === 3 ? 'selected' : ''}
							onClick={() => setSelectedTab(3)}
						>
							<span>COMPLETED</span>
							<span className="badge">{checkInTotals.totalCompleted}</span>
						</button>
					</li>
				</ul>
				<div
					className="table-header-tabs-underline"
					style={{ left: headerTabUnderlineLeft, top: headerTabUnderlineTop, width: headerTabUnderlineWidth }}
				></div>
				<ul className="actions">
					<li>
						<button
							className="icon basic warning"
							onClick={() => setIsResetFormVisible(true)}
							title="Delete All"
						>
							<FontAwesomeIcon icon={faBomb} />
						</button>
					</li>
					<li>
						<button
							className="icon primary"
							onClick={() => setIsAddFormVisible(true)}
							title="Add Check-In"
						>
							<FontAwesomeIcon icon={faPlus} />
						</button>
					</li>
				</ul>
			</div>
			<div className="table-container">
				<table>
					<thead>
						<tr>
							<th></th>
							<th>#</th>
							<th>NAME</th>
							<th>REASON</th>
							<th>CHECK-IN TIME</th>
							<th>STATUS</th>
						</tr>
					</thead>
					<tbody>
						{!!filteredCheckIns?.length &&
							filteredCheckIns.map((checkIn, index) => (
								<React.Fragment key={checkIn.id}>
									<tr onClick={clickRowHandler}>
										<td>
											<button className="icon chevron">
												<FontAwesomeIcon icon={faChevronRight} />
											</button>
										</td>
										<td>{index + 1}</td>
										<td>{checkIn.name}</td>
										<td>{checkIn.reason}</td>
										<td>{checkIn.time.toLocaleString()}</td>
										<td>
											<span className={'tag ' + getTagStatus(checkIn.status)}>{checkIn.status}</span>
										</td>
									</tr>
									<tr
										className="dropdown"
										data-id={checkIn.id}
									>
										<td></td>
										<td colSpan={5}>
											<div className="dropdown-content">
												<div className="checkin-dropdown">
													<div className="checkin-dropdown-notes">
														<span className="label">NOTES</span>
														<p>{checkIn.notes || 'No notes provided.'}</p>
													</div>
													<ul className="actions">
														<li>
															<button
																className="icon basic warning"
																onClick={setDeleteHandler}
																tabIndex={-1}
																title="Delete"
															>
																<FontAwesomeIcon icon={faTrashCan} />
															</button>
														</li>
														<li>
															<button
																disabled={checkIn.status !== 'Waiting'}
																className="icon basic"
																onClick={setAssignedHandler}
																tabIndex={-1}
																title="To Lobby"
															>
																<FontAwesomeIcon icon={faUserPlus} />
															</button>
														</li>
														<li>
															<button
																disabled={checkIn.status !== 'Assigned'}
																className="icon basic"
																onClick={setUnassignedHandler}
																tabIndex={-1}
																title="Assign"
															>
																<FontAwesomeIcon icon={faUserSlash} />
															</button>
														</li>
														<li>
															<button
																disabled={checkIn.status !== 'Assigned'}
																className="icon basic"
																onClick={setCompletedHandler}
																tabIndex={-1}
																title="Complete"
															>
																<FontAwesomeIcon icon={faCheck} />
															</button>
														</li>
													</ul>
												</div>
											</div>
										</td>
									</tr>
								</React.Fragment>
							))}
					</tbody>
				</table>
				<div className={'table-status ' + tableStatus.state}>
					{tableStatus.state === 'loading' && <span>{tableStatus.text}</span>}
					{tableStatus.state === 'empty' && (
						<>
							<img
								src={NoResultsSVG}
								alt="No results found."
							/>
							<span>{tableStatus.text}</span>
						</>
					)}
				</div>
			</div>
			{isAddFormVisible && (
				<CheckInsForm
					addCheckIn={addCheckIn}
					closeHandler={() => setIsAddFormVisible(false)}
				/>
			)}
			{isResetFormVisible && (
				<Modal
					closeHandler={() => setIsResetFormVisible(false)}
					prompt="Are you sure you want to remove all check-ins?"
				>
					<ul className="actions fill">
						<li>
							<button
								className="basic"
								onClick={() => setIsResetFormVisible(false)}
							>
								NO
							</button>
						</li>
						<li>
							<button
								className="primary"
								onClick={removeAllCheckIns}
							>
								YES
							</button>
						</li>
					</ul>
				</Modal>
			)}
		</div>
	);
};

export default CheckIns;
