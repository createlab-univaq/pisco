class_name CompanionScreen
extends Control

@onready var pet_preview: PetPreview = $PetPreview
@onready var follow_button: Button = $FollowButton

var is_following: bool = false

func _unhandled_input(event: InputEvent) -> void:
	# Check if the node is actually visible first, so we don't process unnecessarily
	if not is_visible_in_tree():
		return

	# 'ui_cancel' is mapped to the Escape key by default in Godot
	if event.is_action_pressed("ui_cancel"):
		hide()

		# Consume the input so the game doesn't also pause/react to the Esc key
		get_viewport().set_input_as_handled()

func _on_follow_button_pressed() -> void:
	var new_button_text: String = ""
	if not is_following:
		pet_preview.follow()
		new_button_text = "Unfollow"
	else:
		pet_preview.unfollow()
		new_button_text = "Follow"
	
	follow_button.text = new_button_text
	is_following = not is_following
