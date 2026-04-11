import re

with open('../therasik-web-source/Therasik_ADC_Database.html', encoding='utf-8') as f:
    html = f.read()

pi = html.find('panel-payloads')
segment = html[pi:pi+6000]

# What structure does the payload data use?
print("=== First 3000 chars of payload panel ===")
print(segment[:3000])
print()

# Also check the linker panel
li = html.find('panel-linkers')
lseg = html[li:li+3000]
print("=== First 3000 chars of linker panel ===")
print(lseg[:3000])
