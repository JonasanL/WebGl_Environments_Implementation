
var SunVertexBuffer;
var SunVertexNormalBuffer;
var SunTriIndexBuffer;

var Sun = uvSphere(1);

function setupSun(){
    //VertexBuffer
    SunVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, SunVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Sun.vertexPositions, gl.STATIC_DRAW);
    
    //NormalBuffer
    SunVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, SunVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Sun.vertexNormals, gl.STATIC_DRAW);
    
    //FaceBuffer
    SunTriIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, SunTriIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Sun.indices, gl.STATIC_DRAW);
    
    ready_Sun = true;
    

    // ready_to_draw = true;
}


function drawSun(){

    uploadViewDirToShader();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, SunVertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, SunVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, SunTriIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, Sun.Spherecount, gl.UNSIGNED_SHORT, 0);
}
