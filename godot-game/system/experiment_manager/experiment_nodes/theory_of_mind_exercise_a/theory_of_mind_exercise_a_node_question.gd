class_name TheoryOfMindExerciseANodeQuestion
extends RefCounted

var text: String
var is_first: bool
var is_last: bool
var image_url: String
var caption: String
var choices: Array[String]
var correct_answer_index: int
var explanation: String

func _init(p_text: String, p_is_first: bool, p_is_last: bool, p_image_url: String, p_caption: String, p_choices: Array[String], p_correct_answer_index: int, p_explanation: String) -> void:
	self.text = p_text
	self.is_first = p_is_first
	self.is_last = p_is_last
	self.image_url = p_image_url
	self.caption = p_caption
	self.choices = p_choices
	self.correct_answer_index = p_correct_answer_index
	self.explanation = p_explanation
