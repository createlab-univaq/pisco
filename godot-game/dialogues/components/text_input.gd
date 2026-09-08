class_name TextInput
extends DialogueComponentBaseNode

@onready var line_edit: LineEdit = $LineEdit

const STATE_WAITING: StringName = &"WAITING"

func _reset() -> void:
	line_edit.clear()

func show_input() -> void:
	if current_state == STATE_READY:
		action_started.emit()
		action_shown.emit()
		_change_state(STATE_WAITING)

func _on_line_edit_text_submitted(new_text: String) -> void:
	_reset()
	action_performed.emit(new_text)
	action_stopped.emit()
	_change_state(STATE_READY)
