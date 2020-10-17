
var TireVertexBuffer;
var TireVertexNormalBuffer;
var TireTriIndexBuffer;


var LineVertexBuffer;
var LineVertexNormalBuffer;
var LineTriIndexBuffer;

var Tire = uvTorus(0.5,0.3,32,2 );
var Line = uvCylinder(0.02,0.8);

function setupLine(){
    //VertexBuffer
    LineVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, LineVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Line.vertexPositions, gl.STATIC_DRAW);
    
    //NormalBuffer
    LineVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, LineVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Line.vertexNormals, gl.STATIC_DRAW);
    
    //FaceBuffer
    LineTriIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, LineTriIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Line.indices, gl.STATIC_DRAW);
    
    ready_Line = true;
    
    
    // ready_to_draw = true;
}


function drawLine(){
    
    uploadViewDirToShader();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, LineVertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, LineVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, LineTriIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, Line.cylindercount, gl.UNSIGNED_SHORT, 0);
}




function setupTire(){
    //VertexBuffer
    TireVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, TireVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Tire.vertexPositions, gl.STATIC_DRAW);
    
    //NormalBuffer
    TireVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, TireVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Tire.vertexNormals, gl.STATIC_DRAW);
    
    //FaceBuffer
    TireTriIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, TireTriIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Tire.indices, gl.STATIC_DRAW);
    
    ready_Tire = true;
    
    
    // ready_to_draw = true;
}


function drawTire(){
    
    uploadViewDirToShader();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, TireVertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, TireVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, TireTriIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, Tire.Toruscount, gl.UNSIGNED_SHORT, 0);
}
