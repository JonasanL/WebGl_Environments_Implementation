

var PoleVertexBuffer;
var PoleVertexNormalBuffer;
var PoleTriIndexBuffer;


var SLightVertexBuffer;
var SLightVertexNormalBuffer;
var SLightTriIndexBuffer;

var Pole = uvCylinder(0.05,2);
var SLight = uvSphere(0.15);

function setupSLight(){
    //VertexBuffer
    SLightVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, SLightVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, SLight.vertexPositions, gl.STATIC_DRAW);
    
    //NormalBuffer
    SLightVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, SLightVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, SLight.vertexNormals, gl.STATIC_DRAW);
    
    //FaceBuffer
    SLightTriIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, SLightTriIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, SLight.indices, gl.STATIC_DRAW);
    
    ready_SLight = true;
    

    // ready_to_draw = true;
}


function drawSLight(){

    uploadViewDirToShader();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, SLightVertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, SLightVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, SLightTriIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, SLight.Spherecount, gl.UNSIGNED_SHORT, 0);
}




function setupPole(){
    //VertexBuffer
    PoleVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, PoleVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Pole.vertexPositions, gl.STATIC_DRAW);
    
    //NormalBuffer
    PoleVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, PoleVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Pole.vertexNormals, gl.STATIC_DRAW);
    
    //FaceBuffer
    PoleTriIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, PoleTriIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Pole.indices, gl.STATIC_DRAW);
    
    ready_Pole = true;
    

    // ready_to_draw = true;
}


function drawPole(){

    uploadViewDirToShader();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, PoleVertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, PoleVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, PoleTriIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, Pole.cylindercount, gl.UNSIGNED_SHORT, 0);
}
