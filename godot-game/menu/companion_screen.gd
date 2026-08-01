class_name CompanionScreen
extends Control

signal follow_player_changed(following: bool)

@onready var pet_preview: PetPreview = $OwnedPetControl/PetPreview
@onready var follow_button: Button = $OwnedPetControl/FollowButton
@onready var owned_pet_control: Control = $OwnedPetControl
@onready var no_pet_owned_control: Control = $NoPetOwnedControl

@export var boba_the_cat: BobaTheCat

var is_following: bool = false

var game_state_service = GameStateService
var scene_changer_controller = SceneChangerController

func _unhandled_input(event: InputEvent) -> void:
	# Check if the node is actually visible first, so we don't process unnecessarily
	if not is_visible_in_tree():
		return

	# 'ui_cancel' is mapped to the Escape key by default in Godot
	if event.is_action_pressed("ui_cancel"):
		hide()

		# Consume the input so the game doesn't also pause/react to the Esc key
		get_viewport().set_input_as_handled()

func _change_follow_button_text() -> void:
	var new_button_text: String = ""
	if not is_following:
		pet_preview.unfollow()
		new_button_text = "Follow"
	else:
		pet_preview.follow()
		new_button_text = "Unfollow"
	
	follow_button.text = new_button_text

func _on_follow_button_pressed() -> void:
	is_following = not is_following
	_change_follow_button_text()
	scene_changer_controller.is_pet_with_player = is_following
	follow_player_changed.emit(is_following)

func _on_visibility_changed() -> void:
	if visible:
		if game_state_service.is_pet_owned():
			owned_pet_control.show()
			no_pet_owned_control.hide()
			
			is_following = boba_the_cat.state == boba_the_cat.States.FOLLOW_PLAYER
			_change_follow_button_text()
		else:
			owned_pet_control.hide()
			no_pet_owned_control.show()
