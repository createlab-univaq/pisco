extends Node2D

@onready var sprites := {
	"body": $CompositeSprites/Body,
	"face": $CompositeSprites/Face,
	"pants": $CompositeSprites/Pants,
	"shirt": $CompositeSprites/Shirt,
	"shoes": $CompositeSprites/Shoes,
	"hair": $CompositeSprites/Hair,
}

const composite_sprites = preload("res://Player/CompositeSpritesheets/CompositeSprites.gd")

var curr_gender := "male"

var current := {
	"body": 0,
	"face": 0,
	"pants": 0,
	"shirt": 0,
	"shoes": 0,
	"hair": 0,
}

var rng := RandomNumberGenerator.new()


func _ready() -> void:
	rng.randomize()
	update_character()


func get_spritesheet(part: String) -> Dictionary:
	return composite_sprites.spritesheets[curr_gender][part]


func update_part(part: String) -> void:
	sprites[part].texture = get_spritesheet(part)[current[part]]


func update_character() -> void:
	for part in current.keys():
		update_part(part)


func change_part(part: String) -> void:
	current[part] = (current[part] + 1) % get_spritesheet(part).size()
	update_part(part)


func reset_parts() -> void:
	for part in current.keys():
		current[part] = 0


func _on_change_hair_pressed() -> void:
	change_part("hair")


func _on_change_face_pressed() -> void:
	change_part("face")


func _on_change_shirt_pressed() -> void:
	change_part("shirt")


func _on_change_shoes_pressed() -> void:
	change_part("shoes")


func _on_change_pants_pressed() -> void:
	change_part("pants")


func _on_change_body_pressed() -> void:
	change_part("body")


func _on_randomize_button_pressed() -> void:
	for part in current.keys():
		current[part] = rng.randi_range(0, get_spritesheet(part).size() - 1)

	update_character()


func _on_change_gender_pressed() -> void:
	curr_gender = "female" if curr_gender == "male" else "male"

	reset_parts()
	update_character()
