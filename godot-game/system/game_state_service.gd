extends Node

signal room_set_up_completed

@onready var scene_changer_controller = SceneChangerController

var current_room: Node2D

var is_was_pet_bought: bool = false
var is_was_experiment_completed: bool = false

func set_up_room(
	room: Node2D,
	scene_transition: SceneTransition,
	player: Player, 
	start_room_function: Callable = Callable(),
	boba_the_cat: BobaTheCat = null
) -> void:
	
	if boba_the_cat and scene_changer_controller.is_pet_with_player:
		boba_the_cat.global_position = Vector2(player.global_position.x + scene_changer_controller.PET_MIN_DISTANCE_FROM_PLAYER, player.global_position.y)
	else:
		boba_the_cat.set_pet_invisible()
	
	scene_transition.room_changed.connect(room_set_up_finished)
	
	if start_room_function.is_valid():
		self.room_set_up_completed.connect(start_room_function)
	
	self.current_room = room
	
	scene_changer_controller.set_up_room(player, boba_the_cat)
	
	player.set_player_as_not_in_cutscene()
	scene_transition.fade_in()

func room_set_up_finished():
	emit_signal("room_set_up_completed")

func buy_pet():
	is_was_pet_bought = true

func is_pet_owned() -> bool:
	return is_was_pet_bought

func experiment_completed() -> void:
	is_was_experiment_completed = true

func is_experiment_completed() -> bool:
	return is_was_experiment_completed
