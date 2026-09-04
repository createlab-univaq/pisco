class_name Stopwatch
extends Node

var time_elapsed: float = 0.0
var is_running: bool = false

func _ready() -> void:
	stop_and_reset()

func _process(delta: float) -> void:
	if is_running:
		# delta is in seconds. Multiply by 1000 to add milliseconds
		time_elapsed += delta * 1000.0

func start() -> void:
	is_running = true

func stop() -> void:
	is_running = false

func reset() -> void:
	time_elapsed = 0.0

func stop_reset_and_restart() -> void:
	stop()
	reset()
	start()

func stop_and_reset() -> void:
	stop()
	reset()

func reset_and_restart() -> void:
	reset()
	start()
