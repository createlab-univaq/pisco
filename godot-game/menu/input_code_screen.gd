class_name InputCodeScreen
extends Control

@onready var code_line_edit: LineEdit = $MarginContainer/VBoxContainer/CodeLineEdit
@onready var error_rich_text_label: RichTextLabel = $MarginContainer/VBoxContainer/ErrorRichTextLabel
@onready var redeem_button: Button = $MarginContainer/VBoxContainer/MarginContainer/RedeemButton

func _ready() -> void:
	_reset_redeem_button()

func _unhandled_input(event: InputEvent) -> void:
	# Check if the node is actually visible first, so we don't process unnecessarily
	if not is_visible_in_tree():
		return

	# 'ui_cancel' is mapped to the Escape key by default in Godot
	if event.is_action_pressed("ui_cancel"):
		hide()

		# Consume the input so the game doesn't also pause/react to the Esc key
		get_viewport().set_input_as_handled()

func _on_redeem_path_response(server_response: ServerResponse):
	if not server_response.success:
		error_rich_text_label.text = server_response.error
		_reset_redeem_button()
		return

func _reset_redeem_button() -> void:
	redeem_button.disabled = false
	redeem_button.text = "Redeem"

func _on_redeem_button_pressed() -> void:
	redeem_button.disabled = true
	redeem_button.text = "Redeeming path..."
	APIManager.redeem_path(code_line_edit.text, _on_redeem_path_response)
