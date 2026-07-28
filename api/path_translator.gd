extends RefCounted
class_name PathTranslator


const EXAMPLE_JSON_PATH := "res://api/tests/API-percorso2.json"


func print_translated_path() -> void:
	var api_json := _load_example_json()

	if api_json.is_empty():
		push_error("Il JSON non è stato caricato.")
		return

	var translated_path := translate_path(api_json)

	print("=== JSON TRADOTTO ===")
	print(JSON.stringify(translated_path, "\t"))


func _load_example_json() -> Dictionary:
	if not FileAccess.file_exists(EXAMPLE_JSON_PATH):
		push_error("File non trovato: " + EXAMPLE_JSON_PATH)
		return {}

	var file := FileAccess.open(
		EXAMPLE_JSON_PATH,
		FileAccess.READ
	)

	if file == null:
		push_error("Impossibile aprire il file JSON.")
		return {}

	var json_text := file.get_as_text()
	file.close()

	var json := JSON.new()
	var error := json.parse(json_text)

	if error != OK:
		push_error(
			"Errore JSON alla riga %d: %s"
			% [
				json.get_error_line(),
				json.get_error_message()
			]
		)
		return {}

	if not json.data is Dictionary:
		push_error(
			"Il contenuto principale del JSON non è un oggetto."
		)
		return {}

	return json.data


func translate_path(api_path: Dictionary) -> Dictionary:
	var source_nodes: Array = api_path.get("nodes", [])
	var node_indexes: Dictionary = _build_node_indexes(source_nodes)
	var translated_path: Dictionary = {}

	for index in range(source_nodes.size()):
		var source_node: Variant = source_nodes[index]

		if not source_node is Dictionary:
			push_warning(
				"Elemento non valido all'indice %d dell'array nodes."
				% index
			)
			continue

		var translated_node: Dictionary = _translate_node(source_node)

		if translated_node.is_empty():
			continue

		translated_node["next"] = EdgeTranslator.translate_all(
			source_node.get("next", []),
			node_indexes
		)

		translated_path[index] = translated_node

	return translated_path

func _build_node_indexes(nodes: Array) -> Dictionary:
	var node_indexes: Dictionary = {}

	for index in range(nodes.size()):
		var node: Variant = nodes[index]

		if not node is Dictionary:
			push_warning(
				"Elemento non valido all'indice %d dell'array nodes."
				% index
			)
			continue

		var node_id: String = str(
			node.get("id", "")
		)

		if node_id.is_empty():
			push_warning(
				"Nodo senza id all'indice %d."
				% index
			)
			continue

		if node_indexes.has(node_id):
			push_warning(
				"Id nodo duplicato: %s"
				% node_id
			)
			continue

		node_indexes[node_id] = index

	return node_indexes


func _translate_node(node: Dictionary) -> Dictionary:
	var node_type: String = str(
		node.get("type", "")
	)

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
			push_warning(
				"Tipo di nodo non supportato: %s"
				% node_type
			)
			return {}
