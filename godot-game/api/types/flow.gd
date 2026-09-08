class_name Flow
extends RefCounted

var id: String
var name: String
var description: String
var published: bool
var flow_json: Dictionary
var analyst: Analyst
var created_at: String
var updated_at: String

func _init(n_id: String, n_name: String, n_description: String, n_published: bool, n_flow_json: Dictionary, n_analyst: Analyst, n_created_at: String, n_updated_at: String) -> void:
	self.id = n_id
	self.name = n_name
	self.description = n_description
	self.published = n_published
	self.flow_json = n_flow_json
	self.analyst = n_analyst
	self.created_at = n_created_at
	self.updated_at = n_updated_at
