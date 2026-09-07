class_name EmotionAttributionExerciseANodeQuestion
extends RefCounted

var scenario: String
var text: String
var correct_answers: Array[String]
var correct_answer_explaination: String
var scenario_explaination: String

func _init(p_scenario: String, p_text: String, p_correct_answers: Array[String], p_correct_answer_explaination: String, p_scenario_explaination: String) -> void:
	self.scenario = p_scenario
	self.text = p_text
	self.correct_answers = p_correct_answers
	self.correct_answer_explaination = p_correct_answer_explaination
	self.scenario_explaination = p_scenario_explaination
