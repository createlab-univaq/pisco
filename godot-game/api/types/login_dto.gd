class_name LoginDTO
extends RefCounted

var email: String
var password: String

func _init(n_email: String, n_password: String) -> void:
	self.email = n_email
	self.password = n_password

func _to_string() -> String:
	var dictionary: Dictionary = {
		"email": self.email,
		"password": self.password
	}
	return JSON.stringify(dictionary)
