import {useState} from "react";
import {Button, Form} from "react-bootstrap";

const AddEventForm = ({ onAddEvent, onCancel, event = null }) => {

	const handleSubmit = (e) => {
		e.preventDefault();

		let formData = new FormData(e.target),
			day = formData.get('eventDay'),
			hour = formData.get('eventHour'),
			content = formData.get('eventContent');

		const eventId = event ? event.id : `event-${Math.random().toString(36).substr(2, 9)}`;

		// Add or edit event
		onAddEvent({ id: eventId, day, hour: parseInt(hour, 10), content });

		onCancel(); // Close the modal after submitting
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Form.Group className="mb-3" controlId="formDaySelect">
				<Form.Label>Day of the Week</Form.Label>
				<Form.Select
					name="eventDay"
					defaultValue={event ? event.day : ''}
					required>
					<option value="">Select Day</option>
					{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
						<option key={day} value={day}>{day}</option>
					))}
				</Form.Select>
			</Form.Group>

			<Form.Group className="mb-3" controlId="formHourInput">
				<Form.Label>Hour</Form.Label>
				<Form.Control
					name="eventHour"
					type="number"
					min="0"
					max="23"
					defaultValue={event ? event.hour : ''}
					required
					placeholder="Hour (0-23)" />
			</Form.Group>

			<Form.Group className="mb-3" controlId="formContentInput">
				<Form.Label>Event Content</Form.Label>
				<Form.Control
					name="eventContent"
					type="text"
					defaultValue={event ? event.content : ''}
					required
					placeholder="Event Content" />
			</Form.Group>

			<Button variant="primary" type="submit">Add Event</Button>
			<Button variant="secondary" onClick={onCancel} className="ms-2">Cancel</Button>
		</Form>
	);
};
export default AddEventForm;
