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

func _physics_process(_delta) -> void:
	match state:
		States.WALK:
			walk_state()

func walk_state() -> void:
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
