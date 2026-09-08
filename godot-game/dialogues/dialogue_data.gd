class_name DialogueData
extends RefCounted

var dialogue_type: DialogueTypes
var text_sequence: Array[String]
var choices: Array[String]
var image_urls: Array[String]

enum DialogueTypes {
	TEXT,
	INPUT,
	IMAGE,
	QUESTION,
	CHOICES
}

func _init(p_dialogue_type: DialogueTypes) -> void:
	self.dialogue_type = p_dialogue_type
