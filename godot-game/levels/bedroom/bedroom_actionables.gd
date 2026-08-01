extends Node

signal wardrobe_open_requested

func _on_wardrobe_actionable_actioned(_tile: Actionable, _player: Player) -> void:
	wardrobe_open_requested.emit()
