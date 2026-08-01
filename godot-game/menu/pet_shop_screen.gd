class_name PetShopScreen
extends Control

signal pet_bought

var game_state_service = GameStateService

@onready var buy_button: Button = $BuyInterfaceControl/BuyButton
@onready var coin_label: Label = $BuyInterfaceControl/CoinLabel
@onready var buy_interface_control: Control = $BuyInterfaceControl
@onready var everything_bought_control: Control = $EverythingBoughtControl

func _unhandled_input(event: InputEvent) -> void:
	# Check if the node is actually visible first, so we don't process unnecessarily
	if not is_visible_in_tree():
		return

	# 'ui_cancel' is mapped to the Escape key by default in Godot
	if event.is_action_pressed("ui_cancel"):
		hide()

		# Consume the input so the game doesn't also pause/react to the Esc key
		get_viewport().set_input_as_handled()

func _on_buy_button_pressed() -> void:
	game_state_service.buy_pet()
	hide()
	pet_bought.emit()

func _on_visibility_changed() -> void:
	if visible:
		if not game_state_service.is_pet_owned():
			buy_interface_control.show()
			everything_bought_control.hide()
			
			var owned_coins: int = 0
			if game_state_service.is_experiment_completed():
				owned_coins = 50
			coin_label.text = "Monete disponibili: %s/50" % [str(owned_coins)]
			buy_button.disabled = not game_state_service.is_experiment_completed()
		else:
			buy_interface_control.hide()
			everything_bought_control.show()
