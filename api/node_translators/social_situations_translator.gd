class_name SocialSituationsTranslator
extends RefCounted

static func translate(node: Dictionary) -> Dictionary:
	var translated_sections := []
	var data := node.get("data", {}) as Dictionary
	var items := data.get("items", []) as Array

	for item in items:
		var item_dict := item as Dictionary
		if item_dict == null:
			continue

		var sections := item_dict.get("sections", []) as Array
		for section in sections:
			var section_dict := section as Dictionary
			if section_dict == null:
				continue

			translated_sections.append({
				"narration": _translate_narration(section_dict),
				"questions": [{
					"answers": AnswerTranslationHelper.translate(section_dict.get("answers", []) as Array),
					"correctAnswers": (section_dict.get("correctIndexes", []) as Array).map(func(idx): return int(idx))
				}]
			})

	return {
		"type": "choice",
		"questions": translated_sections,
		"next": []
	}

static func _translate_narration(section: Dictionary) -> String:
	return "%s[b]%s[/b]%s" % [
		section.get("before", ""),
		section.get("bold", ""),
		section.get("after", "")
	]
