import 'package:flutter/material.dart';

class TopBar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 64,
      padding: const EdgeInsets.symmetric(horizontal: 24),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(
          bottom: BorderSide(
            color: Colors.black,
            width: 1.5, // 👈 linea di separazione
          ),
        ),
      ),
      child: Row(
        children: [
          /*Expanded(
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Cerca utente...',
                prefixIcon: const Icon(Icons.search),
                filled: true,
                fillColor: Colors.grey.shade100,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),*/
          const Spacer(),
          const SizedBox(width: 16),
          IconButton(
            icon: const Icon(Icons.notifications_none),
            onPressed: () {},
          ),
          const SizedBox(width: 16),
          const CircleAvatar(
            backgroundImage: NetworkImage('url_avatar'),
          ),
        ],
      ),
    );
  }
}
