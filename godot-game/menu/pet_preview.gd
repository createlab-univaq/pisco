class_name PetPreview
extends AnimatedSprite2D

@onready var timer: Timer = $Timer

var is_following: bool = false

const IDLE_TIMER_INTERVAL_IN_SECONDS: int = 5

func _ready():
	timer.wait_time = IDLE_TIMER_INTERVAL_IN_SECONDS
	timer.start()

func _play_animation():
	timer.stop()
	
	var animation_key: String = "idle"
	if is_following:
		animation_key = "walk"
	self.play(animation_key)

func follow():
	is_following = true
	_play_animation()

func unfollow():
	is_following = false
	_play_animation()

func _on_idle_animation_finished():
	self.animation_finished.disconnect(_on_idle_animation_finished)
	self.play("still")
	timer.start()

func _on_timer_timeout() -> void:
	_play_animation()
	self.animation_finished.connect(_on_idle_animation_finished)
