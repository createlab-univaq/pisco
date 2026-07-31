class_name GameCamera
extends Camera2D

@onready var top_left: Marker2D = $Limits/TopLeft
@onready var bottom_right: Marker2D = $Limits/BottomRight

func _ready():
	set_process(true)
	
	limit_top = int(top_left.position.y)
	limit_left = int(top_left.position.x)
	limit_bottom = int(bottom_right.position.y)
	limit_right = int(bottom_right.position.x)
