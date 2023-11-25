# no way bestgamer using python (i ahte python)...
import bpy
import json
import pyperclip

def serialize_vector(vector):
    return [vector.x, vector.y, vector.z]

def get_triangles(mesh, view_matrix, obj_matrix):
    triangles = []
    for polygon in mesh.polygons:
        triangles.extend([[serialize_vector(view_matrix @ obj_matrix @ mesh.vertices[vi].co) for vi in polygon.vertices[i:i+3]] for i in range(len(polygon.vertices)-2)])
    return triangles

start_frame, end_frame = bpy.context.scene.frame_start, bpy.context.scene.frame_end

all_frames_data = []
for frame in range(start_frame, end_frame + 1):
    bpy.context.scene.frame_set(frame)
    view_matrix = bpy.context.scene.camera.matrix_world.inverted()
    camera_position = serialize_vector(bpy.context.scene.camera.location)
    camera_rotation = serialize_vector(bpy.context.scene.camera.rotation_euler)
    all_triangles = []
    for obj in bpy.context.scene.objects:
        if obj.type == 'MESH':
            obj_matrix = obj.matrix_world
            bpy.context.view_layer.objects.active = obj
            all_triangles.append(get_triangles(obj.data, view_matrix, obj_matrix))
    all_frames_data.append({'frame': frame, 'camera': {'position': camera_position, 'rotation': camera_rotation}, 'meshes': all_triangles})

output = {'frames': all_frames_data}
output_json = json.dumps(output)
pyperclip.copy(output_json) # copy the output to clipboard
