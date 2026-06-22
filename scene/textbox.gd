extends CanvasLayer

const CHAR_READ_RATE = 0.05

@onready var textbox_container = $VBoxContainer/TextBoxContainer
@onready var start_symbol = $VBoxContainer/TextBoxContainer/MarginContainer/HBoxContainer/Start
@onready var end_symbol = $VBoxContainer/TextBoxContainer/MarginContainer/HBoxContainer/End
@onready var label = $VBoxContainer/TextBoxContainer/MarginContainer/HBoxContainer/Label2

@onready var choices_dialog = $VBoxContainer/ChoicesDialog
@onready var choices_list = $VBoxContainer/ChoicesDialog/ChoicesList
@onready var base_button = $VBoxContainer/ChoicesDialog/ChoicesList/Button

var tween: Tween
var percorso_file_attuale: String = ""

enum State {
	READY,
	READING,
	FINISHED,
	WAITING_CHOICE
}

var current_state = State.READY
var text_queue = []
# Questo dizionario tiene traccia di quale blocco caricare per ogni pulsante premuto
var blocchi_scelte_correnti = {} 

func _ready():
	TranslationServer.set_locale("it") 
	hide_textbox()
	if choices_dialog:
		choices_dialog.hide()
	
	# collega il segnale del primo pulsante base
	if base_button:
		base_button.pressed.connect(_on_choice_pressed.bind(0))
	
	carica_blocco_da_file("res://dialogs/intro/dialoghi.csv", "INTRO")


func carica_blocco_da_file(percorso_csv: String, nome_blocco: String):
	text_queue.clear()
	percorso_file_attuale = percorso_csv
	
	var lingua_corrente = TranslationServer.get_locale()
	var percorso_translation = percorso_csv.replace(".csv", "") + "." + lingua_corrente + ".translation"
	
	var traduzione_scena = load(percorso_translation)
	if traduzione_scena:
		TranslationServer.clear() 
		TranslationServer.add_translation(traduzione_scena)
	else:
		print("ERRORE: Impossibile trovare il file di traduzione in: ", percorso_translation)
		return

	if FileAccess.file_exists(percorso_csv):
		var file = FileAccess.open(percorso_csv, FileAccess.READ)
		
		if not file.eof_reached():
			file.get_line() # salta intestazione
		
		while not file.eof_reached():
			var riga = file.get_line().strip_edges()
			if riga != "":
				var id_riga = riga.split(",")[0].replace('"', '')
				
				if id_riga.begins_with(nome_blocco + "_"):
					queue_text(id_riga)
		
		file.close()
		print("Caricato blocco: ", nome_blocco, " con ", text_queue.size(), " battute.")
		change_state(State.READY)
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
				# se la prossima riga è una scelta non nascondere il riquadro
				if !text_queue.is_empty() and tr(text_queue[0]).begins_with("SCELTA:"):
					change_state(State.READY)
				else:
					change_state(State.READY)
					hide_textbox()
		State.WAITING_CHOICE:
			pass


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
	
	if testo_tradotto.begins_with("SCELTA:"):
		
		blocchi_scelte_correnti.clear()
		var stringa_pulita = testo_tradotto.replace("SCELTA:", "")
		var opzioni = stringa_pulita.split("|")
		var testi_pulsanti = []
		
		for i in range(opzioni.size()):
			var dati_scelta = opzioni[i].split("->")
			var testo_pulsante = dati_scelta[0].strip_edges()
			var blocco_destinazione = dati_scelta[1].strip_edges()
			
			testi_pulsanti.append(testo_pulsante)
			blocchi_scelte_correnti[i] = blocco_destinazione
		
		genera_pulsanti_scelta(testi_pulsanti)
		change_state(State.WAITING_CHOICE)
		return
		
	# in caso di dialogo normale
	label.text = testo_tradotto
	
	var linee_totali = label.get_line_count()
	assert(linee_totali <= 2, "ERRORE CRITICO: Il dialogo '" + chiave_dialogo + "' supera le 2 righe consentite! Riduci il testo nel CSV.")
	
	label.visible_ratio = 0.0
	change_state(State.READING)
	show_textbox()
	
	tween = create_tween()
	tween.tween_property(label, "visible_ratio", 1.0, len(testo_tradotto) * CHAR_READ_RATE).set_trans(Tween.TRANS_LINEAR).set_ease(Tween.EASE_IN_OUT)
	tween.tween_callback(on_tween_completed)


func genera_pulsanti_scelta(opzioni: Array):
	if choices_dialog == null or choices_list == null or base_button == null:
		print("ERRORE CRITICO: Uno dei nodi dell'interfaccia delle scelte è NULL!")
		print("choices_dialog: ", choices_dialog)
		print("choices_list: ", choices_list)
		print("base_button: ", base_button)
		return

	choices_dialog.show()
	
	for i in range(1, choices_list.get_child_count()):
		choices_list.get_child(i).queue_free()
		
	for i in range(opzioni.size()):
		if i == 0:
			base_button.text = opzioni[i]
		else:
			var new_btn = base_button.duplicate()
			choices_list.add_child(new_btn)
			new_btn.text = opzioni[i]
			new_btn.pressed.connect(_on_choice_pressed.bind(i))

func _on_choice_pressed(index: int):
	choices_dialog.hide()
	hide_textbox()
	
	var prossimo_blocco = blocchi_scelte_correnti[index]
	carica_blocco_da_file(percorso_file_attuale, prossimo_blocco)

func on_tween_completed():
	end_symbol.text = "v"
	change_state(State.FINISHED)

func change_state(next_state):
	current_state = next_state
