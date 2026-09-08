@tool
class_name DialogueComponentBaseNode
extends Control

signal action_started
signal action_stopped
signal action_shown
signal action_performed(output: Variant)

const STATE_READY: StringName = &"READY"

var current_state: StringName = STATE_READY
var tween: Tween

func _ready() -> void:
	_reset()
	close()

func _reset():
	assert(false, "DialogueComponentBaseNode children must override _reset() function!")

func _change_state(next_state: StringName) -> void:
	current_state = next_state

func _kill_tween() -> void:
	if tween and tween.is_valid():
		tween.kill()
		tween = null

func open() -> void:
	print("open and unlock %s" % [self.name])
	_reset()
	self.show()
	set_process_unhandled_input.call_deferred(true)

func close() -> void:
	print("close and lock %s" % [self.name])
	self.hide()
	_reset()
	set_process_unhandled_input.call_deferred(false)

func lock_input() -> void:
	print("lock %s" % [self.name])
	set_process_unhandled_input.call_deferred(false)

func unlock_input() -> void:
	print("unlock %s" % [self.name])
	set_process_unhandled_input.call_deferred(true)

func perform_action() -> void:
	assert(false, "DialogueComponentBaseNode children must override _perform_action() function!")

func unlock_input_and_perform_action() -> void:
	unlock_input()
	perform_action()
