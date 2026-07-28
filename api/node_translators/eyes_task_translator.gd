extends RefCounted
class_name EyesTaskTranslator


static func translate(node: Dictionary) -> Dictionary:
	var data: Dictionary = node.get("data", {})
	var source_questions: Array = data.get("questions", [])

	return {
		"type": "choice",
		"questions": _translate_questions(source_questions),
		"next": []
	}


static func _translate_questions(questions: Array) -> Array:
	var translated_questions: Array = []

	for question in questions:
		if not question is Dictionary:
			continue

		translated_questions.append(
			_translate_question(question)
		)

	return translated_questions


static func _translate_question(question: Dictionary) -> Dictionary:
	return {
		"image": str(question.get("imageId", "")),
		"answers": AnswerTranslationHelper.translate(
			question.get("answers", [])
		),
		"correctAnswers": [
			int(question.get("correctIndex", 0))
		]
	}
