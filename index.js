require('@g-js-api/g.js');
const fs = require('fs');

let get = (filename) => {
	return new Promise((resolve) => {
		let f = fs.createReadStream(filename);
		let chunks = [];
	
		f.on("data", (chunk) => chunks.push(chunk));
	
		f.on('end', () => {
			chunks = JSON.parse(Buffer.concat(chunks).toString());
			resolve(chunks)
		})
	});
}

let id = 1764;
(async () => {
    // Replace this with the JSON output from your Python script
    const data = await get('out.json');


    function drawDot(x, y) {
		let g = unknown_g();
        $.add({
			OBJ_ID: id,
			X: x,
			Y: y,
			GROUPS: g
		})
		return g;
    }


    let scaling = 50;
    
    let [translation_x, translation_y] = [750, 650];
	let n_triangles = [];
	
    function initialDraw(meshTriangles) {
      // ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas for each frame
      meshTriangles.forEach(triangles => {
        // ctx.beginPath();
        triangles.forEach(triangle => {
					  let new_triangle = [];
          triangle.forEach((vertex, i) => {
            // Scale and translate the coordinates to fit into a 1000x1000 canvas
            var x = vertex[0] * scaling + translation_x;
            var y = -vertex[1] * scaling + translation_y; // Negate the y-coordinate to match Blender's coordinate system
            // ctx.lineTo(x, y);
            let j = drawDot(x, y);
			new_triangle.push({ obj: j, pos: [x, y] });
			if (i == 2) n_triangles.push(new_triangle);
          });
          // Close the path for each triangle
          // ctx.closePath();
        });
        // ctx.stroke();
      });
    }
	
	let changeFrame = (frm) => {
		let frame = data.frames[frm].meshes;
		
		 frame.forEach(triangles => {
			 
        // ctx.beginPath();
        triangles.forEach((triangle, i1) => {
          triangle.forEach((vertex, i2) => {
            // Scale and translate the coordinates to fit into a 1000x1000 canvas
			let old_triangle = n_triangles[i1];
            var x = vertex[0] * scaling + translation_x;
            var y = -vertex[1] * scaling + translation_y; // Negate the y-coordinate to match Blender's coordinate system
            // ctx.lineTo(x, y);
			let old_vertex = old_triangle[i2];
			// console.log(old_vertex)
			console.log(old_vertex.obj, vertex)
            old_vertex.obj.move(x - old_vertex.pos[0], y - old_vertex.pos[1])
          });
          // Close the path for each triangle
          // ctx.closePath(); 
        });
        // ctx.stroke();
      });
	}
	
    const fpsToMs = fps => 1000 / fps;
    function animate() {
      // Draw the current frame
      initialDraw(data.frames[0].meshes);
	  
	  ' '.repeat(8).split(' ').forEach((_, i) => {
		 if (i > 0) {
			wait(1);
			changeFrame(i);
		 }
	  })

	/*
      // Move to the next frame
      currentFrame++;
      if (currentFrame >= data.frames.length) {
        currentFrame = 0; // Loop back to the first frame
      }

      // Request the next animation frame
      setTimeout(() => animate(), fpsToMs(26))
	  */
    }

    // Start the animation
    animate();
	$.exportToSavefile({ info: true });
})();