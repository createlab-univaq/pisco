class_name AnswerTranslationHelper
extends RefCounted

static func translate(answers: Array) -> Array:
	return answers.map(_translate_answer)

static func _translate_answer(answer: Variant) -> Dictionary:
	if answer is Dictionary:
		var translated_answer: Dictionary = {
			"text": str(answer.get("text", ""))
		}

		if answer.has("score"):
			translated_answer["score"] = int(answer.get("score", 0))

		return translated_answer

	return {
		"text": str(answer)
	}
