class_name DialogueChoiceData
extends Resource

@export var text: String
@export var outcome: String
@export var next_lines: Array[DialogueData]

func _init(p_text: String = "", p_outcome: String = "", p_next_lines: Array[DialogueData] = []) -> void:
	text = p_text
	outcome = p_outcome
	next_lines = p_next_lines
