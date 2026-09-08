extends Node

@onready var ldk_scene_changer_tile_collision_shape_2d: CollisionShape2D = $LDKSceneChangerTile/Area2D/CollisionShape2D

func _ready() -> void:
	ldk_scene_changer_tile_collision_shape_2d.disabled = true

func _on_ui_flow_successfully_redeemed() -> void:
	ldk_scene_changer_tile_collision_shape_2d.disabled = false
