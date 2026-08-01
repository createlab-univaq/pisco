class_name PetShopScreen
extends Control

@onready var animated_sprite_2d: AnimatedSprite2D = $AnimatedSprite2D
@onready var timer: Timer = $Timer

const IDLE_TIMER_INTERVAL_IN_SECONDS: int = 5

func _ready():
	timer.wait_time = IDLE_TIMER_INTERVAL_IN_SECONDS
	timer.start()

func _unhandled_input(event: InputEvent) -> void:
	# Check if the node is actually visible first, so we don't process unnecessarily
	if not is_visible_in_tree():
		return

	# 'ui_cancel' is mapped to the Escape key by default in Godot
	if event.is_action_pressed("ui_cancel"):
		hide()

		# Consume the input so the game doesn't also pause/react to the Esc key
		get_viewport().set_input_as_handled()

func _play_idle_animation():
	animated_sprite_2d.play("idle")

func _on_idle_animation_finished():
	animated_sprite_2d.animation_finished.disconnect(_on_idle_animation_finished)
	animated_sprite_2d.play("still")
	timer.start()

func _on_timer_timeout() -> void:
	_play_idle_animation()
	animated_sprite_2d.animation_finished.connect(_on_idle_animation_finished)

func _on_buy_button_pressed() -> void:
	pass # Replace with function body.
