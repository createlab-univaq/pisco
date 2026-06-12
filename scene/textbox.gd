extends CanvasLayer

const CHAR_READ_RATE = 0.05

@onready var textbox_container = $TextBoxContainer
@onready var start_symbol = $TextBoxContainer/MarginContainer/HBoxContainer/Start
@onready var end_symbol = $TextBoxContainer/MarginContainer/HBoxContainer/End
@onready var label = $TextBoxContainer/MarginContainer/HBoxContainer/Label2

var tween: Tween

enum State {
	READY,
	READING,
	FINISHED
}

var current_state = State.READY
var text_queue = []

func _ready():
	TranslationServer.set_locale("it") 
	print("Starting state: State.READY")
	hide_textbox()
	
	# Diciamo al codice di caricare il blocco "INTRO_VILLAGGIO" che ha 3 battute nel CSV
	carica_dialogo_da_file("res://dialogs/intro/dialoghi.csv")
	
func carica_dialogo_da_file(percorso_csv: String):
	text_queue.clear()
	TranslationServer.clear() 
	
	var lingua_corrente = TranslationServer.get_locale()
	var percorso_translation = percorso_csv.replace(".csv", "") + "." + lingua_corrente + ".translation"
	
	var traduzione_scena = load(percorso_translation)
	if traduzione_scena:
		TranslationServer.add_translation(traduzione_scena)
	else:
		print("ERRORE: Impossibile trovare il file di traduzione in: ", percorso_translation)
		return

	if FileAccess.file_exists(percorso_csv):
		var file = FileAccess.open(percorso_csv, FileAccess.READ)
		
		if not file.eof_reached():
			file.get_line() 
		
		var contatore_battute = 0
		while not file.eof_reached():
			var riga = file.get_line().strip_edges()
			if riga != "": 
				contatore_battute += 1
		
		file.close() # Chiudiamo il file

		for i in range(1, contatore_battute + 1):
			queue_text(str(i))
			
		print("Dialogo caricato con successo! Battute trovate nel CSV: ", contatore_battute)
	else:
		print("ERRORE: Il file CSV non esiste in: ", percorso_csv)


func _process(delta):
	match current_state:
		State.READY:
			if !text_queue.is_empty():
				display_text()
		State.READING:
			if Input.is_action_just_pressed("ui_accept"):
				label.visible_ratio = 1.0
				if tween != null and tween.is_valid():
					tween.kill()
				end_symbol.text = "v"
				change_state(State.FINISHED)
		State.FINISHED:
			if Input.is_action_just_pressed("ui_accept"):
				change_state(State.READY)
				hide_textbox()

func queue_text(next_text):
	text_queue.push_back(next_text)

func hide_textbox():
	start_symbol.text = ""
	end_symbol.text = ""
	label.text = ""
	textbox_container.hide()

func show_textbox():
	start_symbol.text = "*"
	textbox_container.show()

func display_text():
	var chiave_dialogo = text_queue.pop_front()
	var testo_tradotto = tr(chiave_dialogo)
	print("Chiave generata dal codice: ", chiave_dialogo)
	print("Testo che Godot riesce a trovare: ", testo_tradotto)
	label.text = testo_tradotto
	label.visible_ratio = 0.0
	change_state(State.READING)
	show_textbox()
	
	tween = create_tween()
	tween.tween_property(label, "visible_ratio", 1.0, len(testo_tradotto) * CHAR_READ_RATE).set_trans(Tween.TRANS_LINEAR).set_ease(Tween.EASE_IN_OUT)
	tween.tween_callback(on_tween_completed)

func on_tween_completed():
	end_symbol.text = "v"
	change_state(State.FINISHED)

func change_state(next_state):
	current_state = next_state
