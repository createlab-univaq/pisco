class_name BobaTheCat
extends CharacterBody2D

@export var SPEED: int = 150
@export var player: Player

@onready var animation_player: AnimationPlayer = $AnimationPlayer
@onready var animation_tree: AnimationTree = $AnimationTree
@onready var animation_state: AnimationNodeStateMachinePlayback = animation_tree.get("parameters/playback")
@onready var collision_shape_2D: CollisionShape2D = $CollisionShape2D
@onready var pet_actionable: Actionable = $PetActionable
@onready var pet_actionable_collision_shape_2d: CollisionShape2D = $PetActionable/Area2D/CollisionShape2D

enum States {
	IDLE,
	FOLLOW_PLAYER,
	PET
}

var state: States = States.IDLE
var state_before_petting: States = States.IDLE

const DISTANCE_IN_BETWEEN: int = 15
const MINIMUM_DISTANCE_IN_BETWEEN: int = 10

const IDLE_ANIMATION_KEY = "Idle"
const WALK_ANIMATION_KEY = "Walk"
const PET_ANIMATION_KEY = "Pet"

const ANIMATION_TREE_PARAMETERS = [
	"parameters/Idle/blend_position",
	"parameters/Walk/blend_position",
	"parameters/Pet/blend_position"
]

func _ready():
	assert(player, "No player selected")
	pet_actionable.player = player
	animation_tree.active = true
	
func _physics_process(_delta):
	match state:
		States.IDLE:
			pass
		States.FOLLOW_PLAYER:
			_follow_player_state()
		States.PET:
			_pet_state()

func start_player_follow():
	_change_state(States.FOLLOW_PLAYER)

func stop_player_follow():
	_change_state(States.IDLE)

func _change_state(new_state: States) -> void:
	match state:
		States.FOLLOW_PLAYER:
			velocity = Vector2.ZERO
			collision_shape_2D.disabled = false
	
	match new_state:
		States.FOLLOW_PLAYER:
			collision_shape_2D.disabled = true
		States.PET:
			state_before_petting = state
			face_direction(-player.get_facing_direction())
			animation_state.travel(PET_ANIMATION_KEY)
	
	state = new_state

func _follow_player_state():
	var target_position = (player.position - position).normalized()
	var distance = position.distance_to(player.position)
	var new_body_direction = player.get_facing_direction()
	
	if new_body_direction != Vector2.ZERO:
		if distance < MINIMUM_DISTANCE_IN_BETWEEN or distance > DISTANCE_IN_BETWEEN:
			face_direction(new_body_direction)
		
		if distance > DISTANCE_IN_BETWEEN:
			animation_state.travel(WALK_ANIMATION_KEY)
			velocity = velocity.move_toward(target_position * SPEED, SPEED)
			move_and_slide()
		
	else:
		animation_state.travel(IDLE_ANIMATION_KEY)
		velocity = Vector2.ZERO
	
	# prevents some sprite_2D bugs and also that npc continues to walk when player is in cutscene or going from one room to another
	if player.velocity == Vector2.ZERO:
		animation_state.travel(IDLE_ANIMATION_KEY)
		velocity = Vector2.ZERO

func _pet_state() -> void:
	if state_before_petting == States.FOLLOW_PLAYER:
		var distance = position.distance_to(player.position)
		if distance > DISTANCE_IN_BETWEEN:
			_change_state(States.FOLLOW_PLAYER)

func face_direction(direction: Vector2) -> void:
	for parameter in ANIMATION_TREE_PARAMETERS:
		animation_tree.set(parameter, direction)

func get_facing_direction() -> Vector2:
	if ANIMATION_TREE_PARAMETERS.size() == 0:
		return Vector2.ZERO
	return animation_tree.get(ANIMATION_TREE_PARAMETERS[0])

func set_pet_invisible() -> void:
	hide()
	collision_shape_2D.disabled = true
	pet_actionable_collision_shape_2d.disabled = true

func set_pet_visible() -> void:
	show()
	collision_shape_2D.disabled = false
	pet_actionable_collision_shape_2d.disabled = false

func _on_pet_actionable_actioned(_tile: Actionable, _player: Player) -> void:
	_change_state(States.PET)

func pet_animation_finished() -> void:
	_change_state(state_before_petting)
