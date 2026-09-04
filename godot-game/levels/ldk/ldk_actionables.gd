extends Node

@onready var mom_actionable_collision_shape_2d: CollisionShape2D = $MomActionable/Area2D/CollisionShape2D

func _on_experiment_manager_experiment_completed() -> void:
	mom_actionable_collision_shape_2d.disabled = true
