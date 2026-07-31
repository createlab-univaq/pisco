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

@onready var animation_player: AnimationPlayer = $AnimationPlayer
@onready var animation_tree: AnimationTree = $AnimationTree
@onready var animation_state: AnimationNodeStateMachinePlayback = animation_tree.get("parameters/playback")
@onready var exclamation_mark_sprite_2d: Sprite2D = $ExclamationMarkSprite2D

@onready var actionable_detector: ActionableDetector = $ActionableDetector

const IDLE_ANIMATION_KEY: String = "Idle"
const WALK_ANIMATION_KEY: String = "Walk"

const ANIMATION_TREE_PARAMETERS: Array[String] = [
	"parameters/Idle/blend_position",
	"parameters/Walk/blend_position",
]

const SPRITESHEET = {
	Gender.MALE: {
		BodyPart.BODY: [
			preload("res://sprites/chara/player_composite_spritesheet/male/body/body1.png"),
		],
		BodyPart.FACE: [
			preload("res://sprites/chara/player_composite_spritesheet/male/face/neutral_male.png"),
		],
		BodyPart.HAIR: [
			preload("res://sprites/chara/player_composite_spritesheet/male/hair/geostellar_hair.png"),
		],
		BodyPart.PANTS: [
			preload("res://sprites/chara/player_composite_spritesheet/male/pants/geostellar_pants.png"),
		],
		BodyPart.SHIRT: [
			preload("res://sprites/chara/player_composite_spritesheet/male/shirt/geostellar_hoodie.png"),
		],
		BodyPart.SHOES: [
			preload("res://sprites/chara/player_composite_spritesheet/male/shoes/red_sneakers.png"),
		]
	},
	Gender.FEMALE: {
		BodyPart.BODY: [
			preload("res://sprites/chara/player_composite_spritesheet/female/body/body1.png")
		],
		BodyPart.FACE: [
			preload("res://sprites/chara/player_composite_spritesheet/female/face/neutral_famale.png"),
		],
		BodyPart.HAIR: [
			preload("res://sprites/chara/player_composite_spritesheet/female/hair/soniastrumm_purple.png"),
		],
		BodyPart.PANTS: [
			preload("res://sprites/chara/player_composite_spritesheet/female/pants/soniastrumm_skirt.png"),
		],
		BodyPart.SHIRT: [
			preload("res://sprites/chara/player_composite_spritesheet/female/shirt/soniastrumm_shirt.png"),
		],
		BodyPart.SHOES: [
			preload("res://sprites/chara/player_composite_spritesheet/female/shoes/blue_boots.png"),
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
	animation_tree.active = true
	_reset()
	
	rng.randomize()
	update_character()

func _reset() -> void:
	exclamation_mark_sprite_2d.hide()

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

func face_direction(direction: Vector2) -> void:
	for parameter in ANIMATION_TREE_PARAMETERS:
		animation_tree.set(parameter, direction)

func change_animation(animation_key: String) -> void:
	animation_state.travel(animation_key)

func get_facing_direction() -> Vector2:
	if ANIMATION_TREE_PARAMETERS.size() == 0:
		return Vector2.ZERO
	return animation_tree.get(ANIMATION_TREE_PARAMETERS[0])

func check_nearest_actionable():
	actionable_detector.check_nearest_actionable(get_facing_direction())

func disable_actionable_detector():
	actionable_detector.disable()

func enable_actionable_detector():
	actionable_detector.enable()

func _on_actionable_detector_actionable_detected() -> void:
	exclamation_mark_sprite_2d.show()

func _on_actionable_detector_actionable_lost() -> void:
	exclamation_mark_sprite_2d.hide()
