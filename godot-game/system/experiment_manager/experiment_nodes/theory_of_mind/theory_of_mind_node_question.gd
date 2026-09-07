class_name TheoryOfMindNodeQuestion
extends RefCounted

var text: String
var is_first: bool
var narration: String
var correct_question_index: int
var choices: Array[String]

func _init(p_text: String, p_is_first: bool, p_narration: String, p_correct_question_index: int, p_choices: Array[String]) -> void:
	self.text = p_text
	self.is_first = p_is_first
	self.narration = p_narration
	self.correct_question_index = p_correct_question_index
	self.choices = p_choices
