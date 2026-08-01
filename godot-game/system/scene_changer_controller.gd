extends Node

var player_state: Player.States = Player.States.WALK
var player_gender: PlayerCompositeSprite.Gender = PlayerCompositeSprite.Gender.MALE
var player_start_position: Vector2 = Vector2.ZERO
var player_direction_to_face: Vector2

func set_up_room(player: Player) -> void:
	
	# used for debug mode when you want player to start in its scene position
	if player_start_position == Vector2.ZERO:
		return
	
	player.state = player_state
	player.global_position = player_start_position
	player.face_direction(player_direction_to_face)
	player.set_gender(player_gender)
