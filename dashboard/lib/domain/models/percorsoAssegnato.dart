class PercorsoAssegnato {
  final String percorsoIdEsterno;
  final String nomePercorso;

  PercorsoAssegnato({
    required this.percorsoIdEsterno,
    required this.nomePercorso,
  });

  factory PercorsoAssegnato.fromJson(Map<String, dynamic> json) {
    return PercorsoAssegnato(
      percorsoIdEsterno: json['percorsoIdEsterno'],
      nomePercorso: json['nomePercorso'],
    );
  }

  Map<String, dynamic> toJson() => {
        'percorsoIdEsterno': percorsoIdEsterno,
        'nomePercorso': nomePercorso,
      };
}
