extends Node

signal wardrobe_open_requested
signal store_open_requested
signal pethouse_open_requested

func _on_wardrobe_actionable_actioned(_tile: Actionable, _player: Player) -> void:
	wardrobe_open_requested.emit()

func _on_pethouse_actionable_actioned(_tile: Actionable, _player: Player) -> void:
	pethouse_open_requested.emit()

func _on_pc_actionable_actioned(_tile: Actionable, _player: Player) -> void:
	store_open_requested.emit()
