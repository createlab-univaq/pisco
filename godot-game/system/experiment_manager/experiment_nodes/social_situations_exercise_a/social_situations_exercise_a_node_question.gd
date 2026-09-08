class_name SocialSituationsExerciseANodeQuestion
extends RefCounted

var text: String
var choices: Array[SocialSituationsExerciseAChoice]
var correct_choices_index: int

func _init(before_text: String, bold_text: String, after_text: String, p_choices: Array[SocialSituationsExerciseAChoice], p_correct_choices_index: int) -> void:
	self.text = "%s [b]%s[/b] %s" % [before_text, bold_text, after_text]
	self.choices = p_choices
	self.correct_choices_index = p_correct_choices_index
