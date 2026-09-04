class_name FirstInputInterceptor
extends Node

signal first_input_detected

func _ready() -> void:
	# Ensure it starts completely dormant
	set_process_input(false)

func _input(event: InputEvent) -> void:
	if event is InputEventMouseMotion or event.is_pressed():
		
		# Immediately shut off further input processing 
		# so this mathematically can only fire once.
		stop_listening()
		
		# Tell whatever is listening that the input happened
		first_input_detected.emit()

func start_listening() -> void:
	set_process_input(true)

func stop_listening() -> void:
	set_process_input(false)
