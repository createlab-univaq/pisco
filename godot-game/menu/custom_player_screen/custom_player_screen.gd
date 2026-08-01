class_name CustomPlayerScreen
extends Control

@export var player: Player

@onready var player_composite_sprite: PlayerCompositeSprite = $PlayerCompositeSprite

func _ready() -> void:
	assert(player, "No Player Selected")
	setup()

func setup() -> void:
	player_composite_sprite.set_gender(player.get_gender())

func _unhandled_input(event: InputEvent) -> void:
	# Check if the node is actually visible first, so we don't process unnecessarily
	if not is_visible_in_tree():
		return

	# 'ui_cancel' is mapped to the Escape key by default in Godot
	if event.is_action_pressed("ui_cancel"):
		hide()

		# Consume the input so the game doesn't also pause/react to the Esc key
		get_viewport().set_input_as_handled()

func _on_randomize_button_pressed() -> void:
	player_composite_sprite.randomize_character()

func _on_change_gender_button_pressed() -> void:
	player_composite_sprite.change_gender()
	player.player_composite_sprite.change_gender()

func _on_visibility_changed() -> void:
	if visible:
		setup()
