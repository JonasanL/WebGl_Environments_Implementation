var CarVertexBuffer;
var CarVertexNormalBuffer;
var CarTriIndexBuffer;

var Top = cube();

function setupCar(){
    //VertexBuffer
    
    CarVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, CarVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Top.vertexPositions, gl.STATIC_DRAW);
    
    //NormalBuffer
    CarVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, CarVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Top.vertexNormals, gl.STATIC_DRAW);
    
    //FaceBuffer
    CarTriIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, CarTriIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Top.indices, gl.STATIC_DRAW);
    

    ready_car_top = true;
}


function drawCar(){

    uploadViewDirToShader();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, CarVertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, CarVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, CarTriIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, Top.Cubecount, gl.UNSIGNED_SHORT, 0);
}
