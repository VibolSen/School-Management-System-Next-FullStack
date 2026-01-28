import os
import re
from pathlib import Path

# Base directory for API routes
API_DIR = r"d:\STEP Acadermy\Term_4\Next-js\School-Management-System\app\api"

def fix_params_in_file(file_path):
    """Fix async params in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes_made = []
        
        # Pattern 1: const { paramName } = params;
        # Replace with: const { paramName } = await params;
        pattern1 = r'(\s+)(const\s+\{[^}]+\}\s*=\s*)params;'
        if re.search(pattern1, content):
            content = re.sub(pattern1, r'\1\2await params;', content)
            changes_made.append("Added await to destructured params")
        
        # Pattern 2: const paramName = params.paramName;
        # Replace with: const { paramName } = await params;
        pattern2 = r'(\s+)const\s+(\w+)\s*=\s*params\.(\w+);'
        matches = re.finditer(pattern2, content)
        for match in matches:
            indent = match.group(1)
            param_name = match.group(2)
            # Replace with destructured version
            replacement = f'{indent}const {{ {param_name} }} = await params;'
            content = content.replace(match.group(0), replacement)
            changes_made.append(f"Fixed params.{param_name}")
        
        # Pattern 3: params.paramName used directly (less common)
        # This is trickier and might need manual review
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, changes_made
        
        return False, []
    
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False, []

def main():
    """Main function to process all route files"""
    fixed_files = []
    skipped_files = []
    
    # Walk through all route.js files
    for root, dirs, files in os.walk(API_DIR):
        for file in files:
            if file == 'route.js':
                file_path = os.path.join(root, file)
                was_fixed, changes = fix_params_in_file(file_path)
                
                if was_fixed:
                    rel_path = os.path.relpath(file_path, API_DIR)
                    fixed_files.append((rel_path, changes))
                    print(f"✅ Fixed: {rel_path}")
                    for change in changes:
                        print(f"   - {change}")
                else:
                    rel_path = os.path.relpath(file_path, API_DIR)
                    skipped_files.append(rel_path)
    
    print(f"\n{'='*60}")
    print(f"Summary:")
    print(f"  Fixed: {len(fixed_files)} files")
    print(f"  Skipped: {len(skipped_files)} files")
    print(f"{'='*60}")
    
    if fixed_files:
        print("\nFixed files:")
        for file, changes in fixed_files:
            print(f"  - {file}")

if __name__ == "__main__":
    main()
