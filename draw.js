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
			drawBackground();
			drawPlayer();
			drawStatics();
			break;
	}
	console.log(cam.pos.z);
	console.log("human x:"+human.pos.x+" y:"+human.pos.y+" z:"+human.pos.z);
	
}
function drawBackground()
{
	var offset = new v3(0,0,0)
	levelBackground.draw(offset);
	//offset = new v3(0,0,2304);
	//levelBackground.draw(offset);
}

function drawPlayer()
{
	var i,j;
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
	var i,j;

	for (i=0;i<statics.length;i++)
	{
		mat4.identity(mvMatrix);
		mat4.rotate(mvMatrix,degToRad(cam.pitch),[-1,0,0]);
		mat4.rotate(mvMatrix,degToRad(cam.yaw),[0,-1,0]);
		mat4.rotate(mvMatrix,degToRad(cam.roll),[0,0,-1]);
		mat4.translate(mvMatrix,[-cam.pos.x,-cam.pos.y,-cam.pos.z])
		mat4.translate(mvMatrix,[statics[i].pos.x,statics[i].pos.y,statics[i].pos.z])
		mat4.rotate(mvMatrix,degToRad(statics[i].rot.x),[1,0,0]);
		mat4.rotate(mvMatrix,degToRad(statics[i].rot.y),[0,1,0]);
		mat4.rotate(mvMatrix,degToRad(statics[i].rot.z),[0,0,1]);
		
		//lighting
		gl.uniform3f(shaderProgram.ambientColorUniform,0.2,0.2,0.2);
		var lightingDirection = [-0.25,-0.25,0.0];
		var adjustedLD = vec3.create();
		vec3.normalize(lightingDirection, adjustedLD);
		vec3.scale(adjustedLD, -1);
		gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
		gl.uniform3f(shaderProgram.directionalColorUniform,1.1,1.1,1.1);

		//setMatrixUniforms();
		for (j=0;j<models[statics[i].model].meshes.length;j++)
		{
			var mesh = models[statics[i].model].meshes[j];
			var material = models[statics[i].model].materials[mesh.material];
			var texture = models[statics[i].model].textures[material.texture];
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
function initShaders()
{
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");
	
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}
	
	gl.useProgram(shaderProgram);
	
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
	gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
	gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
    shaderProgram.vertexUVAttribute = gl.getAttribLocation(shaderProgram, "aVertexUV");
	gl.enableVertexAttribArray(shaderProgram.vertexUVAttribute);
	
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
	//set up lighting for shaders
	shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
	shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
	shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
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