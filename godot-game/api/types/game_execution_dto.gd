class_name GameExecutionDTO
extends RefCounted

var run_name: String
var flow_code: String
var started_at: String
var finished_at: String
var nodes: Array[NodeRecord]

func _init(n_run_name: String, n_flow_code: String, n_started_at: String, n_finished_at: String, n_nodes: Array[NodeRecord] = []) -> void:
	self.run_name = n_run_name
	self.flow_code = n_flow_code
	self.nodes = n_nodes
	self.started_at = _format_iso_date(n_started_at)
	self.finished_at = _format_iso_date(n_finished_at)

func _format_iso_date(date_string: String) -> String:
	var iso_date = date_string.replace(" ", "T")
	if not iso_date.ends_with("Z"):
		iso_date += "Z"
	return iso_date

func _to_string() -> String:
	var nodes_array: Array = []
	for node: NodeRecord in self.nodes:
		nodes_array.append(node.to_dict())

	var dictionary: Dictionary = {
		"runName": self.run_name,
		"flowCode": self.flow_code,
		"startedAt": self.started_at,
		"finishedAt": self.finished_at,
		"nodes": nodes_array
	}
	
	return JSON.stringify(dictionary)
