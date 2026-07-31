class_name DialogueData
extends Resource

@export var text: String
@export var dialogue_type: DialogueTypes
@export var choices: Array[DialogueChoiceData]

enum DialogueTypes {
	TEXT_ONLY,
	INPUT,
	CHOICES
}

func _init(p_text: String = "", p_dialogue_type: DialogueTypes = DialogueTypes.TEXT_ONLY, p_choices: Array[DialogueChoiceData] = []) -> void:
	text = p_text
	dialogue_type = p_dialogue_type
	choices = p_choices
