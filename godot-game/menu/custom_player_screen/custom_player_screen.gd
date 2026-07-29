class_name CustomPlayerScreen
extends Node2D

@onready var player_composite_sprite: PlayerCompositeSprite = $PlayerCompositeSprite

func _on_randomize_button_pressed() -> void:
	player_composite_sprite.randomize_character()

func _on_change_gender_button_pressed() -> void:
	player_composite_sprite.change_gender()
