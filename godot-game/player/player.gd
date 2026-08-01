class_name Player
extends CharacterBody2D

@export var SPEED: int = MAX_DEFAULT_SPEED

@onready var player_composite_sprite: PlayerCompositeSprite = $PlayerCompositeSprite

const MAX_DEFAULT_SPEED: int = 500

enum States {
	WALK
}

var state: States = States.WALK
var player_direction: Vector2 = Vector2.DOWN
var is_player_in_cutscene: bool = false

func _physics_process(_delta) -> void:
	if is_player_in_cutscene:
		return
	
	player_composite_sprite.check_nearest_actionable()
	
	match state:
		States.WALK:
			_walk_state()

func _walk_state() -> void:
	var input_vector: Vector2 = Vector2.ZERO
	
	input_vector.x = Input.get_action_strength("ui_right") - Input.get_action_strength("ui_left")
	input_vector.y = Input.get_action_strength("ui_down") - Input.get_action_strength("ui_up")
	input_vector = input_vector.normalized()
	
	if input_vector != Vector2.ZERO:
		player_direction = input_vector
		player_composite_sprite.face_direction(input_vector)
		player_composite_sprite.change_animation(player_composite_sprite.WALK_ANIMATION_KEY)
		velocity = velocity.move_toward(input_vector * SPEED, SPEED)
	else:
		player_composite_sprite.change_animation(player_composite_sprite.IDLE_ANIMATION_KEY)
		velocity = Vector2.ZERO

	move_and_slide()

func set_player_as_in_cutscene():
	velocity = Vector2.ZERO
	player_composite_sprite.change_animation(player_composite_sprite.IDLE_ANIMATION_KEY)
	is_player_in_cutscene = true
	player_composite_sprite.disable_actionable_detector()

func set_player_as_not_in_cutscene():
	is_player_in_cutscene = false
	player_composite_sprite.enable_actionable_detector()

func set_player_as_in_dialogue():
	set_player_as_in_cutscene()

func set_player_as_not_in_dialogue():
	set_player_as_not_in_cutscene()

func get_facing_direction() -> Vector2:
	return player_composite_sprite.get_facing_direction()

func face_direction(direction: Vector2) -> void:
	player_composite_sprite.face_direction(direction)

func enter_room():
	set_player_as_not_in_cutscene()

func exit_room():
	set_player_as_in_cutscene()

func set_gender(gender: PlayerCompositeSprite.Gender) -> void:
	player_composite_sprite.set_gender(gender)

func get_gender() -> PlayerCompositeSprite.Gender:
	return player_composite_sprite.get_gender()
