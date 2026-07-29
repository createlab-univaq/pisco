class_name PathTranslator
extends RefCounted

const EXAMPLE_JSON_PATH := "res://api/tests/API-percorso2.json"

static func print_translated_path(path: String = EXAMPLE_JSON_PATH) -> void:
	var api_json := _load_json(path)

	if api_json.is_empty():
		push_error("The JSON was not loaded.")
		return

	var translated_path := translate_path(api_json)

	print("=== TRANSLATED JSON ===")
	print(JSON.stringify(translated_path, "\t"))

static func _load_json(path: String) -> Dictionary:
	if not FileAccess.file_exists(path):
		push_error("File not found: " + path)
		return {}

	var json_text := FileAccess.get_file_as_string(path)

	var json := JSON.new()
	var error := json.parse(json_text)

	if error != OK:
		push_error(
			"JSON error at line %d: %s"
			% [json.get_error_line(), json.get_error_message()]
		)
		return {}

	var data := json.data as Dictionary
	if data == null:
		push_error("The main JSON content is not an object.")
		return {}

	return data

static func translate_path(api_path: Dictionary) -> Dictionary:
	var source_nodes := api_path.get("nodes", []) as Array
	if source_nodes == null:
		return {}
		
	var node_indexes: Dictionary = _build_node_indexes(source_nodes)
	var translated_path: Dictionary = {}

	for index in source_nodes.size():
		var source_node := source_nodes[index] as Dictionary

		if source_node == null:
			push_warning("Invalid element at index %d of the nodes array." % index)
			continue

		var translated_node: Dictionary = _translate_node(source_node)

		if translated_node.is_empty():
			continue

		translated_node["next"] = EdgeTranslator.translate_all(
			source_node.get("next", []) as Array,
			node_indexes
		)

		translated_path[index] = translated_node

	return translated_path

static func _build_node_indexes(nodes: Array) -> Dictionary:
	var node_indexes: Dictionary = {}

	for index in nodes.size():
		var node := nodes[index] as Dictionary

		if node == null:
			push_warning("Invalid element at index %d of the nodes array." % index)
			continue

		var node_id: String = str(node.get("id", ""))

		if node_id.is_empty():
			push_warning("Node without an id at index %d." % index)
			continue

		if node_indexes.has(node_id):
			push_warning("Duplicate node id: %s" % node_id)
			continue

		node_indexes[node_id] = index

	return node_indexes

static func _translate_node(node: Dictionary) -> Dictionary:
	var node_type: String = str(node.get("type", ""))

	match node_type:
		"FauxPasNode":
			return FauxPasTranslator.translate(node)
		"TeoriaDellaMenteNode":
			return TheoryOfMindTranslator.translate(node)
		"EyesTaskTestNode":
			return EyesTaskTranslator.translate(node)
		"socialSituationsNode":
			return SocialSituationsTranslator.translate(node)
		"EmotionAttributionTestNode":
			return EmotionAttributionTranslator.translate(node)
		_:
			push_warning("Unsupported node type: %s" % node_type)
			return {}
