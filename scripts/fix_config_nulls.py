# scripts/fix_config_nulls.py

from pathlib import Path

cfg = Path('config/regions_config.py')
text = cfg.read_text(encoding='utf-8')

# Replace JSON null with Python None
fixed = text.replace(': null', ': None')

cfg.write_text(fixed, encoding='utf-8')
print("✅ Replaced null → None in regions_config.py")
