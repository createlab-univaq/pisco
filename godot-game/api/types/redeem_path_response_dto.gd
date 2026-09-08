class_name RedeemPathResponseDTO
extends RefCounted

var unique_code: String
var patient_path_id: String
var patient_id: String
var flow: FlowDTO

func _init(server_redeem_path_response: Dictionary) -> void:
	self.unique_code = server_redeem_path_response.get("uniqueCode", "")
	self.patient_path_id = server_redeem_path_response.get("patientPathId", "")
	self.patient_id = server_redeem_path_response.get("patientId", "")
	
	# Instantiate the nested FlowDTO if it exists
	if server_redeem_path_response.has("flow") and server_redeem_path_response["flow"] != null:
		self.flow = FlowDTO.new(server_redeem_path_response["flow"])

func _to_string() -> String:
	var dictionary: Dictionary = {
		"uniqueCode": self.unique_code,
		"patientPathId": self.patient_path_id,
		"patientId": self.patient_id
	}
	
	if self.flow != null:
		dictionary["flow"] = JSON.parse_string(self.flow._to_string())
		
	return JSON.stringify(dictionary)
