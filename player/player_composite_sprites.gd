class_name PlayerCompositeSprite
extends Node

@onready var sprites: Dictionary = {
	BodyPart.BODY: $BodySprite2D,
	BodyPart.FACE: $FaceSprite2D,
	BodyPart.PANTS: $PantsSprite2D,
	BodyPart.SHIRT: $ShirtSprite2D,
	BodyPart.SHOES: $ShoesSprite2D,
	BodyPart.HAIR: $HairSprite2D,
}

@onready var rng: RandomNumberGenerator = RandomNumberGenerator.new()

const SPRITESHEET = {
	Gender.MALE: {
		BodyPart.BODY: [
			preload("res://sprites/chara/player_composite_spritesheet/male/body/body2.png"),
		],
		BodyPart.FACE: [
			preload("res://sprites/chara/player_composite_spritesheet/male/face/Neutral_male.png"),
			preload("res://sprites/chara/player_composite_spritesheet/male/face/Angry_male.png"),
			preload("res://sprites/chara/player_composite_spritesheet/male/face/happy_male.png"),
			preload("res://sprites/chara/player_composite_spritesheet/male/face/sad_male.png"),
		],
		BodyPart.HAIR: [
			preload("res://sprites/chara/player_composite_spritesheet/male/hair/spiked_blonde.png"),
			preload("res://sprites/chara/player_composite_spritesheet/male/hair/short_brown.png"),
			preload("res://sprites/chara/player_composite_spritesheet/male/hair/afro_black.png"),
			preload("res://sprites/chara/player_composite_spritesheet/male/hair/afro_blonde.png"),
		],
		BodyPart.PANTS: [
			preload("res://sprites/chara/player_composite_spritesheet/male/pants/pantaloons_brown.png"),
			preload("res://sprites/chara/player_composite_spritesheet/male/pants/pantaloons_teal.png"),
			preload("res://sprites/chara/player_composite_spritesheet/male/pants/shorts_brown.png"),
			preload("res://sprites/chara/player_composite_spritesheet/male/pants/shorts_red.png"),
		],
		BodyPart.SHIRT: [
			preload("res://sprites/chara/player_composite_spritesheet/male/shirt/longsleeve_red.png"),
			preload("res://sprites/chara/player_composite_spritesheet/male/shirt/longsleeve_teal.png"),
			preload("res://sprites/chara/player_composite_spritesheet/male/shirt/sleeveless_balck.png"),
			preload("res://sprites/chara/player_composite_spritesheet/male/shirt/sleeveless_white.png"),
		],
		BodyPart.SHOES: [
			preload("res://sprites/chara/player_composite_spritesheet/male/shoes/shoes1.png"),
			preload("res://sprites/chara/player_composite_spritesheet/male/shoes/shoes2.png"),
			preload("res://sprites/chara/player_composite_spritesheet/male/shoes/shoes3.png"),
		]
	},
	Gender.FEMALE: {
		BodyPart.BODY: [
			preload("res://sprites/chara/player_composite_spritesheet/female/body/body1.png")
		],
		BodyPart.FACE: [
			preload("res://sprites/chara/player_composite_spritesheet/female/face/neutral_famale.png"),
			preload("res://sprites/chara/player_composite_spritesheet/female/face/angry_famale.png"),
			preload("res://sprites/chara/player_composite_spritesheet/female/face/happy_famale.png"),
			preload("res://sprites/chara/player_composite_spritesheet/female/face/sad_famale.png"),
		],
		BodyPart.HAIR: [
			preload("res://sprites/chara/player_composite_spritesheet/female/hair/curly_long_ash.png"),
			preload("res://sprites/chara/player_composite_spritesheet/female/hair/curly_long_brown.png"),
			preload("res://sprites/chara/player_composite_spritesheet/female/hair/curly_short_blond.png"),
			preload("res://sprites/chara/player_composite_spritesheet/female/hair/curly_short_brown.png"),
		],
		BodyPart.PANTS: [
			preload("res://sprites/chara/player_composite_spritesheet/female/pants/leggings_pink.png"),
			preload("res://sprites/chara/player_composite_spritesheet/female/pants/leggings_white.png"),
			preload("res://sprites/chara/player_composite_spritesheet/female/pants/skirt_brown.png"),
			preload("res://sprites/chara/player_composite_spritesheet/female/pants/skirt_sky.png"),
		],
		BodyPart.SHIRT: [
			preload("res://sprites/chara/player_composite_spritesheet/female/shirt/blouse_black.png"),
			preload("res://sprites/chara/player_composite_spritesheet/female/shirt/blouse_lavander.png"),
			preload("res://sprites/chara/player_composite_spritesheet/female/shirt/sleeveless_navy.png"),
			preload("res://sprites/chara/player_composite_spritesheet/female/shirt/sleeveless_white.png"),
		],
		BodyPart.SHOES: [
			preload("res://sprites/chara/player_composite_spritesheet/female/shoes/shoes_brown.png"),
			preload("res://sprites/chara/player_composite_spritesheet/female/shoes/reverside_blue.png"),
			preload("res://sprites/chara/player_composite_spritesheet/female/shoes/ghillies_black.png"),
		]
	}
}

enum Gender {
	MALE,
	FEMALE
}

enum BodyPart {
	BODY,
	FACE,
	PANTS,
	SHIRT,
	SHOES,
	HAIR
}

var current_gender: Gender = Gender.MALE

var current_sprites: Dictionary = {
	BodyPart.BODY: 0,
	BodyPart.FACE: 0,
	BodyPart.PANTS: 0,
	BodyPart.SHIRT: 0,
	BodyPart.SHOES: 0,
	BodyPart.HAIR: 0,
}

func _ready() -> void:
	rng.randomize()
	update_character()

func update_character() -> void:
	for part_key in current_sprites.keys():
		update_part(part_key)

func change_part(part: BodyPart, direction: int) -> void:
	var spritesheet = get_spritesheet(part)
	current_sprites[part] = (current_sprites[part] + direction + spritesheet.size()) % spritesheet.size()
	update_part(part)

func reset_parts() -> void:
	for part in current_sprites.keys():
		current_sprites[part] = 0

func randomize_character() -> void:
	for part in current_sprites.keys():
		current_sprites[part] = rng.randi_range(0, get_spritesheet(part).size() - 1)
	update_character()

func change_gender() -> void:
	current_gender = Gender.FEMALE if current_gender == Gender.MALE else Gender.MALE
	reset_parts()
	update_character()

func update_part(part: BodyPart) -> void:
	sprites[part].texture = get_spritesheet(part)[current_sprites[part]]

func get_spritesheet(part: BodyPart) -> Array:
	return SPRITESHEET[current_gender][part]

# Utility functions

func change_to_next_hair():
	change_part(BodyPart.HAIR, 1)

func change_to_next_face():
	change_part(BodyPart.FACE, 1)

func change_to_next_shirt():
	change_part(BodyPart.SHIRT, 1)

func change_to_next_shoes():
	change_part(BodyPart.SHOES, 1)

func change_to_next_pants():
	change_part(BodyPart.PANTS, 1)

func change_to_next_body():
	change_part(BodyPart.BODY, 1)

func change_to_previous_hair():
	change_part(BodyPart.HAIR, -1)

func change_to_previous_face():
	change_part(BodyPart.FACE, -1)

func change_to_previous_shirt():
	change_part(BodyPart.SHIRT,-1)

func change_to_previous_shoes():
	change_part(BodyPart.SHOES,-1)

func change_to_previous_pants():
	change_part(BodyPart.PANTS,-1)

func change_to_previous_body():
	change_part(BodyPart.BODY, -1)
