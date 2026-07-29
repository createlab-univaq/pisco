class Domandetest {
  final int indice;
  final bool correct;
  final double reactionTime;

  Domandetest({
    required this.indice,
    required this.correct,
    required this.reactionTime
  });

  factory Domandetest.fromJson(Map<String, dynamic> json) {
    return Domandetest(
      indice: json['indice'],
      correct: json['correct'],
      reactionTime: (json['reactionTime'] as num).toDouble(),
    );
  }

}