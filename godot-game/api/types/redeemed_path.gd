class_name RedeemedPath
extends RefCounted

var unique_code: String
var patient_path_id: String
var patient_id: String
var flow: Flow

func _init(n_unique_code: String, n_patient_path_id: String, n_patient_id: String, n_flow: Flow) -> void:
	self.unique_code = n_unique_code
	self.patient_path_id = n_patient_path_id
	self.patient_id = n_patient_id
	self.flow = n_flow
