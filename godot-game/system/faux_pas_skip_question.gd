class_name FauxPasSkipQuestion
extends RefCounted

var question_index: int
var question_answer: String

func _init(p_question_index: int, p_question_answer: String) -> void:
	self.question_index = p_question_index
	self.question_answer = p_question_answer
