// Drawing functions and webgl accessory stuff
function draw()
{	
	//must set about:config security.fileuri.strict_origin_policy=false to render
	//set up viewport
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 3000.0, pMatrix);
	
	switch (playState)
	{
		case 0:
			//draw loading screen
			break;
		case 1:
			drawPlayer();
			drawBackground();
			//drawStatics();
			drawAsteroids();
			drawEnemies();
			drawGUI();
			break;
	}
	console.log("cam z:"+cam.pos.z);
	console.log("human x:"+human.pos.x+" y:"+human.pos.y+" z:"+human.pos.z);
	console.log("levLength:"+levelLength);
	
}
function drawGUI()
{
	//fill here
	//getElementById("healthbar").innerHTML = ""
	//health -> human.hp
	//background box: width: 100
	//hp box : width (hp/hpMax)*100
}
function drawBackground()
{
	shaderProgram = shaderProgram_main;
	gl.useProgram(shaderProgram);
	gl.uniform1f(shaderProgram.draw_with_lighting,0.0);
	
	var offset = new v3(0,0,-Math.round(-cam.pos.z/2304)*2304);
	levelBackground.draw(offset);
	var background_position = cam.pos.z % 2304;
	
	if (background_position > 2304/2)
		offset = new v3(0,0,-(Math.round(-cam.pos.z/2304)+1)*2304);
	else
		offset = new v3(0,0,-(Math.round(-cam.pos.z/2304)-1)*2304);
	levelBackground.draw(offset);
}
function drawAsteroids()
{
	var i,j;
	shaderProgram = shaderProgram_main;
	gl.useProgram(shaderProgram);

	for (i=0;i<asteroids.length;i++)
	{
		if (asteroids[i] != null)
		{
			if (asteroids[i].flash)
			{
				shaderProgram = shaderProgram_flash;
            	gl.disable(gl.BLEND);
            	gl.enable(gl.DEPTH_TEST);
			}
			else if (asteroids[i].phase != human.phase)
			{
				shaderProgram = shaderProgram_phase;
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
            	gl.enable(gl.BLEND);
            	gl.disable(gl.DEPTH_TEST);
			}
			else
				shaderProgram = shaderProgram_main;
				
			gl.useProgram(shaderProgram);
			
			mat4.identity(mvMatrix);
			mat4.rotate(mvMatrix,degToRad(cam.pitch),[-1,0,0]);
			mat4.rotate(mvMatrix,degToRad(cam.yaw),[0,-1,0]);
			mat4.rotate(mvMatrix,degToRad(cam.roll),[0,0,-1]);
			mat4.translate(mvMatrix,[-cam.pos.x,-cam.pos.y,-cam.pos.z]);
			mat4.translate(mvMatrix,[asteroids[i].pos.x,asteroids[i].pos.y,asteroids[i].pos.z]);
			mat4.rotate(mvMatrix,degToRad(asteroids[i].rot.x),[1,0,0]);
			mat4.rotate(mvMatrix,degToRad(asteroids[i].rot.y),[0,1,0]);
			mat4.rotate(mvMatrix,degToRad(asteroids[i].rot.z),[0,0,1]);
			mat4.scale(mvMatrix,[asteroids[i].scale.x,asteroids[i].scale.y,asteroids[i].scale.z]);
			
			//lighting
			gl.uniform3f(shaderProgram.ambientColorUniform,0.2,0.2,0.2);
			var lightingDirection = [-0.25,-0.25,0.0];
			var adjustedLD = vec3.create();
			vec3.normalize(lightingDirection, adjustedLD);
			vec3.scale(adjustedLD, -1);
			gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
			gl.uniform3f(shaderProgram.directionalColorUniform,1.1,1.1,1.1);
			gl.uniform1f(shaderProgram.time,asteroids[i].hit_timer);
			gl.uniform1f(shaderProgram.draw_with_lighting,1.0);
	
			//setMatrixUniforms();
			for (j=0;j<models[asteroids[i].model].meshes.length;j++)
			{
				var mesh = models[asteroids[i].model].meshes[j];
				var material = models[asteroids[i].model].materials[mesh.material];
				var texture = models[asteroids[i].model].textures[material.texture];
				mvPushMatrix();
				mat4.translate(mvMatrix,[mesh.locTrans.x,mesh.locTrans.y,mesh.locTrans.z]); //translate mesh local pos
				mat4.rotate(mvMatrix,degToRad(mesh.locRot.x-90),[1,0,0]);
				mat4.rotate(mvMatrix,degToRad(mesh.locRot.z),[0,1,0]);
				mat4.rotate(mvMatrix,degToRad(mesh.locRot.y),[0,0,1]);
				mat4.scale(mvMatrix,[mesh.locScale.x,mesh.locScale.y,mesh.locScale.z]);
			
				gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexPosBuffer);
				gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,mesh.vertexPosBuffer.itemSize, gl.FLOAT, false, 0, 0);
				gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexColBuffer);
				gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,mesh.vertexColBuffer.itemSize, gl.FLOAT, false, 0, 0);
				gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexNormBuffer);
				gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute,mesh.vertexNormBuffer.itemSize, gl.FLOAT, false, 0, 0);
				gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexUVBuffer);
				gl.vertexAttribPointer(shaderProgram.vertexUVAttribute,mesh.vertexUVBuffer.itemSize, gl.FLOAT, false, 0, 0);
				
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, texture.gl_text);
				gl.uniform1i(shaderProgram.samplerUniform, 0);
				
				gl.getError();
				
				setMatrixUniforms();
				gl.drawArrays(gl.TRIANGLES, 0, mesh.vertexPosBuffer.numItems);
				mvPopMatrix();
			}
		}
	}
}
function drawEnemies()
{
	var i,j;

	for (i=0;i<enemies.length;i++)
	{
		if (enemies[i] != null)
		{
			if (enemies[i].flash)
			{
				shaderProgram = shaderProgram_flash;
            	gl.disable(gl.BLEND);
            	gl.enable(gl.DEPTH_TEST);
			}
			else if (enemies[i].phase != human.phase)
			{
				shaderProgram = shaderProgram_phase;
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
            	gl.enable(gl.BLEND);
            	gl.disable(gl.DEPTH_TEST);
			}
			else
				shaderProgram = shaderProgram_main;
				
			gl.useProgram(shaderProgram);
				
			mat4.identity(mvMatrix);
			mat4.rotate(mvMatrix,degToRad(cam.pitch),[-1,0,0]);
			mat4.rotate(mvMatrix,degToRad(cam.yaw),[0,-1,0]);
			mat4.rotate(mvMatrix,degToRad(cam.roll),[0,0,-1]);
			mat4.translate(mvMatrix,[-cam.pos.x,-cam.pos.y,-cam.pos.z]);
			mat4.translate(mvMatrix,[enemies[i].pos.x,enemies[i].pos.y,enemies[i].pos.z]);
			mat4.rotate(mvMatrix,degToRad(enemies[i].rot.x),[1,0,0]);
			mat4.rotate(mvMatrix,degToRad(enemies[i].rot.y),[0,1,0]);
			mat4.rotate(mvMatrix,degToRad(enemies[i].rot.z),[0,0,1]);
			
			//lighting
			gl.uniform3f(shaderProgram.ambientColorUniform,0.2,0.2,0.2);
			var lightingDirection = [-0.25,-0.25,0.0];
			var adjustedLD = vec3.create();
			vec3.normalize(lightingDirection, adjustedLD);
			vec3.scale(adjustedLD, -1);
			gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
			gl.uniform3f(shaderProgram.directionalColorUniform,1.1,1.1,1.1);
			gl.uniform1f(shaderProgram.time,enemies[i].hit_timer);
			gl.uniform1f(shaderProgram.draw_with_lighting,1.0);
	
			//setMatrixUniforms();
			for (j=0;j<models[enemies[i].model].meshes.length;j++)
			{
				var mesh = models[enemies[i].model].meshes[j];
				var material = models[enemies[i].model].materials[mesh.material];
				var texture = models[enemies[i].model].textures[material.texture];
				mvPushMatrix();
				mat4.translate(mvMatrix,[mesh.locTrans.x,mesh.locTrans.y,mesh.locTrans.z]); //translate mesh local pos
				mat4.rotate(mvMatrix,degToRad(mesh.locRot.x-90),[1,0,0]);
				mat4.rotate(mvMatrix,degToRad(mesh.locRot.z),[0,1,0]);
				mat4.rotate(mvMatrix,degToRad(mesh.locRot.y),[0,0,1]);
				mat4.scale(mvMatrix,[mesh.locScale.x,mesh.locScale.y,mesh.locScale.z]);
			
				gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexPosBuffer);
				gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,mesh.vertexPosBuffer.itemSize, gl.FLOAT, false, 0, 0);
				gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexColBuffer);
				gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,mesh.vertexColBuffer.itemSize, gl.FLOAT, false, 0, 0);
				gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexNormBuffer);
				gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute,mesh.vertexNormBuffer.itemSize, gl.FLOAT, false, 0, 0);
				gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexUVBuffer);
				gl.vertexAttribPointer(shaderProgram.vertexUVAttribute,mesh.vertexUVBuffer.itemSize, gl.FLOAT, false, 0, 0);
				
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, texture.gl_text);
				gl.uniform1i(shaderProgram.samplerUniform, 0);
				
				gl.getError();
				
				setMatrixUniforms();
				gl.drawArrays(gl.TRIANGLES, 0, mesh.vertexPosBuffer.numItems);
				mvPopMatrix();
			}
		}
	}
}
function drawPlayer()
{
	var i,j;
	if (human.flash)
		shaderProgram = shaderProgram_flash;
	else
		shaderProgram = shaderProgram_main;
	
	gl.disable(gl.BLEND);
	gl.enable(gl.DEPTH_TEST);
	gl.useProgram(shaderProgram);
	
	mat4.identity(mvMatrix);
	mat4.rotate(mvMatrix,degToRad(cam.pitch),[-1,0,0]);
	mat4.rotate(mvMatrix,degToRad(cam.yaw),[0,-1,0]);
	mat4.rotate(mvMatrix,degToRad(cam.roll),[0,0,-1]);
	mat4.translate(mvMatrix,[-cam.pos.x,-cam.pos.y,-cam.pos.z]);
	mat4.translate(mvMatrix,[human.pos.x,human.pos.y,human.pos.z]);
	mat4.rotate(mvMatrix,degToRad(human.pitch),[1,0,0]);
	mat4.rotate(mvMatrix,degToRad(human.yaw),[0,1,0]);
	mat4.rotate(mvMatrix,degToRad(human.roll),[0,0,1]);
	
	//lighting
	gl.uniform3f(shaderProgram.ambientColorUniform,0.2,0.2,0.2);
	var lightingDirection = [-0.25,-0.25,0.0];
	var adjustedLD = vec3.create();
	vec3.normalize(lightingDirection, adjustedLD);
	vec3.scale(adjustedLD, -1);
	gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
	gl.uniform3f(shaderProgram.directionalColorUniform,1.1,1.1,1.1);
	gl.uniform1f(shaderProgram.time,human.hit_timer);
	gl.uniform1f(shaderProgram.draw_with_lighting,1.0);

	//setMatrixUniforms();
	for (j=0;j<models[0].meshes.length;j++)
	{
		var mesh = models[0].meshes[j];
		var material = models[0].materials[mesh.material];
		var texture = models[0].textures[material.texture];
		mvPushMatrix();
		mat4.translate(mvMatrix,[mesh.locTrans.x,mesh.locTrans.y,mesh.locTrans.z]); //translate mesh local pos
		mat4.rotate(mvMatrix,degToRad(mesh.locRot.x-90),[1,0,0]);
		mat4.rotate(mvMatrix,degToRad(mesh.locRot.z),[0,1,0]);
		mat4.rotate(mvMatrix,degToRad(mesh.locRot.y),[0,0,1]);
		mat4.scale(mvMatrix,[mesh.locScale.x,mesh.locScale.y,mesh.locScale.z]);
	
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexPosBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,mesh.vertexPosBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexColBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,mesh.vertexColBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexNormBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute,mesh.vertexNormBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexUVBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexUVAttribute,mesh.vertexUVBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture.gl_text);
		gl.uniform1i(shaderProgram.samplerUniform, 0);
		
		gl.getError();
		
		setMatrixUniforms();
		gl.drawArrays(gl.TRIANGLES, 0, mesh.vertexPosBuffer.numItems);
		mvPopMatrix();
	}
}
function drawStatics()
{
	//relic function
}

function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
	  return null;
	}
	
	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
	  if (k.nodeType == 3)
		  str += k.textContent;
	  k = k.nextSibling;
	}
	
	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
	  shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
	  shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
	  return null;
	}
	
	gl.shaderSource(shader, str);
	gl.compileShader(shader);
	
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	  alert(gl.getShaderInfoLog(shader));
	  return null;
	}
	
	return shader;
}
function createProgram(fragmentShaderID, vertexShaderID) {
	var fragmentShader = getShader(gl, fragmentShaderID);
	var vertexShader = getShader(gl, vertexShaderID);

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	program.vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
	gl.enableVertexAttribArray(program.vertexPositionAttribute);
	program.vertexColorAttribute = gl.getAttribLocation(program, "aVertexColor");
	gl.enableVertexAttribArray(program.vertexColorAttribute);
    program.vertexNormalAttribute = gl.getAttribLocation(program, "aVertexNormal");
	gl.enableVertexAttribArray(program.vertexNormalAttribute);
    program.vertexUVAttribute = gl.getAttribLocation(program, "aVertexUV");
	gl.enableVertexAttribArray(program.vertexUVAttribute);

	program.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
	program.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");
	program.nMatrixUniform = gl.getUniformLocation(program, "uNMatrix");
	program.samplerUniform = gl.getUniformLocation(program, "uSampler");
	program.useTexturesUniform = gl.getUniformLocation(program, "uUseTextures");
	program.ambientColorUniform = gl.getUniformLocation(program, "uAmbientColor");
	program.lightingDirectionUniform = gl.getUniformLocation(program, "uLightingDirection");
	program.directionalColorUniform = gl.getUniformLocation(program, "uDirectionalColor");
	program.time = gl.getUniformLocation(program, "uTime");
	program.draw_with_lighting = gl.getUniformLocation(program, "drawStyle");
	//program.pointLightingLocationUniform = gl.getUniformLocation(program, "uPointLightingLocation");
	//program.pointLightingColorUniform = gl.getUniformLocation(program, "uPointLightingColor");

	return program;
}
function initShaders() {
    shaderProgram_main = createProgram("shader-fs", "shader-vs");
	shaderProgram_flash = createProgram("shader-fs-flash", "shader-vs-flash");
	shaderProgram_phase = createProgram("shader-fs-phase", "shader-vs-phase");
}

function initLights()
{
}

function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

	var normalMatrix = mat3.create();
	mat4.toInverseMat3(mvMatrix, normalMatrix);
	mat3.transpose(normalMatrix);
	gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}

function mvPushMatrix() {
	var copy = mat4.create();
	mat4.set(mvMatrix, copy);
	mvMatrixStack.push(copy);
}

function mvPopMatrix() {
	if (mvMatrixStack.length == 0) {
		throw "Invalid popMatrix!";
	}
	mvMatrix = mvMatrixStack.pop();
}
function degToRad(degrees) {
	return degrees * Math.PI / 180;
}