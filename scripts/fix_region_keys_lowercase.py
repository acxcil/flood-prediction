import json
import os
import ast

config_path = os.path.join("config", "regions_config.py")
backup_path = os.path.join("config", "regions_config_backup.py")

# Step 1: Read and backup original file
with open(config_path, "r", encoding="utf-8") as f:
    original_code = f.read()

with open(backup_path, "w", encoding="utf-8") as backup:
    backup.write(original_code)

# Step 2: Parse the dictionary using AST (abstract syntax tree)
tree = ast.parse(original_code)
for node in tree.body:
    if isinstance(node, ast.Assign):
        if node.targets[0].id == "REGIONS" and isinstance(node.value, ast.Dict):
            regions_dict = ast.literal_eval(node.value)
            break
else:
    raise ValueError("Could not find REGIONS dict in config.")

# Step 3: Lowercase all top-level keys
lowercased = {k.lower(): v for k, v in regions_dict.items()}

# Step 4: Dump back into Python file format
with open(config_path, "w", encoding="utf-8") as f:
    f.write("REGIONS = ")
    f.write(json.dumps(lowercased, indent=4))
    f.write("\n")

print("✅ Converted REGIONS keys to lowercase and saved to config/regions_config.py")
print("📦 Backup created at config/regions_config_backup.py")
