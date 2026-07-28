extends RefCounted
class_name ConditionalEdgeTranslator


static func translate(
	edge: Dictionary,
	node_indexes: Dictionary
) -> Dictionary:
	var target_id: String = str(edge.get("target", ""))

	if not node_indexes.has(target_id):
		push_warning(
			"Target dell'edge non trovato: %s" % target_id
		)
		return {}

	return {
		"node": int(node_indexes[target_id]),
		"operator": _translate_operator(
			str(edge.get("operator", ""))
		),
		"threshold": int(edge.get("threshold", 0))
	}


static func _translate_operator(operator: String) -> String:
	var operators: Dictionary = {
		">": "gt",
		">=": "ge",
		"<": "lt",
		"<=": "le",
		"==": "eq",
		"!=": "ne"
	}

	return str(operators.get(operator, operator))
