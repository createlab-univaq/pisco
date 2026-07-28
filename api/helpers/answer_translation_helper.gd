extends RefCounted
class_name AnswerTranslationHelper


static func translate(answers: Array) -> Array:
	var translated_answers: Array = []

	for answer in answers:
		translated_answers.append(
			_translate_answer(answer)
		)

	return translated_answers


static func _translate_answer(answer: Variant) -> Dictionary:
	if answer is Dictionary:
		var translated_answer: Dictionary = {
			"text": answer.get("text", "")
		}

		if answer.has("score"):
			translated_answer["score"] = int(answer.get("score", 0))

		return translated_answer

	return {
		"text": str(answer)
	}
