class_name FauxPasNodeQuestion
extends RefCounted

var text: String
var is_first: bool
var narration: String
var correct_question_index: int
var choices: Array[String]
var skip_question: FauxPasSkipQuestion

func _init(p_text: String, p_is_first: bool, p_narration: String, p_correct_question_index: int, p_choices: Array[String], p_skip_question: FauxPasSkipQuestion) -> void:
	self.text = p_text
	self.is_first = p_is_first
	self.narration = p_narration
	self.correct_question_index = p_correct_question_index
	self.choices = p_choices
	self.skip_question = p_skip_question
