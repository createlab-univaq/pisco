class_name LoginResponseDTO
extends RefCounted

var token: String
var expires_at: String
var analyst: AnalystDTO

func _init(server_login_response: Dictionary) -> void:
	self.token = server_login_response["token"]
	self.expires_at = server_login_response["expiresAt"]
	self.analyst = AnalystDTO.new(server_login_response["analyst"])

func _to_string() -> String:
	var dictionary: Dictionary = {
	  "token": self.token,
	  "expiresAt": self.expires_at,
	  "analyst": self.analyst.to_string()
	}
	return JSON.stringify(dictionary)
