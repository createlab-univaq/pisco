extends CharacterBody2D

class_name Player

const MAX_SPEED: float = 200.0
const ACCELERATION: float = 800.0
const FRICTION: float = 1000.0

var facing_direction: Vector2 = Vector2.DOWN

func _physics_process(delta: float) -> void:
	var direction: Vector2 = Input.get_vector(
		"ui_left",
		"ui_right",
		"ui_up",
		"ui_down"
	)

	if direction != Vector2.ZERO:
		facing_direction = direction
		_move(direction, delta)
	else:
		_idle(delta)

	move_and_slide()


func _move(direction: Vector2, delta: float) -> void:
	velocity = velocity.move_toward(
		direction * MAX_SPEED,
		ACCELERATION * delta
	)


func _idle(delta: float) -> void:
	velocity = velocity.move_toward(
		Vector2.ZERO,
		FRICTION * delta
	)
