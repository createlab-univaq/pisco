class_name DialogueData
extends RefCounted

@export var text: String
@export var dialogue_type: DialogueTypes
@export var choices: Array[String]
@export var image_url: String
@export var question_text: String

enum DialogueTypes {
	TEXT_ONLY,
	INPUT,
	CHOICES,
	IMAGES,
	TEXT_WITH_QUESTION_CHOICE,
	TEXT_WITH_QUESTION_INPUT,
	FIXED_TEXT_WITH_QUESTION_CHOICE
}

func _init(p_text: String = "", p_dialogue_type: DialogueTypes = DialogueTypes.TEXT_ONLY, p_choices: Array[String] = [], p_image_url: String = '', p_question_text: String = '') -> void:
	self.text = p_text
	self.dialogue_type = p_dialogue_type
	self.choices = p_choices
	self.image_url = p_image_url
	self.question_text = p_question_text
