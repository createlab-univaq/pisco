class_name NodeRecord
extends RefCounted

var node_id: String = "":
	get:
		return node_id
	set(value):
		node_id = value

var node_name: String = "":
	get:
		return node_name
	set(value):
		node_name = value

var node_type: String = "":
	get:
		return node_type
	set(value):
		node_type = value

var is_exercise: bool = false:
	get:
		return is_exercise
	set(value):
		is_exercise = value

var max_score: float = 0.0:
	get:
		return max_score
	set(value):
		# Prevent max_score from ever being negative
		max_score = max(0.0, value)

var score: float = 0.0:
	get:
		return score
	set(value):
		score = value

var percentage_score: float = 0.0:
	get:
		return percentage_score
	set(value):
		# Clamp the percentage so it physically cannot exceed 100 or drop below 0
		percentage_score = clamp(value, 0.0, 100.0)

var average_reaction_time_in_milliseconds: float = 0.0:
	get:
		return average_reaction_time_in_milliseconds
	set(value):
		average_reaction_time_in_milliseconds = value

var average_response_time_in_milliseconds: float = 0.0:
	get:
		return average_response_time_in_milliseconds
	set(value):
		average_response_time_in_milliseconds = value

var average_mouse_distance_in_centimeters: float = 0.0:
	get:
		return average_mouse_distance_in_centimeters
	set(value):
		average_mouse_distance_in_centimeters = value

var answers: Array[AnswerRecord] = []:
	get:
		return answers
	set(value):
		answers = value

func _init(n_node_id: String, n_node_name: String, n_node_type: String, n_is_exercise: bool) -> void:
	self.node_id = n_node_id
	self.node_name = n_node_name
	self.node_type = n_node_type
	self.is_exercise = n_is_exercise
