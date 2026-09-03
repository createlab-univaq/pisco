class_name LoginResponse
extends RefCounted

var success: bool = false:
	get:
		return success
	set(value):
		success = value

var error: String = "":
	get:
		return error
	set(value):
		error = value
