extends Node


func _ready() -> void:
	var translator := PathTranslator.new()
	translator.print_translated_path()
