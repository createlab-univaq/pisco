class_name SocialSituationsNodeQuestion
extends RefCounted

var text: String
var choices: Array[String]
var correct_choices_indexes: Array[int]

func _init(before_text: String, bold_text: String, after_text: String, p_choices: Array[String], p_correct_choices_indexes: Array[int]) -> void:
	self.text = "%s [b]%s[/b] %s" % [before_text, bold_text, after_text]
	self.choices = p_choices
	self.correct_choices_indexes = p_correct_choices_indexes
