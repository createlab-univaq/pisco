extends Node2D

@onready var player: Player = $Player
@onready var scene_transition: SceneTransition = $Transitions/SceneTransition

var game_state_service = GameStateService

func _ready():
	game_state_service.set_up_room(get_tree().current_scene, scene_transition, player, Callable())
