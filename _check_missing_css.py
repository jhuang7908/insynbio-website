import os

HERE = "d:/InSynBio-AI-Research/Antibody_Engineer_Suite/insynbio-web-source"

for name in os.listdir(HERE):
    if not name.endswith(".html"):
        continue
    path = os.path.join(HERE, name)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "padding: 72px 0 40px;" not in content:
        print(f"Missing new mobile nav CSS: {name}")
