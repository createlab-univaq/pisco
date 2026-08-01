extends CanvasLayer

@onready var custom_player_screen: CustomPlayerScreen = $CustomPlayerScreen
@onready var pet_shop_screen: PetShopScreen = $PetShopScreen

func _ready() -> void:
	custom_player_screen.hide()
	pet_shop_screen.hide()

func _on_actionables_wardrobe_open_requested() -> void:
	custom_player_screen.show()

func _on_pc_actionable_actioned(tile: Actionable, player: Player) -> void:
	pet_shop_screen.show()
