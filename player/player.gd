class_name Player
extends CharacterBody2D

@export var SPEED: int = MAX_DEFAULT_SPEED

const MAX_DEFAULT_SPEED: int = 500

enum States {
	WALK
}

var state: States = States.WALK

func _physics_process(_delta) -> void:
	match state:
		States.WALK:
			walk_state()

func walk_state() -> void:
	var inputVector: Vector2 = Vector2.ZERO
	
	inputVector.x = Input.get_action_strength("ui_right") - Input.get_action_strength("ui_left")
	inputVector.y = Input.get_action_strength("ui_down") - Input.get_action_strength("ui_up")
	inputVector = inputVector.normalized()
	
	if inputVector != Vector2.ZERO:
		velocity = velocity.move_toward(inputVector * SPEED, SPEED)
	else:
		velocity = Vector2.ZERO

	move_and_slide()
