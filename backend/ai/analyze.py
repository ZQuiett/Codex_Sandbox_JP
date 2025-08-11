import sys
import json
from PIL import Image
import numpy as np

def analyze(path):
    img = Image.open(path)
    arr = np.array(img)
    if arr.ndim == 3:
        green = arr[:, :, 1].mean()
    else:
        green = arr.mean()
    grass_overgrown = green > 100  # naive threshold
    weeds_present = False  # placeholder
    bush_needs_pruning = False  # placeholder
    return {
        "grass_overgrown": bool(grass_overgrown),
        "weeds_present": bool(weeds_present),
        "bush_needs_pruning": bool(bush_needs_pruning)
    }

if __name__ == '__main__':
    path = sys.argv[1]
    result = analyze(path)
    print(json.dumps(result))
