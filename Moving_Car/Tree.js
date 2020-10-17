var TrunkVertexBuffer;
var TrunkVertexNormalBuffer;
var TrunkTriIndexBuffer;


var LeafVertexBuffer;
var LeafVertexNormalBuffer;
var LeafTriIndexBuffer;

var Trunk = uvCylinder(0.2,1.5);
var Leaf = uvCone(0.5,1.25);

function setupLeaf(){
    //VertexBuffer
    LeafVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, LeafVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Leaf.vertexPositions, gl.STATIC_DRAW);
    
    //NormalBuffer
    LeafVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, LeafVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Leaf.vertexNormals, gl.STATIC_DRAW);
    
    //FaceBuffer
    LeafTriIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, LeafTriIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Leaf.indices, gl.STATIC_DRAW);
    
    ready_Leaf = true;

    // ready_to_draw = true;
}


function drawLeaf(){

    uploadViewDirToShader();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, LeafVertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, LeafVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, LeafTriIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, Leaf.Conecount, gl.UNSIGNED_SHORT, 0);
}




function setupTrunk(){
    //VertexBuffer
    TrunkVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, TrunkVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Trunk.vertexPositions, gl.STATIC_DRAW);
    
    //NormalBuffer
    TrunkVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, TrunkVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Trunk.vertexNormals, gl.STATIC_DRAW);
    
    //FaceBuffer
    TrunkTriIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, TrunkTriIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Trunk.indices, gl.STATIC_DRAW);
    
    ready_Trunk = true;
    

    // ready_to_draw = true;
}


function drawTrunk(){

    uploadViewDirToShader();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, TrunkVertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, TrunkVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, TrunkTriIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, Trunk.cylindercount, gl.UNSIGNED_SHORT, 0);
}
