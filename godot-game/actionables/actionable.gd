class_name Actionable 
extends Marker2D

signal actioned(tile: Actionable, player: Player)

@onready var collision_shape_2d: CollisionShape2D = $Area2D/CollisionShape2D

@export var player: Player
@export var exclamation_mark_facing_direction: Directions = Directions.NONE
@export var is_avoid_player_check: bool = false

var directions_array: Array[Vector2] = [Vector2.ZERO, Vector2.UP, Vector2.DOWN, Vector2.RIGHT, Vector2.LEFT, Vector2.INF]
var is_area_active: bool = false

enum Directions {
	NONE,
	UP,
	DOWN,
	RIGHT,
	LEFT,
	NO_DIRECTION
}

func _ready():
	if !is_avoid_player_check:
		assert(player, "No player selected")
	assert(exclamation_mark_facing_direction != Directions.NONE, "No exclamation mark faction direction selected")

func _input(event):
	if is_area_active and (directions_array[Directions.NO_DIRECTION] == directions_array[exclamation_mark_facing_direction] or player.get_facing_direction() == directions_array[exclamation_mark_facing_direction]) and (event.is_action_pressed("interact") or event.is_action_pressed("ui_accept")):
		is_area_active = false
		emit_signal("actioned", self, player)

func disable_collision_shape() -> void:
	collision_shape_2d.disabled = true
