extends Node


static var spritesheets = {
	"male": {
		"body": {
			0: preload("res://Player/CompositeSpritesheets/male/body/body2.png"),
		},
		"face": {
			0: preload("res://Player/CompositeSpritesheets/male/face/Neutral_male.png"),
			1: preload("res://Player/CompositeSpritesheets/male/face/Angry_male.png"),
			2: preload("res://Player/CompositeSpritesheets/male/face/happy_male.png"),
			3: preload("res://Player/CompositeSpritesheets/male/face/sad_male.png"),
		},
		"hair": {
			0: preload("res://Player/CompositeSpritesheets/male/hair/spiked_blonde.png"),
			1: preload("res://Player/CompositeSpritesheets/male/hair/short_brown.png"),
			2: preload("res://Player/CompositeSpritesheets/male/hair/afro_black.png"),
			3: preload("res://Player/CompositeSpritesheets/male/hair/afro_blonde.png"),
		},
		"pants": {
			0: preload("res://Player/CompositeSpritesheets/male/pants/pantaloons_brown.png"),
			1: preload("res://Player/CompositeSpritesheets/male/pants/pantaloons_teal.png"),
			2: preload("res://Player/CompositeSpritesheets/male/pants/shorts_brown.png"),
			3: preload("res://Player/CompositeSpritesheets/male/pants/shorts_red.png"),
		},
		"shirt": {
			0: preload("res://Player/CompositeSpritesheets/male/shirt/longsleeve_red.png"),
			1: preload("res://Player/CompositeSpritesheets/male/shirt/longsleeve_teal.png"),
			2: preload("res://Player/CompositeSpritesheets/male/shirt/sleeveless_balck.png"),
			3: preload("res://Player/CompositeSpritesheets/male/shirt/sleeveless_white.png"),
		},
		"shoes" :{
			0: preload("res://Player/CompositeSpritesheets/male/shoes/shoes1.png"),
			1: preload("res://Player/CompositeSpritesheets/male/shoes/shoes2.png"),
			2: preload("res://Player/CompositeSpritesheets/male/shoes/shoes3.png"),
		}
	},
	"female": {
		"body" :{
			0: preload("res://Player/CompositeSpritesheets/famale/body/body1.png")
		},
		"face" : {
			0: preload("res://Player/CompositeSpritesheets/famale/face/neutral_famale.png"),
			1: preload("res://Player/CompositeSpritesheets/famale/face/angry_famale.png"),
			2: preload("res://Player/CompositeSpritesheets/famale/face/happy_famale.png"),
			3: preload("res://Player/CompositeSpritesheets/famale/face/sad_famale.png"),
		},
		"hair" :{
			0: preload("res://Player/CompositeSpritesheets/famale/hair/curly_long_ash.png"),
			1: preload("res://Player/CompositeSpritesheets/famale/hair/curly_long_brown.png"),
			2: preload("res://Player/CompositeSpritesheets/famale/hair/curly_short_blond.png"),
			3: preload("res://Player/CompositeSpritesheets/famale/hair/curly_short_brown.png"),
		},
		"pants" :{
			0: preload("res://Player/CompositeSpritesheets/famale/pants/leggings_pink.png"),
			1: preload("res://Player/CompositeSpritesheets/famale/pants/leggings_white.png"),
			2: preload("res://Player/CompositeSpritesheets/famale/pants/skirt_brown.png"),
			3: preload("res://Player/CompositeSpritesheets/famale/pants/skirt_sky.png"),
		},
		"shirt" :{
			0: preload("res://Player/CompositeSpritesheets/famale/shirt/blouse_black.png"),
			1: preload("res://Player/CompositeSpritesheets/famale/shirt/blouse_lavander.png"),
			2: preload("res://Player/CompositeSpritesheets/famale/shirt/sleeveless_navy.png"),
			3: preload("res://Player/CompositeSpritesheets/famale/shirt/sleeveless_white.png"),
		},
		"shoes" :{
			0: preload("res://Player/CompositeSpritesheets/famale/shoes/shoes_brown.png"),
			1: preload("res://Player/CompositeSpritesheets/famale/shoes/reverside_blue.png"),
			2: preload("res://Player/CompositeSpritesheets/famale/shoes/ghillies_black.png"),
		}
	}
}
