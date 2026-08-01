extends Node

var player_state: Player.States = Player.States.WALK
var player_gender: PlayerCompositeSprite.Gender = PlayerCompositeSprite.Gender.MALE
var player_start_position: Vector2 = Vector2.ZERO
var player_direction_to_face: Vector2
var is_pet_following_player = false
var is_pet_with_player = false

const PET_MIN_DISTANCE_FROM_PLAYER: int = 10

func set_up_room(player: Player, boba_the_cat: BobaTheCat) -> void:
	
	# used for debug mode when you want player to start in its scene position
	if player_start_position == Vector2.ZERO:
		return
	
	player.state = player_state
	player.global_position = player_start_position
	player.face_direction(player_direction_to_face)
	player.set_gender(player_gender)
	
	if boba_the_cat != null:
		
		var pet_next_position: Vector2 = Vector2.ZERO
		var pet_next_face_direction: Vector2 = Vector2.DOWN
		
		match player_direction_to_face:
			Vector2.UP:
				pet_next_position = Vector2(player_start_position.x,player_start_position.y+PET_MIN_DISTANCE_FROM_PLAYER)
			Vector2.DOWN:
				pet_next_position = Vector2(player_start_position.x,player_start_position.y-PET_MIN_DISTANCE_FROM_PLAYER)
			Vector2.LEFT:
				pet_next_position = Vector2(player_start_position.x+PET_MIN_DISTANCE_FROM_PLAYER,player_start_position.y)
			Vector2.RIGHT:
				pet_next_position = Vector2(player_start_position.x-PET_MIN_DISTANCE_FROM_PLAYER,player_start_position.y)
		pet_next_face_direction = player_direction_to_face
		
		if is_pet_following_player:
			boba_the_cat.start_player_follow()
		else:
			boba_the_cat.stop_player_follow()
		
		boba_the_cat.global_position = pet_next_position
		boba_the_cat.face_direction(pet_next_face_direction)
