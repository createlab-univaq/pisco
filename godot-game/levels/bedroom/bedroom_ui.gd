extends CanvasLayer

@onready var custom_player_screen: CustomPlayerScreen = $CustomPlayerScreen

func _on_actionables_wardrobe_open_requested() -> void:
	custom_player_screen.show()
