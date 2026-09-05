class_name EyesTaskNodeQuestion
extends RefCounted

var image_id: String
var choices: Array[String]
var correct_choice_index: int

func _init(p_image_id: String, p_choices: Array[String], p_correct_choice_index: int) -> void:
	self.image_id = p_image_id
	self.choices = p_choices
	self.correct_choice_index = p_correct_choice_index
