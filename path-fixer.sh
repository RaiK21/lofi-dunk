#!/bin/bash

# Find the file ./dist/index.html
file_path="./dist/index.html"

if [ -f "$file_path" ]; then
    echo "File $file_path found."
    # Check if the line "/assets" exists in the file
    if grep -q "/assets" "$file_path"; then
        echo "Replacing /assets with ./assets..."
        # Replace /assets with ./assets
        sed -i 's@/assets@./assets@g' "$file_path"
        echo "Replacement done."
    else
        echo "Line /assets not found in $file_path."
    fi
else
    echo "File $file_path not found."
fi