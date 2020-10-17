
var GroundVertexBuffer;
var GroundVertexNormalBuffer;
var GroundTriIndexBuffer;

var GroundTexture;

var Ground = uvCylinder(6,0.5,false,false);

function setupGround(){
    //VertexBuffer
    GroundVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, GroundVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Ground.vertexPositions, gl.STATIC_DRAW);
    
    //NormalBuffer
    GroundVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, GroundVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Ground.vertexNormals, gl.STATIC_DRAW);
    
    //FaceBuffer
    GroundTriIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, GroundTriIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Ground.indices, gl.STATIC_DRAW);

    ready_Ground = true;
    

   // ready_to_draw = true;
}


function drawGround(){

    uploadViewDirToShader();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, GroundVertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, GroundVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, GroundTriIndexBuffer);
    
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, Ground.cylindercount, gl.UNSIGNED_SHORT, 0);
}
