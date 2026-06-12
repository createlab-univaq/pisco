extends Node2D

@onready var sprites := {
	"body": $Body,
	"face": $Face,
	"pants": $Pants,
	"shirt": $Shirt,
	"shoes": $Shoes,
	"hair": $Hair,
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

func change_part(part: String, direction: int) -> void:
	var spritesheet = get_spritesheet(part)
	current[part] = (current[part] + direction + spritesheet.size()) % spritesheet.size()
	update_part(part)

func reset_parts() -> void:
	for part in current.keys():
		current[part] = 0

func randomize_character() -> void:
	for part in current.keys():
		current[part] = rng.randi_range(0, get_spritesheet(part).size() - 1)
	update_character()

func change_gender() -> void:
	curr_gender = "female" if curr_gender == "male" else "male"
	reset_parts()
	update_character()
