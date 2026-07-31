class_name SceneTransition
extends Node

signal room_changed

@export var player: Player
@export var game_camera: GameCamera

@onready var color_rect: ColorRect = $ColorRect
@onready var animation_player: AnimationPlayer = $AnimationPlayer

const FADE_OUT_KEY = "fade_out"
const FADE_IN_KEY = "fade_in"

var color_on_fade_out: Color = Color(0,0,0,0)
var color_on_fade_in: Color

var scene_to_change_into_path: String = ""

func _ready():
	assert(player, "No player selected")
	assert(game_camera, "No game camera selected")
	color_rect.visible = false
	# prevents screen to flick because color rect's color on_ready must be the same color 
	# as the one with which the fade in animations starts with
	camera_set_up()
	color_set_up()
	
	animation_player.animation_finished.connect(animation_finished)

func camera_set_up():
	color_on_fade_in = Color(0,0,0,1)

func color_set_up():
	color_rect.color = Color(Color.BLACK)

func fade_out(scene_path: String) -> void:
	assert(scene_path, "No scene selected")
	scene_to_change_into_path = scene_path
	color_rect.color = color_on_fade_out
	play_animation(FADE_OUT_KEY)

func fade_in():
	color_rect.color = color_on_fade_in
	play_animation(FADE_IN_KEY)

func play_animation(animation_key: String):
	color_rect.global_position = game_camera.top_left.global_position
	var new_size = Vector2(game_camera.bottom_right.global_position.x + abs(game_camera.top_left.global_position.x), game_camera.bottom_right.global_position.y + abs(game_camera.top_left.global_position.y))
	color_rect.size = new_size
	color_rect.visible = true
	player.exit_room()
	animation_player.play(animation_key)
	
func animation_finished(anim_name):
	if anim_name == FADE_OUT_KEY:
		fade_out_animation_finished()
	else:
		fade_in_animation_finished()

func fade_out_animation_finished():
	assert(scene_to_change_into_path != '', "No scene selected")
	get_tree().change_scene_to_file(scene_to_change_into_path)

func fade_in_animation_finished():
	player.enter_room()
	emit_signal("room_changed")
