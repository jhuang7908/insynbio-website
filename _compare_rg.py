import re

with open('therasik-web-source/Therasik_Antibody_Guide.html', encoding='utf-8') as f:
    zh = f.read()
with open('insynbio-web-source/antibody-guide.html', encoding='utf-8') as f:
    en = f.read()

def get_func(html, name):
    m = re.search(r'(function ' + name + r'\(\).*?)(?=\nfunction |\Z)', html, re.DOTALL)
    return m.group(1) if m else None

rg_zh = get_func(zh, 'renderGrid')
rg_en = get_func(en, 'renderGrid')

print('=== THERASIK renderGrid ===')
print(rg_zh)

print('\n=== INSYNBIO renderGrid ===')  
print(rg_en)
