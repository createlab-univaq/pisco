extends RefCounted
class_name FauxPasTranslator


static func translate(node: Dictionary) -> Dictionary:
	var data: Dictionary = node.get("data", {})
	var translated_quiz: Array = []

	for quiz_item in data.get("quiz", []):
		translated_quiz.append(
			_translate_quiz_item(quiz_item)
		)

	return {
		"type": "choice",
		"questions": translated_quiz,
		"next": node.get("next", [])
	}


static func _translate_quiz_item(quiz_item: Dictionary) -> Dictionary:
	var translated_questions: Array = []

	for question in quiz_item.get("questions", []):
		translated_questions.append(
			_translate_question(question)
		)

	return {
		"narration": quiz_item.get("narration", ""),
		"questions": translated_questions
	}


static func _translate_question(question: Dictionary) -> Dictionary:
	var translated_question: Dictionary = (
		QuestionTranslationHelper.translate(question)
	)

	var skip_if: Dictionary = question.get("skipIf", {})

	if skip_if.get("enabled", false):
		translated_question["skip"] = [
			{
				"question": int(
					skip_if.get("questionIndex", 0)
				),
				"answer": int(
					skip_if.get("answerIndex", 0)
				)
			}
		]

	return translated_question
