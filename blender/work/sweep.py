import bpy, sys, os
out = sys.argv[sys.argv.index("--")+1]
sc = bpy.context.scene
sc.render.resolution_x = sc.render.resolution_y = 64
sc.eevee.taa_render_samples = 4
emit = bpy.data.materials["ROOSA_backdrop"].node_tree.nodes["Emission"]
for s in (1.55, 2.5, 3.5, 4.5, 6.0, 8.0):
    emit.inputs["Strength"].default_value = s
    sc.render.filepath = os.path.join(out, "sweep-%.2f.png" % s)
    bpy.ops.render.render(write_still=True)
    print("SWEEP", s)
