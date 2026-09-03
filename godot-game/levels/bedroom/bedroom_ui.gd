extends CanvasLayer

@onready var custom_player_screen: CustomPlayerScreen = $CustomPlayerScreen
@onready var pet_shop_screen: PetShopScreen = $PetShopScreen
@onready var companion_screen: CompanionScreen = $CompanionScreen
@onready var input_code_screen: InputCodeScreen = $InputCodeScreen

func _ready() -> void:
	custom_player_screen.hide()
	pet_shop_screen.hide()
	companion_screen.hide()
	input_code_screen.hide()

func _on_actionables_wardrobe_open_requested() -> void:
	custom_player_screen.show()

func _on_actionables_store_open_requested() -> void:
	pet_shop_screen.show()

func _on_actionables_pethouse_open_requested() -> void:
	companion_screen.show()

func _on_collisions_input_code_screen_open_requested() -> void:
	input_code_screen.show()
