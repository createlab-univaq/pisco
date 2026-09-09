class_name EmotionAttributionExerciseANodeQuestion
extends RefCounted

var scenario: String
var text: String
var correct_answers: Array[String]
var correct_answer_explanation: String
var scenario_explanation: String

func _init(p_scenario: String, p_text: String, p_correct_answers: Array[String], p_correct_answer_explanation: String, p_scenario_explanation: String) -> void:
	self.scenario = p_scenario
	self.text = p_text
	self.correct_answers = p_correct_answers
	self.correct_answer_explanation = p_correct_answer_explanation
	self.scenario_explanation = p_scenario_explanation
