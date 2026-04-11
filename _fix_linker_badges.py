with open('adc_database.html', encoding='utf-8') as f:
    html = f.read()

# Fix badge text for 22 linker cards that now have data-ltype="Enzymatic-cleavable"
# but still show old badge text "Cleavable"
old_badge = 'badge-linker">Cleavable</span>'
new_badge = 'badge-linker">Enzymatic-cleavable</span>'
count = html.count(old_badge)
html = html.replace(old_badge, new_badge)
print(f"Updated {count} linker badges from 'Cleavable' to 'Enzymatic-cleavable'")

with open('adc_database.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Saved.")
