class_name EmotionAttributionExerciseBNodeQuestion
extends RefCounted

var scenario: String
var emotion: String
var explaination: String

func _init(p_scenario: String, p_emotion: String, p_explaination: String) -> void:
	self.scenario = p_scenario
	self.emotion = p_emotion
	self.explaination = p_explaination
