class_name SceneChangerTile
extends Node2D

enum Directions {
	NONE,
	UP,
	DOWN,
	RIGHT,
	LEFT
}

@export var scene_transition: SceneTransition
@export var scene_to_change_into: String
@export var player_next_room_spawn_position: Vector2
@export var direction: Directions = Directions.NONE

var player: Player = null
var changing_room: bool = false

var scene_changer_controller = SceneChangerController

const directions_array = [Vector2.ZERO, Vector2.UP, Vector2.DOWN, Vector2.RIGHT, Vector2.LEFT, Vector2.INF]

func _ready():
	assert(scene_transition, "No scene transition selected")
	assert(scene_to_change_into,"No scene selected")
	assert(player_next_room_spawn_position,"No player next room spawn position selected")
	assert(direction != Directions.NONE, "No direction selected")

func _physics_process(_delta):
	if !changing_room and player != null:
		scene_changer_controller.player_state = player.state
		scene_changer_controller.player_start_position = player_next_room_spawn_position
		scene_changer_controller.player_direction_to_face = directions_array[direction]
		
		scene_transition.fade_out(scene_to_change_into)
		changing_room = true

func _on_area_2d_body_entered(body):
	if body is Player:
		player = body
	else:
		player = null
