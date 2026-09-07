class_name TrueFalseNodeQuestion
extends ExperimentQuestion

var text: String
var is_true: bool

func _init(n_text: String, n_is_true: bool) -> void:
	self.text = n_text
	self.is_true = n_is_true
