class_name EmotionAttributionExerciseBNodeQuestion
extends RefCounted

var scenario: String
var emotion: String
var explanation: String

func _init(p_scenario: String, p_emotion: String, p_explanation: String) -> void:
	self.scenario = p_scenario
	self.emotion = p_emotion
	self.explanation = p_explanation
