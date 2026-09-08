extends Node

const API_URL: String = "https://pisco-analyst-api.createlab-univaq.it/api"
const LOGIN_PATH: String = "/auth/login"
const REDEEM_FLOW: String = "/paths/resolve"
const IMAGES_PATH: String = "/images"

const JSON_APPLICATION_HEADER = "Content-Type: application/json"
var BEARER_AUTHORIZATION_HEADER = "Authorization: Bearer "

@onready var http_request: HTTPRequest = $HTTPRequest

var logged_analyst: Analyst = null
var session_token: String = ""
var session_token_expiration_time: String = ""
var redeemed_flow: RedeemedPath = null

func login(email: String, password: String, on_login: Callable) -> void:
	var login_dto: LoginDTO = LoginDTO.new(email, password)
	
	var url: String = API_URL + LOGIN_PATH
	var headers: Array[String] = [JSON_APPLICATION_HEADER]
	var json: String = login_dto.to_string()
	
	http_request.request_completed.connect(_on_login_request_completed.bind(on_login))
	http_request.request(url, headers, HTTPClient.METHOD_POST, json)

func _on_login_request_completed(_result: int, response_code: int, _headers: PackedStringArray, body: PackedByteArray, on_login: Callable) -> void:
	http_request.request_completed.disconnect(_on_login_request_completed.bind(on_login))
	
	var json: Dictionary = JSON.parse_string(body.get_string_from_utf8())
	var server_response: ServerResponse = ServerResponse.new()
	server_response.success = response_code == 200
	if server_response.success:
		var login_response_dto: LoginResponseDTO = LoginResponseDTO.new(json)
		session_token = login_response_dto.token
		session_token_expiration_time = login_response_dto.expires_at
		var analyst = login_response_dto.analyst
		logged_analyst = Analyst.new(analyst.id, analyst.first_name, analyst.last_name, analyst.email, analyst.role, analyst.created_at)
	else:
		var server_error_dto: ServerErrorDTO = ServerErrorDTO.new(json)
		server_response.error = server_error_dto.detail
	
	on_login.call(server_response)

func _get_auth_headers() -> String:
	return BEARER_AUTHORIZATION_HEADER + session_token

func redeem_path(code: String, on_redeem_path: Callable) -> void:
	var url: String = API_URL + REDEEM_FLOW + "/" + code
	var headers: Array[String] = [_get_auth_headers()]
	http_request.request_completed.connect(_on_redeem_path_request_completed.bind(on_redeem_path))
	http_request.request(url, headers, HTTPClient.METHOD_GET)

func _on_redeem_path_request_completed(_result: int, response_code: int, _headers: PackedStringArray, body: PackedByteArray, on_redeem_path: Callable) -> void:
	http_request.request_completed.disconnect(_on_redeem_path_request_completed.bind(on_redeem_path))
	
	var json: Dictionary = JSON.parse_string(body.get_string_from_utf8())
	var server_response: ServerResponse = ServerResponse.new()
	server_response.success = response_code == 200
	if server_response.success:
		var redeem_path_response_dto: RedeemPathResponseDTO = RedeemPathResponseDTO.new(json)
		
		var domain_analyst: Analyst = null
		if redeem_path_response_dto.flow != null and redeem_path_response_dto.flow.analyst != null:
			var a_dto: AnalystDTO = redeem_path_response_dto.flow.analyst
			domain_analyst = Analyst.new(
				a_dto.id, 
				a_dto.first_name, 
				a_dto.last_name, 
				a_dto.email, 
				a_dto.role, 
				a_dto.created_at
			)
		
		var domain_flow: Flow = null
		if redeem_path_response_dto.flow != null:
			var f_dto: FlowDTO = redeem_path_response_dto.flow
			domain_flow = Flow.new(
				f_dto.id, 
				f_dto.name, 
				f_dto.description, 
				f_dto.published, 
				f_dto.flow_json, 
				domain_analyst, 
				f_dto.created_at, 
				f_dto.updated_at
			)
		
		redeemed_flow = RedeemedPath.new(
			redeem_path_response_dto.unique_code,
			redeem_path_response_dto.patient_path_id,
			redeem_path_response_dto.patient_id,
			domain_flow
		)
	else:
		var server_error_dto: ServerErrorDTO = ServerErrorDTO.new(json)
		server_response.error = server_error_dto.detail
	
	on_redeem_path.call(server_response)
