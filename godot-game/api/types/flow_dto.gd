class_name FlowDTO
extends RefCounted

var id: String
var name: String
var description: String
var published: bool
var flow_json: Dictionary
var analyst: AnalystDTO
var created_at: String
var updated_at: String

func _init(server_response: Dictionary) -> void:
	self.id = server_response.get("id", "")
	self.name = server_response.get("name", "")
	self.description = server_response.get("description", "")
	self.published = server_response.get("published", false)
	self.flow_json = server_response.get("flowJson", {})
	
	# Instantiate the nested AnalystDTO if it exists
	if server_response.has("analyst") and server_response["analyst"] != null:
		self.analyst = AnalystDTO.new(server_response["analyst"])
		
	self.created_at = server_response.get("createdAt", "")
	self.updated_at = server_response.get("updatedAt", "")

func _to_string() -> String:
	var dictionary: Dictionary = {
		"id": self.id,
		"name": self.name,
		"description": self.description,
		"published": self.published,
		"flowJson": self.flow_json,
		"createdAt": self.created_at,
		"updatedAt": self.updated_at
	}
	
	# Since AnalystDTO._to_string() returns a stringified JSON, 
	# we parse it back to a dictionary here so the final JSON remains properly nested
	if self.analyst != null:
		dictionary["analyst"] = JSON.parse_string(self.analyst._to_string())
		
	return JSON.stringify(dictionary)
