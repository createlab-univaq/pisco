extends RefCounted
class_name SocialSituationsTranslator


static func translate(node: Dictionary) -> Dictionary:
	var translated_sections := []
	var items: Array = node.get("data", {}).get("items", [])

	for item in items:
		if not item is Dictionary:
			continue

		var sections: Array = item.get("sections", [])

		for section in sections:
			if not section is Dictionary:
				continue

			translated_sections.append({
				"narration": _translate_narration(section),
				"questions": [
					{
						"answers": AnswerTranslationHelper.translate(
							section.get("answers", [])
						),
						"correctAnswers": _translate_correct_answers(
							section.get("correctIndexes", [])
						)
					}
				]
			})

	return {
		"type": "choice",
		"questions": translated_sections,
		"next": []
	}


static func _translate_narration(section: Dictionary) -> String:
	return (
		str(section.get("before", "")) +
		"[b]" +
		str(section.get("bold", "")) +
		"[/b]" +
		str(section.get("after", ""))
	)


static func _translate_correct_answers(indexes: Array) -> Array:
	var translated_indexes := []

	for index in indexes:
		translated_indexes.append(int(index))

	return translated_indexes
