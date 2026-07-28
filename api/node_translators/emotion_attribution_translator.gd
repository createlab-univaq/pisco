extends RefCounted
class_name EmotionAttributionTranslator


static func translate(node: Dictionary) -> Dictionary:
	var data: Dictionary = node.get("data", {})

	return {
		"type": "choice_input",
		"questions": _translate_questions(
			data.get("questions", [])
		),
		"next": []
	}


static func _translate_questions(questions: Array) -> Array:
	var translated_questions: Array = []

	for question in questions:
		translated_questions.append(
			_translate_question(question)
		)

	return translated_questions


static func _translate_question(question: Dictionary) -> Dictionary:
	return {
		"narration": question.get("narration", ""),
		"question": question.get("question", ""),
		"correctAnswers": CorrectAnswersTranslationHelper.translate(
			question.get("correctAnswers", [])
		)
	}
