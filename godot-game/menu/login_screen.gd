extends Control

@onready var email_line_edit: LineEdit = $MarginContainer/VBoxContainer/EmailLineEdit
@onready var password_line_edit: LineEdit = $MarginContainer/VBoxContainer/PasswordLineEdit
@onready var error_rich_text_label: RichTextLabel = $MarginContainer/VBoxContainer/ErrorRichTextLabel
@onready var login_button: Button = $MarginContainer/VBoxContainer/MarginContainer/LoginButton

var api_manager: APIManager = APIManager

func _on_login_response(login_response: LoginResponse):
	print(login_response.success)
	if not login_response.success:
		error_rich_text_label.text = login_response.error
		return

func _on_login_button_pressed() -> void:
	api_manager.login(email_line_edit.text, password_line_edit.text, _on_login_response)
