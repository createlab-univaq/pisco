extends Node

@onready var bedroom_scene_changer_tile_collision_shape_2d: CollisionShape2D = $BedroomSceneChangerTile/Area2D/CollisionShape2D

func _ready() -> void:
	bedroom_scene_changer_tile_collision_shape_2d.disabled = true

func _on_experiment_manager_experiment_completed() -> void:
	bedroom_scene_changer_tile_collision_shape_2d.disabled = false
