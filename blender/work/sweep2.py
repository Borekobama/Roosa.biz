import bpy, sys, os
out = sys.argv[sys.argv.index("--")+1]
sc = bpy.context.scene
sc.render.resolution_x = sc.render.resolution_y = 64
sc.eevee.taa_render_samples = 4
emit = bpy.data.materials["ROOSA_backdrop"].node_tree.nodes["Emission"]
def lin(c): return tuple((v/12.92 if v<=0.04045 else ((v+0.055)/1.055)**2.4) for v in c)+(1.0,)
for name, col, s in (
    ("warmA", (1.00, 0.90, 0.86), 11.0),
    ("warmB", (1.00, 0.86, 0.80), 13.0),
    ("warmC", (1.00, 0.82, 0.75), 15.0),
):
    emit.inputs["Color"].default_value = lin(col)
    emit.inputs["Strength"].default_value = s
    sc.render.filepath = os.path.join(out, "s2-%s.png" % name)
    bpy.ops.render.render(write_still=True)
