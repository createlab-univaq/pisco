class_name EmotionAttributionNodeQuestion
extends RefCounted

var narration: String
var question: String
var correct_answers: Array[String]

func _init(n_narration: String, n_question: String, n_correct_answers: Array[String]) -> void:
	self.narration = n_narration
	self.question = n_question
	self.correct_answers = n_correct_answers
