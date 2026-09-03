class_name InputCodeScreen
extends Control

@onready var code_line_edit: LineEdit = $MarginContainer/VBoxContainer/CodeLineEdit
@onready var error_rich_text_label: RichTextLabel = $MarginContainer/VBoxContainer/ErrorRichTextLabel

func _unhandled_input(event: InputEvent) -> void:
	# Check if the node is actually visible first, so we don't process unnecessarily
	if not is_visible_in_tree():
		return

	# 'ui_cancel' is mapped to the Escape key by default in Godot
	if event.is_action_pressed("ui_cancel"):
		hide()

		# Consume the input so the game doesn't also pause/react to the Esc key
		get_viewport().set_input_as_handled()

func _on_button_pressed() -> void:
	APIManager.redeem_path(code_line_edit.text, Callable())
