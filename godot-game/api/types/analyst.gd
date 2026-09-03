class_name Analyst
extends RefCounted

var id: String
var first_name: String
var last_name: String
var email: String
var role: String
var created_at: String

func _init(n_id: String, n_first_name: String, n_last_name: String, n_email: String, n_role: String, n_created_at: String) -> void:
	self.id = n_id
	self.first_name = n_first_name
	self.last_name = n_last_name
	self.email = n_email
	self.role = n_role
	self.created_at = n_created_at
