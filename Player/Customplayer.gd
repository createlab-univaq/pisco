extends Node2D

@onready var player_visual = $PlayerVisual

func _on_change_hair_pressed() -> void:
	player_visual.change_part("hair", 1)

func _on_change_face_pressed() -> void:
	player_visual.change_part("face", 1)

func _on_change_shirt_pressed() -> void:
	player_visual.change_part("shirt", 1)

func _on_change_shoes_pressed() -> void:
	player_visual.change_part("shoes", 1)

func _on_change_pants_pressed() -> void:
	player_visual.change_part("pants", 1)

func _on_change_body_pressed() -> void:
	player_visual.change_part("body", 1)

func _on_randomize_button_pressed() -> void:
	player_visual.randomize_character()

func _on_change_gender_pressed() -> void:
	player_visual.change_gender()

func _on_change_shirt_2_pressed() -> void:
	player_visual.change_part("shirt", -1)

func _on_change_hair_2_pressed() -> void:
	player_visual.change_part("hair", -1)

func _on_change_body_2_pressed() -> void:
	player_visual.change_part("body", -1)

func _on_change_pants_2_pressed() -> void:
	player_visual.change_part("pants", -1)

func _on_change_shoes_2_pressed() -> void:
	player_visual.change_part("shoes", -1)

func _on_change_face_2_pressed() -> void:
	player_visual.change_part("face", -1)
