class_name CustomPlayerScreenComponent
extends HBoxContainer

@export var player_composite_sprite: PlayerCompositeSprite
@export var body_part: PlayerCompositeSprite.BodyPart

func _ready() -> void:
	assert(player_composite_sprite, "No PlayerCompositeSprite specified!")

func _on_change_previous_button_pressed() -> void:
	match body_part:
		PlayerCompositeSprite.BodyPart.BODY:
			player_composite_sprite.change_to_previous_body()
		PlayerCompositeSprite.BodyPart.HAIR:
			player_composite_sprite.change_to_previous_hair()
		PlayerCompositeSprite.BodyPart.FACE:
			player_composite_sprite.change_to_previous_face()
		PlayerCompositeSprite.BodyPart.SHIRT:
			player_composite_sprite.change_to_previous_shirt()
		PlayerCompositeSprite.BodyPart.PANTS:
			player_composite_sprite.change_to_previous_pants()
		PlayerCompositeSprite.BodyPart.FACE:
			player_composite_sprite.change_to_previous_shoes()

func _on_change_next_button_pressed() -> void:
	match body_part:
		PlayerCompositeSprite.BodyPart.BODY:
			player_composite_sprite.change_to_next_body()
		PlayerCompositeSprite.BodyPart.HAIR:
			player_composite_sprite.change_to_next_hair()
		PlayerCompositeSprite.BodyPart.FACE:
			player_composite_sprite.change_to_next_face()
		PlayerCompositeSprite.BodyPart.SHIRT:
			player_composite_sprite.change_to_next_shirt()
		PlayerCompositeSprite.BodyPart.PANTS:
			player_composite_sprite.change_to_next_pants()
		PlayerCompositeSprite.BodyPart.FACE:
			player_composite_sprite.change_to_next_shoes()
