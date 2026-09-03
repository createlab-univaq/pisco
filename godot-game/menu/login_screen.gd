extends Control

@onready var email_line_edit: LineEdit = $MarginContainer/VBoxContainer/EmailLineEdit
@onready var password_line_edit: LineEdit = $MarginContainer/VBoxContainer/PasswordLineEdit
@onready var error_rich_text_label: RichTextLabel = $MarginContainer/VBoxContainer/ErrorRichTextLabel
@onready var login_button: Button = $MarginContainer/VBoxContainer/MarginContainer/LoginButton
@onready var fade_color_rect: ColorRect = $FadeColorRect

@export var fade_duration: float = 1.0

func _ready() -> void:
	fade_color_rect.color.a = 0
	_reset_login_button()

func _on_login_response(server_response: ServerResponse):
	if not server_response.success:
		error_rich_text_label.text = server_response.error
		_reset_login_button()
		return
	_fade_out()

func _fade_out():
	var tween: Tween = create_tween()
	tween.tween_property(fade_color_rect, "color:a", 1.0, fade_duration).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)
	tween.tween_callback(_change_room)

func _change_room() -> void:
	get_tree().change_scene_to_file("res://levels/bedroom/bedroom.tscn")

func _reset_login_button() -> void:
	login_button.disabled = false
	login_button.text = "Login"

func _on_login_button_pressed() -> void:
	login_button.disabled = true
	login_button.text = "Logging in..."
	APIManager.login(email_line_edit.text, password_line_edit.text, _on_login_response)
