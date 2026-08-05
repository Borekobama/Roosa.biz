"""Isolate the strip artifact: geometry or shading?"""
import importlib.util, os, sys, math
import bpy

SD = "/Users/berke/Downloads/ToiletPaperV2/output/scripts"
spec = importlib.util.spec_from_file_location("build", os.path.join(SD, "04_build_scene.py"))
build = importlib.util.module_from_spec(spec); spec.loader.exec_module(build)

out = sys.argv[sys.argv.index("--") + 1]
sc = bpy.context.scene
sc.frame_set(140)
build.apply_unroll(140)

strip = bpy.data.objects["PAPER_loose"]
roll = bpy.data.objects["ROLL_paper_wrapped"]

# geometry sanity: self-intersection / degenerate faces / normal consistency
deps = bpy.context.evaluated_depsgraph_get()
me = strip.evaluated_get(deps).to_mesh()
areas = [p.area for p in me.polygons]
print("EVAL verts=%d polys=%d" % (len(me.vertices), len(me.polygons)))
print("AREA min=%.3e max=%.3e" % (min(areas), max(areas)))
degenerate = sum(1 for a in areas if a < 1e-9)
print("DEGENERATE_FACES", degenerate)

# how much does the normal flip between neighbouring length segments?
w = build.P["WSEG"]
base = strip.data
worst, worst_i = 0.0, -1
prev = None
for i in range(build.P["SEG"] + 1):
    vs = [base.vertices[i * w + j].co for j in range(w)]
    e1 = vs[-1] - vs[0]
    e2 = (base.vertices[min(i + 1, build.P["SEG"]) * w].co - vs[0])
    n = e1.cross(e2)
    if n.length < 1e-12:
        continue
    n.normalize()
    if prev is not None:
        d = n.dot(prev)
        if d < worst:
            worst, worst_i = d, i
    prev = n
print("WORST_NORMAL_DOT %.4f at segment %d" % (worst, worst_i))
strip.evaluated_get(deps).to_mesh_clear()

sc.render.resolution_x = sc.render.resolution_y = 700
sc.eevee.taa_render_samples = 32
sc.render.image_settings.file_format = "PNG"

flat = bpy.data.materials.new("FLAT")
flat.use_nodes = True
bs = flat.node_tree.nodes["Principled BSDF"]
bs.inputs["Base Color"].default_value = (0.85, 0.45, 0.60, 1)
bs.inputs["Roughness"].default_value = 0.9

def shot(tag):
    sc.render.filepath = os.path.join(out, "diag-%s.png" % tag)
    bpy.ops.render.render(write_still=True)
    print("SHOT", tag)

orig = strip.data.materials[0]

# A: real material, modifiers on  (the current look)
shot("A-asis")

# B: flat material, modifiers on -> is it the shader?
strip.data.materials[0] = flat
shot("B-flatmat")

# C: flat material, modifiers off -> is it solidify/subsurf?
for m in strip.modifiers:
    m.show_render = False
shot("C-flatmat-nomods")

# D: real material, modifiers off
strip.data.materials[0] = orig
shot("D-realmat-nomods")

# E: hide the roll, in case the source prop overlaps the strip
roll.hide_render = True
for m in strip.modifiers:
    m.show_render = True
shot("E-norollmat")
