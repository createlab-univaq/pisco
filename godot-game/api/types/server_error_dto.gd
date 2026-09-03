class_name ServerErrorDTO
extends RefCounted

var detail: String
var instance: String
var status: float
var title: String

func _init(server_error_response: Dictionary) -> void:
	self.detail = server_error_response["detail"]
	self.instance = server_error_response["instance"]
	self.status = server_error_response["status"]
	self.title = server_error_response["title"]
