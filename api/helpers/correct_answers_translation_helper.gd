class_name CorrectAnswersTranslationHelper
extends RefCounted

static func translate(answers: Array) -> Array:
	return answers.map(func(answer): return str(answer))
