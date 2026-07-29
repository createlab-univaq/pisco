  import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class InfoItem extends StatelessWidget {

    final String label;
    final String value;

    const InfoItem({
      super.key,
      required this.label,
      required this.value,
    });

    @override
    Widget build(BuildContext context) {
      return Expanded(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: const TextStyle(
                fontSize: 13,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              value,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      );
    }
  }