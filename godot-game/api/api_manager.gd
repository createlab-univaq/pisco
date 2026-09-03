extends Node

const API_URL: String = "https://pisco-analyst-api.createlab-univaq.it/api"
const LOGIN_PATH: String = "/auth/login"

const JSON_APPLICATION_HEADER = "Content-Type: application/json"

@onready var http_request: HTTPRequest = $HTTPRequest

var logged_analyst: Analyst = null
var session_token: String = ""
var session_token_expiration_time: String = ""

func login(email: String, password: String, on_login: Callable) -> void:
	var login_dto: LoginDTO = LoginDTO.new(email, password)
	
	var url: String = API_URL + LOGIN_PATH
	var headers: Array[String] = [JSON_APPLICATION_HEADER]
	var json: String = login_dto.to_string()
	
	http_request.request_completed.connect(_on_login_request_completed.bind(on_login))
	http_request.request(url, headers, HTTPClient.METHOD_POST, json)

func _on_login_request_completed(_result: int, response_code: int, _headers: PackedStringArray, body: PackedByteArray, on_login: Callable) -> void:
	http_request.request_completed.disconnect(_on_login_request_completed)
	
	var json: Dictionary = JSON.parse_string(body.get_string_from_utf8())
	var login_response: LoginResponse = LoginResponse.new()
	login_response.success = response_code == 200
	if login_response.success:
		var login_response_dto: LoginResponseDTO = LoginResponseDTO.new(json)
		session_token = login_response_dto.token
		session_token_expiration_time = login_response_dto.expires_at
		var analyst = login_response_dto.analyst
		logged_analyst = Analyst.new(analyst.id, analyst.first_name, analyst.last_name, analyst.email, analyst.role, analyst.created_at)
	else:
		var server_error_dto: ServerErrorDTO = ServerErrorDTO.new(json)
		login_response.error = server_error_dto.detail
	
	on_login.call(login_response)
