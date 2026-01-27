#!/usr/bin/env python3
"""Query orphan program statistics from Magic Knowledge Base"""

import sqlite3
import os
import sys

db_path = os.path.join(os.environ['USERPROFILE'], '.magic-kb', 'knowledge.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

project_filter = sys.argv[1] if len(sys.argv) > 1 else None

if project_filter:
    # Detailed query for specific project
    cursor.execute('''
    SELECT
        p.ide_position,
        p.name,
        p.public_name,
        (SELECT COUNT(*) FROM program_calls pc WHERE pc.called_program_id = p.id) as caller_count
    FROM programs p
    JOIN projects pr ON p.project_id = pr.id
    WHERE pr.name = ?
    ORDER BY caller_count ASC, p.ide_position ASC
    ''', (project_filter,))

    print(f"## Orphan Analysis: {project_filter}")
    print()
    print("| IDE | Name | PublicName | Callers | Status |")
    print("|-----|------|------------|---------|--------|")

    orphan_count = 0
    total = 0
    orphan_list = []

    for row in cursor.fetchall():
        total += 1
        ide, name, public_name, caller_count = row
        pub = public_name if public_name else "-"

        if caller_count > 0:
            status = "USED"
        elif public_name:
            status = "CALLABLE"
        else:
            status = "ORPHAN"
            orphan_count += 1
            orphan_list.append((ide, name))

        if status in ["ORPHAN", "CALLABLE"]:
            print(f"| {ide} | {name} | {pub} | {caller_count} | {status} |")

    print()
    print(f"**Summary**: {orphan_count} orphans, {total - orphan_count} used/callable out of {total} total")
    print()
    print("### Orphan programs to investigate:")
    for ide, name in orphan_list[:20]:
        print(f"- ADH IDE {ide} - {name}")
    if len(orphan_list) > 20:
        print(f"... and {len(orphan_list) - 20} more")

else:
    # Summary query for all projects
    cursor.execute('''
    SELECT
        pr.name as project,
        COUNT(*) as total,
        SUM(CASE WHEN EXISTS(SELECT 1 FROM program_calls pc WHERE pc.called_program_id = p.id) THEN 1 ELSE 0 END) as has_callers,
        SUM(CASE WHEN p.public_name IS NOT NULL AND p.public_name != '' THEN 1 ELSE 0 END) as has_public_name
    FROM programs p
    JOIN projects pr ON p.project_id = pr.id
    GROUP BY pr.name
    ORDER BY total DESC
    ''')

    print("## Orphan Statistics by Project")
    print()
    print("| Project | Total | Has Callers | Has PublicName | Potential Orphans |")
    print("|---------|-------|-------------|----------------|-------------------|")

    for row in cursor.fetchall():
        project, total, has_callers, has_public_name = row
        potential_orphans = total - has_callers
        used_pct = (has_callers / total * 100) if total > 0 else 0
        print(f"| {project} | {total} | {has_callers} ({used_pct:.0f}%) | {has_public_name} | {potential_orphans} |")

conn.close()
