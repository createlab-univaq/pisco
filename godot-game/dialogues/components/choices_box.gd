class_name ChoicesBox
extends DialogueComponentBaseNode

@onready var v_box_container: VBoxContainer = $VBoxContainer

const STATE_CHOOSING: StringName = &"CHOOSING"

func _reset() -> void:
	for child in v_box_container.get_children():
		v_box_container.remove_child(child)
		child.queue_free()

func display_choices(dialogue_choices: Array[String]) -> void:
	if current_state == STATE_READY:
		action_started.emit()
		
		for choice: String in dialogue_choices:
			var button: Button = Button.new()
			button.text = choice
			button.pressed.connect(_on_choice_pressed.bind(choice))
			button.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
			v_box_container.add_child(button)
		
		action_shown.emit()
		_change_state(STATE_CHOOSING)

func _on_choice_pressed(choice: String) -> void:
	action_performed.emit(choice)
	
	_change_state(STATE_READY)
	_reset()
	action_stopped.emit()
