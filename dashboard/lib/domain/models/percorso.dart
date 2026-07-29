class Percorso {
  final String id;
  final Author author;
  final String title;
  final String description;
  final String platform;
  final bool publish;
  final String? learningContext;
  final int? duration;
  final List<dynamic> topics;
  final List<dynamic> tags;
  final List<dynamic> nodes;
  final List<dynamic> edges;
  final String? sourceMaterial;
  final String? language;
  final String? macroSubject;
  final String? context;
  final int? executedTimes;
  final int v;

  Percorso({
    required this.id,
    required this.author,
    required this.title,
    required this.description,
    required this.platform,
    required this.publish,
    this.learningContext,
    this.duration,
    required this.topics,
    required this.tags,
    required this.nodes,
    required this.edges,
    this.sourceMaterial,
    this.language,
    this.macroSubject,
    this.context,
    this.executedTimes,
    required this.v,
  });

  factory Percorso.fromJson(Map<String, dynamic> json) {
    return Percorso(
      id: json['_id'],
      author: Author.fromJson(json['author']),
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      platform: json['platform'] ?? '',
      publish: json['publish'] ?? false,
      learningContext: json['learningContext'],
      duration: json['duration'],
      topics: json['topics'] ?? [],
      tags: json['tags'] ?? [],
      nodes: json['nodes'] ?? [],
      edges: json['edges'] ?? [],
      sourceMaterial: json['sourceMaterial'],
      language: json['language'],
      macroSubject: json['macro_subject'],
      context: json['context'],
      executedTimes: json['executedTimes'],
      v: json['__v'] ?? 0,
    );
  }
}

class Author {
  final String id;
  final String username;

  Author({
    required this.id,
    required this.username,
  });

  factory Author.fromJson(Map<String, dynamic> json) {
    return Author(
      id: json['_id'],
      username: json['username'] ?? '',
    );
  }
}