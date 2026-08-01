extends Node2D

@onready var player: Player = $Player
@onready var boba_the_cat: BobaTheCat = $BobaTheCat
@onready var scene_transition: SceneTransition = $Transitions/SceneTransition
@onready var ldk_scene_changer_tile_collision_shape_2d: CollisionShape2D = $Transitions/LDKSceneChangerTile/Area2D/CollisionShape2D

var game_state_service = GameStateService

func _ready():
	if game_state_service.is_experiment_completed():
		ldk_scene_changer_tile_collision_shape_2d.disabled = true
	
	game_state_service.set_up_room(get_tree().current_scene, scene_transition, player, Callable(), boba_the_cat)

func _start_companion_player_following() -> void:
	boba_the_cat.global_position = player.global_position + Vector2(0, 10)
	boba_the_cat.start_player_follow()
	boba_the_cat.set_pet_visible()

func _stop_companion_player_following() -> void:
	boba_the_cat.stop_player_follow()
	boba_the_cat.set_pet_invisible()

func _on_pet_shop_screen_pet_bought() -> void:
	_start_companion_player_following()

func _on_companion_screen_follow_player_changed(following: bool) -> void:
	if following:
		_start_companion_player_following()
	else:
		_stop_companion_player_following()
