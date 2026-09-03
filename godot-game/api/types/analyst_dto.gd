class_name AnalystDTO
extends RefCounted

var id: String
var first_name: String
var last_name: String
var email: String
var role: String
var created_at: String

func _init(server_analyst_response: Dictionary) -> void:
	self.id = server_analyst_response["id"]
	self.first_name = server_analyst_response["firstName"]
	self.last_name = server_analyst_response["lastName"]
	self.email = server_analyst_response["email"]
	self.role = server_analyst_response["role"]
	self.created_at = server_analyst_response["createdAt"]

func _to_string() -> String:
	var dictionary: Dictionary = {
		"id": self.id,
		"firstName": self.first_name,
		"lastName": self.last_name,
		"email": self.email,
		"role": self.role,
		"createdAt": self.created_at
	}
	return JSON.stringify(dictionary)
