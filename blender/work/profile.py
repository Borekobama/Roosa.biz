"""Radius of the roll's outer surface as a function of position along its axis.

The prop is not a perfect cylinder -- it has soft, slightly barrelled rims. The
paper strip has to sit on the real surface, not on an idealised radius, or its
edges float clear of the roll.
"""
import math
import bpy

ob = bpy.data.objects["ROLL_paper_wrapped"]
deps = bpy.context.evaluated_depsgraph_get()
me = ob.evaluated_get(deps).to_mesh()

hw = 0.102247 * 0.5
bins = 20
buckets = [[] for _ in range(bins)]
for v in me.vertices:
    x, y, z = v.co
    r = math.hypot(y, z)
    t = (x + hw) / (2 * hw)
    if 0.0 <= t <= 1.0:
        buckets[min(bins - 1, int(t * bins))].append(r)

print("PROFILE_BEGIN")
for i, b in enumerate(buckets):
    if not b:
        continue
    x = (-hw + (i + 0.5) / bins * 2 * hw) * 1000
    outer = max(b)
    # 95th percentile approximates the actual outer skin, ignoring stray verts
    b.sort()
    p95 = b[int(len(b) * 0.95)]
    print("x=%7.2fmm  max_r=%7.3fmm  p95_r=%7.3fmm  n=%d" % (x, outer * 1000, p95 * 1000, len(b)))
print("PROFILE_END")
ob.evaluated_get(deps).to_mesh_clear()
