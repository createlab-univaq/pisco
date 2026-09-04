class_name AnswerRecord
extends RefCounted

var correct: bool = false:
	get:
		return correct
	set(value):
		correct = value

var reaction_time_in_milliseconds: float = 0.0:
	get:
		return reaction_time_in_milliseconds
	set(value):
		reaction_time_in_milliseconds = value

var response_time_in_milliseconds: float = 0.0:
	get:
		return response_time_in_milliseconds
	set(value):
		response_time_in_milliseconds = value

var mouse_distance_in_centimeters: float = 0.0:
	get:
		return mouse_distance_in_centimeters
	set(value):
		mouse_distance_in_centimeters = value
