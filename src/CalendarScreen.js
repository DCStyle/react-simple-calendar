import React, {useState} from "react";

import {Container, Row, Col, Button, Modal, ButtonGroup, OverlayTrigger, Tooltip} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import AddEventForm from "./AddEventForm";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faTimes} from "@fortawesome/free-solid-svg-icons";

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);

// Mock event for demonstration, assuming each event has a unique id and a day/time slot
const mockEvents = [
	{ id: 'event-1', day: 'Monday', hour: 10, content: 'Event 1' },
	{ id: 'event-2', day: 'Tuesday', hour: 10, content: 'Event 2' },
	// Add more mock events as needed
];

const Calendar = () => {
	const [events, setEvents] = useState(mockEvents);
	const [showModal, setShowModal] = useState(false);
	const [editingEvent, setEditingEvent] = useState(null);

	const onDragEnd = (result) => {
		const { destination, source, draggableId } = result;

		if (!destination) {
			return; // dropped outside the list
		}

		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return; // the item didn't move
		}

		console.log("Before update:", events);

		const start = source.droppableId.split('-'); // ["Monday", "10"]
		const end = destination.droppableId.split('-'); // ["Tuesday", "11"]

		const newDay = end[0];
		const newHour = parseInt(end[1], 10);

		const updatedEvents = events.map(event => {
			if (event.id === draggableId) {
				return { ...event, day: newDay, hour: newHour };
			}
			return event;
		});

		setEvents(updatedEvents);
		console.log("After update:", updatedEvents);
	};

	const handleAddOrEditEvent = (eventDetails) => {
		if (editingEvent) {
			// Edit mode
			setEvents(events.map(event => event.id === editingEvent.id ? eventDetails : event));
		} else {
			// Add mode
			setEvents([...events, eventDetails]);
		}

		handleCloseModal();
	};

	const handleShowModal = (event = null) => {
		setEditingEvent(event); // If event is null, the form is in 'add' mode
		setShowModal(true);
	};
	const handleCloseModal = () => {
		setEditingEvent(null); // Clear the editing event upon closing the modal
		setShowModal(false);
	};

	const handleRemoveEvent = (id) => {
		setEvents(events.filter(event => event.id !== id));
	};

	return (
		<>
			<DragDropContext onDragEnd={onDragEnd}>
				<Modal show={showModal} onHide={handleCloseModal}>
					<Modal.Header closeButton>
						<Modal.Title>{editingEvent ? 'Edit Event' : 'Add New Event'}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<AddEventForm onAddEvent={handleAddOrEditEvent} onCancel={handleCloseModal} event={editingEvent} />
					</Modal.Body>
				</Modal>

				<Container fluid className="mx-auto p-4">
					<Row className="text-end" style={{ marginBottom: '1em' }}>
						<Col md={{ span: 6, offset: 6 }}>
							<Button variant="primary" onClick={() => handleShowModal()}
							        className="d-inline-block">
								Add Event
							</Button>
						</Col>
					</Row>

					<Row className="text-center fw-bold">
						{/* Empty Col for aligning with the time column */}
						<Col className="border d-inline-block col-1" style={{ height: '68px' }}></Col>

						{daysOfWeek.map(day => (
							<Col key={day} className="border d-inline-block bg-dark text-white" style={{ height: '68px', lineHeight: '69px' }}>
								<span>{day}</span>
							</Col>
						))}
					</Row>

					{hoursOfDay.map((hour, index) => (
						<Row key={index}>
							<Col className="text-end pe-3 col-1" style={{ height: '75px', lineHeight: '75px' }}>
								{hour}:00
							</Col>

							{daysOfWeek.map(day => (
								<Droppable key={`${day}-${hour}`} droppableId={`${day}-${hour}`}>
									{(provided) => (
										<Col
											ref={provided.innerRef}
											{...provided.droppableProps}
											key={`day-${day}-${hour}`}
											className="border text-center"
											style={{ height: 'auto', minHeight: '75px', lineHeight: '26px' }}>
											{events
												.filter(event => event.day === day && event.hour === hour)
												.map((event, index) => (
													<Draggable key={event.id} draggableId={event.id} index={index}>
														{(provided) => (
															<div
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}
																className="bg-primary text-white rounded"
																style={{ padding: '5px', margin: '5px auto', width: '50%' }}>

																	{event.content}


																<ButtonGroup aria-label="Event actions" style={{ marginTop: '.5em' }}>
																	<OverlayTrigger
																		placement="top"
																		overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}
																	>
																		<Button size="sm" onClick={() => handleShowModal(event)} variant="warning">
																			<FontAwesomeIcon icon={faPencil} />
																		</Button>
																	</OverlayTrigger>

																	<OverlayTrigger
																		placement="top"
																		overlay={<Tooltip id="remove-tooltip">Remove</Tooltip>}
																	>
																		<Button size="sm" onClick={() => handleRemoveEvent(event.id)} variant="danger">
																			<FontAwesomeIcon icon={faTimes} />
																		</Button>
																	</OverlayTrigger>
																</ButtonGroup>

															</div>
														)}
													</Draggable>
												))}
											{provided.placeholder}
										</Col>
									)}
								</Droppable>
							))}
						</Row>
					))}
				</Container>
			</DragDropContext>
		</>
	);
};

export default Calendar;