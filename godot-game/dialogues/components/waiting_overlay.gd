class_name WaitingOverlay
extends CanvasLayer

@onready var loading_wrapper: VBoxContainer = $LoadingWrapper
@onready var loading_label: Label = $LoadingWrapper/LoadingLabel

var base_text: String = "Loading"
var dot_timer: float = 0.0
var dot_count: int = 0

func _ready() -> void:
	# Ensure it starts completely disabled and hidden when the game boots
	stop() 

func _process(delta: float) -> void:
	# No visibility check needed! set_process() handles if this runs or not.
	dot_timer += delta
	if dot_timer >= 0.5: # Update the text every 0.5 seconds
		dot_timer = 0.0
		dot_count = (dot_count + 1) % 4 # Loops between 0, 1, 2, and 3
		
		# .repeat() magically generates the dots for us!
		loading_label.text = base_text + ".".repeat(dot_count)

func _reset() -> void:
	dot_timer = 0.0
	dot_count = 0
	loading_label.text = base_text

func start(text_to_display: String = "Loading") -> void:
	base_text = text_to_display
	_reset()
	self.show()
	set_process(true)

func stop() -> void:
	self.hide()
	set_process(false)
