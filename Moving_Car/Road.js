
var RoadVertexBuffer;
var RoadVertexNormalBuffer;
var RoadTriIndexBuffer;

var Road = ring(3.5,5);

function setupRoad(){
    //VertexBuffer
    RoadVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, RoadVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Road.vertexPositions, gl.STATIC_DRAW);
    
    //NormalBuffer
    RoadVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, RoadVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Road.vertexNormals, gl.STATIC_DRAW);
    
    //FaceBuffer
    RoadTriIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, RoadTriIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Road.indices, gl.STATIC_DRAW);
    
    ready_Road = true;
    

    // ready_to_draw = true;
}


function drawRoad(){

    uploadViewDirToShader();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, RoadVertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, RoadVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, RoadTriIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, Road.ringcount, gl.UNSIGNED_SHORT, 0);
}
