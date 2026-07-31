extends Node

signal room_set_up_completed

@onready var scene_changer_controller = SceneChangerController

var current_room: Node2D

func set_up_room(
	room: Node2D,
	scene_transition: SceneTransition,
	player: Player, 
	start_room_function: Callable = Callable(),
) -> void:
	
	scene_transition.room_changed.connect(room_set_up_finished)
	
	if start_room_function.is_valid():
		self.room_set_up_completed.connect(start_room_function)
	
	self.current_room = room
	
	scene_changer_controller.set_up_room(player)
	
	player.set_player_as_not_in_cutscene()
	scene_transition.fade_in()

func room_set_up_finished():
	emit_signal("room_set_up_completed")
