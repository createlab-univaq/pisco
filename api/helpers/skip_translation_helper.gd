static func _translate_question(question: Dictionary) -> Dictionary:
	var translated_question := QuestionTranslationHelper.translate(question)
	var skip_if: Dictionary = question.get("skipIf", {})

	if skip_if.get("enabled", false):
		translated_question["skip"] = [
			{
				"question": int(skip_if.get("questionIndex", 0)),
				"answer": int(skip_if.get("answerIndex", 0))
			}
		]

	return translated_question
