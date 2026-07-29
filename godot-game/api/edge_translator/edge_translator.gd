class_name EdgeTranslator
extends RefCounted

static func translate_all(edges: Array, node_indexes: Dictionary) -> Array:
	var translated_edges: Array = []

	for edge in edges:
		var edge_dict := edge as Dictionary
		if edge_dict == null:
			continue

		var translated_edge: Dictionary = translate(edge_dict, node_indexes)

		if not translated_edge.is_empty():
			translated_edges.append(translated_edge)

	return translated_edges

static func translate(edge: Dictionary, node_indexes: Dictionary) -> Dictionary:
	var edge_type: String = str(edge.get("type", ""))

	match edge_type:
		"conditionalEdge":
			return ConditionalEdgeTranslator.translate(edge, node_indexes)
		_:
			push_warning("Unsupported edge type: %s" % edge_type)
			return {}
