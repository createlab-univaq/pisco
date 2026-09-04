extends Node

const API_URL: String = "https://pisco-analyst-api.createlab-univaq.it/api"
const LOGIN_PATH: String = "/auth/login"
const REDEEM_FLOW: String = "/paths/resolve"

const JSON_APPLICATION_HEADER = "Content-Type: application/json"
var BEARER_AUTHORIZATION_HEADER = "Authorization: Bearer "

@onready var http_request: HTTPRequest = $HTTPRequest

var logged_analyst: Analyst = null
var session_token: String = ""
var session_token_expiration_time: String = ""
var redeemed_flow: Dictionary = {}

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
		# TODO
		pass
	else:
		var server_error_dto: ServerErrorDTO = ServerErrorDTO.new(json)
		server_response.error = server_error_dto.detail
	
	on_redeem_path.call(server_response)
