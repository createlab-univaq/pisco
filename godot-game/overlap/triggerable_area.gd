class_name TriggerableArea
extends Area2D

signal area_triggered

enum Directions {
	NO_DIRECTION,
	UP,
	DOWN,
	RIGHT,
	LEFT
}

const DIRECTIONS_MAP: Dictionary = {
	Directions.UP: Vector2.UP,
	Directions.DOWN: Vector2.DOWN,
	Directions.RIGHT: Vector2.RIGHT,
	Directions.LEFT: Vector2.LEFT
}

@export var direction: Directions = Directions.NO_DIRECTION

var player: Player = null

func _ready() -> void:
	set_physics_process(false)

func _physics_process(_delta: float) -> void:
	if not player:
		return
		
	var is_omni: bool = (direction == Directions.NO_DIRECTION)
	var is_facing: bool = false
	
	if not is_omni:
		var required_dir: Vector2 = DIRECTIONS_MAP[direction]
		# is_equal_approx prevents floating point errors
		is_facing = player.get_facing_direction().is_equal_approx(required_dir)
		
	if is_omni or is_facing:
		area_triggered.emit()
		_reset()

func _reset() -> void:
	set_physics_process(false)
	player = null

func _on_body_entered(body: Node2D) -> void:
	if body is Player:
		player = body
		set_physics_process(true)

func _on_body_exited(body: Node2D) -> void:
	if body == player:
		_reset()
