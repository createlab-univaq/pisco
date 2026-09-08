class_name DialogueController
extends Control

signal dialogue_started
signal dialogue_completed
signal action_shown
signal action_performed(output: Variant)

enum Components {
	CHOICES_BOX,
	IMAGE_BOX,
	TEXT_INPUT,
	QUESTION_TEXT_BOX,
	TEXT_BOX
}

const COMPONENTS_ID_MAP: Dictionary[Components, String] = {
	Components.CHOICES_BOX: "ChoicesBox",
	Components.IMAGE_BOX: "ImageBox",
	Components.TEXT_INPUT: "TextInput",
	Components.QUESTION_TEXT_BOX: "QuestionTextBox",
	Components.TEXT_BOX: "TextBox",
}

@onready var choices_box: ChoicesBox = $MarginContainer/VBoxContainer/ChoicesMarginContainer/ChoicesBox
@onready var image_box: ImageBox = $MarginContainer/VBoxContainer/ImageMarginContainer/ImageBox
@onready var text_input: TextInput = $MarginContainer/VBoxContainer/TextInputMarginContainer/TextInput
@onready var question_text_box: TextBox = $MarginContainer/VBoxContainer/QuestionTextBoxCenterContainer/QuestionTextBox
@onready var text_box: TextBox = $MarginContainer/VBoxContainer/TextBoxCenterContainer/TextBox

@export var player: Player

var active_dialogue_components_queue: Array[String] = []
var is_player_already_in_cutscene: bool = false

func _ready() -> void:
	assert(player, "No player selected")

func _setup_dialogue_state() -> void:
	dialogue_started.emit()
	
	if player.is_player_in_cutscene:
		is_player_already_in_cutscene = true
	else:
		player.set_player_as_in_dialogue()
	self.show()

func _remove_dialogue_state() -> void:
	dialogue_completed.emit()
	
	if not is_player_already_in_cutscene:
		player.set_player_as_not_in_dialogue()
	is_player_already_in_cutscene = false
	self.hide()

func _activate_dialogue_component(dialogue_component: DialogueComponentBaseNode, component_id: String) -> void:
	if active_dialogue_components_queue.is_empty():
		_setup_dialogue_state()
	
	_add_active_dialogue_component_to_queue(component_id)
	dialogue_component.open()

func _deactivate_dialogue_component(dialogue_component: DialogueComponentBaseNode, component_id: String) -> void:
	_remove_active_dialogue_component_to_queue(component_id)
	
	if active_dialogue_components_queue.is_empty():
		_remove_dialogue_state()
	dialogue_component.close()

func _add_active_dialogue_component_to_queue(component_id: String) -> void:
	if not active_dialogue_components_queue.has(component_id):
		active_dialogue_components_queue.append(component_id)

func _remove_active_dialogue_component_to_queue(component_id: String) -> void:
	active_dialogue_components_queue.erase(component_id)

func queue_dialogue(dialogue_data: DialogueData) -> void:
	match dialogue_data.dialogue_type:
		DialogueData.DialogueTypes.TEXT:
			assert(not dialogue_data.text_sequence.is_empty(), "No dialogue texts")
			text_box.queue_dialogue_text(dialogue_data.text_sequence)
		DialogueData.DialogueTypes.INPUT:
			text_input.show_input()
		DialogueData.DialogueTypes.IMAGE:
			assert(not dialogue_data.image_urls.is_empty(), "No image urls")
			image_box.queue_dialogue_images(dialogue_data.image_urls)
		DialogueData.DialogueTypes.CHOICES:
			assert(not dialogue_data.choices.is_empty(), "No choices provided")
			choices_box.display_choices(dialogue_data.choices)
		DialogueData.DialogueTypes.QUESTION:
			assert(not dialogue_data.text_sequence.is_empty(), "No question texts")
			question_text_box.queue_dialogue_text(dialogue_data.text_sequence)

func _on_text_box_action_started() -> void:
	_activate_dialogue_component(text_box, COMPONENTS_ID_MAP[Components.TEXT_BOX])

func _on_text_box_action_stopped() -> void:
	_deactivate_dialogue_component(text_box, COMPONENTS_ID_MAP[Components.TEXT_BOX])

func _on_text_input_action_started() -> void:
	_activate_dialogue_component(text_input, COMPONENTS_ID_MAP[Components.TEXT_INPUT])

func _on_text_input_action_stopped() -> void:
	_deactivate_dialogue_component(text_input, COMPONENTS_ID_MAP[Components.TEXT_INPUT])

func _on_image_box_action_started() -> void:
	_activate_dialogue_component(image_box, COMPONENTS_ID_MAP[Components.IMAGE_BOX])

func _on_image_box_action_stopped() -> void:
	_deactivate_dialogue_component(image_box, COMPONENTS_ID_MAP[Components.IMAGE_BOX])

func _on_choices_box_action_started() -> void:
	_activate_dialogue_component(choices_box, COMPONENTS_ID_MAP[Components.CHOICES_BOX])

func _on_choices_box_action_stopped() -> void:
	_deactivate_dialogue_component(choices_box, COMPONENTS_ID_MAP[Components.CHOICES_BOX])

func _on_question_text_box_action_started() -> void:
	_activate_dialogue_component(question_text_box, COMPONENTS_ID_MAP[Components.QUESTION_TEXT_BOX])

func _on_question_text_box_action_stopped() -> void:
	_deactivate_dialogue_component(question_text_box, COMPONENTS_ID_MAP[Components.QUESTION_TEXT_BOX])

func _on_text_box_action_shown() -> void:
	action_shown.emit()

func _on_text_box_action_performed(output: Variant) -> void:
	action_performed.emit(output)

func _on_question_text_box_action_shown() -> void:
	action_shown.emit()

func _on_question_text_box_action_performed(output: Variant) -> void:
	action_performed.emit(output)

func _on_text_input_action_shown() -> void:
	action_shown.emit()

func _on_text_input_action_performed(output: Variant) -> void:
	action_performed.emit(output)

func _on_image_box_action_shown() -> void:
	action_shown.emit()

func _on_image_box_action_performed(output: Variant) -> void:
	action_performed.emit(output)

func _on_choices_box_action_shown() -> void:
	action_shown.emit()

func _on_choices_box_action_performed(output: Variant) -> void:
	action_performed.emit(output)

func textbox_lock_input() -> void:
	text_box.lock_input()

func textbox_unlock_input() -> void:
	text_box.unlock_input()

func textbox_perform_action() -> void:
	text_box.perform_action()

func textbox_unlock_input_and_perform_action() -> void:
	text_box.unlock_input_and_perform_action()

func question_textbox_lock_input() -> void:
	question_text_box.lock_input()

func question_textbox_unlock_input() -> void:
	question_text_box.unlock_input()

func question_textbox_perform_action() -> void:
	question_text_box.perform_action()

func question_textbox_unlock_input_and_perform_action() -> void:
	question_text_box.unlock_input_and_perform_action()

func imagebox_textbox_lock_input() -> void:
	image_box.lock_input()

func imagebox_textbox_unlock_input() -> void:
	image_box.unlock_input()

func imagebox_textbox_perform_action() -> void:
	image_box.perform_action()

func imagebox_textbox_unlock_input_and_perform_action() -> void:
	image_box.unlock_input_and_perform_action()
