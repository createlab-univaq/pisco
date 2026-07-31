class_name ActionableDetector
extends Marker2D

signal actionable_detected
signal actionable_lost

@onready var actionable_finder_area_2d: Area2D = $ActionableFinderArea2D

var nearest_actionable: Actionable = null

func check_nearest_actionable(facing_direction: Vector2) -> void:
	var areas: Array[Area2D] = actionable_finder_area_2d.get_overlapping_areas()
	if nearest_actionable != null:
			nearest_actionable.is_area_active = false
	if areas.size() != 0:
		var shortest_distance: float = INF
		var next_nearest_actionable_area: Area2D = null
		for area in areas:
			var distance: float = area.global_position.distance_to(self.global_position)
			if distance < shortest_distance:
				shortest_distance = distance
				next_nearest_actionable_area = area
		
		var new_nearest_actionable = next_nearest_actionable_area.get_parent()
		if nearest_actionable != new_nearest_actionable:
			actionable_lost.emit()
		nearest_actionable = new_nearest_actionable
		nearest_actionable.is_area_active = true
		if Vector2.INF == nearest_actionable.directions_array[nearest_actionable.exclamation_mark_facing_direction] or facing_direction == nearest_actionable.directions_array[nearest_actionable.exclamation_mark_facing_direction]:
			actionable_detected.emit()
	else:
		actionable_lost.emit()
		nearest_actionable = null
