class_name MouseDistanceTracker
extends Node

var is_tracking: bool = false
var total_distance_cm: float = 0.0

# Cache the DPI so we don't ask the Operating System for it every single frame
var _screen_dpi: float = 96.0 

func _ready() -> void:
	# Get the monitor's actual DPI from the OS (Godot 4 syntax)
	_screen_dpi = DisplayServer.screen_get_dpi()
	
	# Fallback just in case the OS fails to report a valid DPI
	if _screen_dpi <= 0:
		_screen_dpi = 96.0 

func _input(event: InputEvent) -> void:
	if not is_tracking:
		return
		
	if event is InputEventMouseMotion:
		# Get the raw distance moved in pixels during this tiny movement
		# event.relative is a Vector2 of how far the mouse moved on X and Y
		var pixels_moved: float = event.relative.length()
		
		# Convert pixels to inches (Pixels divided by Pixels-Per-Inch)
		var inches_moved: float = pixels_moved / _screen_dpi
		
		# Convert inches to centimeters (1 inch = 2.54 cm)
		var cm_moved: float = inches_moved * 2.54
		
		# Add it to our total
		total_distance_cm += cm_moved

func start_tracking() -> void:
	is_tracking = true

func stop_tracking() -> void:
	is_tracking = false

func reset_tracking() -> void:
	total_distance_cm = 0.0

func stop_and_reset() -> void:
	stop_tracking()
	reset_tracking()
