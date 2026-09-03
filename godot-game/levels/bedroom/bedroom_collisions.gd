extends Node2D

signal input_code_screen_open_requested

func _on_triggerable_area_area_triggered() -> void:
	input_code_screen_open_requested.emit()
