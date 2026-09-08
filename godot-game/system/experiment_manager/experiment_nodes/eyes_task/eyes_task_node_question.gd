class_name EyesTaskNodeQuestion
extends RefCounted

var image_id: String
var choices: Array[String] = []
var correct_choice_index: int

func _init(p_image_id: String, p_choices: Array, p_correct_choice_index: int) -> void:
	self.image_id = p_image_id
	self.choices.assign(p_choices)
	self.correct_choice_index = p_correct_choice_index
