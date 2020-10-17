var gl;
var canvas;

var SunRX
var SunRZ

var CarRX
var CarRY

var TireRX
var TireRY

var angle = 0;
var Carangle = 0;
var Tireangle = 0;

ready_car_top = false;
ready_Road = false;
ready_Ground = false;
ready_Lamp = false;
ready_SLight = false;
ready_Leaf = false;


var shaderProgram;

var mvMatrix = mat4.create();

var mMatrix = mat4.create();


var pMatrix = mat4.create();


var nMatrix = mat3.create();

//var eyePt = vec3.fromValues(20,0,0);
//var viewDir = vec3.fromValues(-1.0,0.0,0.0);
//Final eye
var eyePt = vec3.fromValues(7.0,-15,0);
var viewDir = vec3.fromValues(-1,2,0);
var up = vec3.fromValues(0.0,1.0,0.0);
var viewPt = vec3.fromValues(0.0,0.0,0.0);



var then =0;



function uploadRotateMatrixToShader(rotateMat){
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uRotateMat"), false, rotateMat);
}


//ModelView to shader
function uploadModelViewMatrixToShader() {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}
//Projection to shader
function uploadProjectionMatrixToShader() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
}
//Normal to shader
function uploadNormalMatrixToShader() {
    mat3.fromMat4(nMatrix,mvMatrix);
    mat3.transpose(nMatrix,nMatrix);
    mat3.invert(nMatrix,nMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, nMatrix);
}

function uploadLightsToShader(loc,a,d,s) {
    gl.uniform3fv(shaderProgram.uniformLightPositionLoc, loc);
    gl.uniform3fv(shaderProgram.uniformAmbientLightColorLoc, a);
    gl.uniform3fv(shaderProgram.uniformDiffuseLightColorLoc, d);
    gl.uniform3fv(shaderProgram.uniformSpecularLightColorLoc, s);
}

function uploadViewDirToShader(){
    gl.uniform3fv(gl.getUniformLocation(shaderProgram, "viewDir"), viewDir);
}

function setMatrixUniforms() {
    uploadModelViewMatrixToShader();
    uploadNormalMatrixToShader();
    uploadProjectionMatrixToShader();
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}


function createGLContext(canvas) {
    var names = ["webgl", "experimental-webgl"];
    var context = null;
    for (var i=0; i < names.length; i++) {
        try {
            context = canvas.getContext(names[i]);
        } catch(e) {}
        if (context) {
            break;
        }
    }
    if (context) {
        context.viewportWidth = canvas.width;
        context.viewportHeight = canvas.height;
    } else {
        alert("Failed to create WebGL context!");
    }
    return context;
}

function loadShaderFromDOM(id) {
    var shaderScript = document.getElementById(id);
    

    if (!shaderScript) {
        return null;
    }
    

    var shaderSource = "";
    var currentChild = shaderScript.firstChild;
    while (currentChild) {
        if (currentChild.nodeType == 3) {
            shaderSource += currentChild.textContent;
        }
        currentChild = currentChild.nextSibling;
    }
    
    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }
    
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

function setupShaders() {
    vertexShader = loadShaderFromDOM("shader-vs");
    fragmentShader = loadShaderFromDOM("shader-fs");
    
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Failed to setup shaders");
    }
    
    gl.useProgram(shaderProgram);
    
    // Enable vertex position
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    console.log("Vertex attrib: ", shaderProgram.vertexPositionAttribute);
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    
    // Enable vertex normals
    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
    
    // Enable matrix manipulations
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    
    // Enable Phong Shading options
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
    shaderProgram.uniformLightPositionLoc = gl.getUniformLocation(shaderProgram, "uLightPosition");
    shaderProgram.uniformAmbientLightColorLoc = gl.getUniformLocation(shaderProgram, "uAmbientLightColor");
    shaderProgram.uniformDiffuseLightColorLoc = gl.getUniformLocation(shaderProgram, "uDiffuseLightColor");
    shaderProgram.uniformSpecularLightColorLoc = gl.getUniformLocation(shaderProgram, "uSpecularLightColor");
}

function setupBuffers(){
    
    setupGround();
    setupRoad();
    setupPole();
    setupSLight();
    setupLeaf();
    setupTrunk();
    setupCar();
    setupSun();
    setupTire();
    setupLine();

}

function draw(){
    var translateVec = vec3.create();
    var scaleVec = vec3.create();
    
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    

    mat4.perspective(pMatrix,degToRad(90), gl.viewportWidth / gl.viewportHeight, 0.1, 200.0);
    

    vec3.set(translateVec,1.0,1.0,1.0);
    mat4.translate(mvMatrix, mvMatrix,translateVec);
    
    setMatrixUniforms();
    
    vec3.add(viewPt, eyePt, viewDir);
    mat4.lookAt(mvMatrix,eyePt,viewPt,up);
    

    
    if (SunRZ > 0){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "SLightUp"), false);
        uploadLightsToShader([-SunRX*10,18,SunRZ*10],[0,0,0],[0.6,0.65,0.6],[0,0,0]);
        }
    
    else{
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "SLightUp"), true);
        uploadLightsToShader([0,4,-16],[-0.1,-0.1,-0.1],[0.4,0.4,0.35],[0,0,0]);
    }

    
    //Build Ground
    if (ready_Ground){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsGround"), true);

        mat4.scale(mvMatrix,mvMatrix,[1.6,1.6,1.6]);
        mat4.rotateY(mvMatrix,mvMatrix,degToRad(-90));

        setMatrixUniforms();
        drawGround();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsGround"), false);
    }
    //Build Ring Road
    if (ready_Road){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsRoad"), true);
        mat4.translate(mvMatrix,mvMatrix,[0,0,-0.3]);
        setMatrixUniforms();
        
        drawRoad();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsRoad"), false);
    }
    

    //Build Pole
    if (ready_Pole){

        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsPole"), true);
        mat4.translate(mvMatrix,mvMatrix,[0,0,-0.45]);
        setMatrixUniforms();
        drawPole();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsPole"), false);
    }

    //Build Pole Light
    if (ready_SLight){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsSLight"), true);
        mat4.translate(mvMatrix,mvMatrix,[0,0,-1]);
        setMatrixUniforms();
        drawSLight();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsSLight"), false);
    }
    //Build Tree one
    if (ready_Leaf){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLeaf1"), true);
        mat4.translate(mvMatrix,mvMatrix,[-1.0,0.0,0.25]);
        mat4.rotateX(mvMatrix,mvMatrix,degToRad(180));
        setMatrixUniforms();
        drawLeaf();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLeaf1"), false);
        
    }
    if (ready_Trunk){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTrunk1"), true);
        mat4.translate(mvMatrix,mvMatrix,[0,0,-0.75]);

        setMatrixUniforms();
        drawTrunk();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTrunk1"), false);
        
    }

    //Build Tree two
    if (ready_Leaf){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLeaf2"), true);
        mat4.translate(mvMatrix,mvMatrix,[2.5,1.5,0.7]);
        setMatrixUniforms();
        drawLeaf();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLeaf2"), false);
        
    }
    if (ready_Trunk){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTrunk2"), true);
        mat4.translate(mvMatrix,mvMatrix,[0,0,-0.75]);
        
        setMatrixUniforms();
        drawTrunk();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTrunk2"), false);
        
    }
    

    //Build Tree three
    if (ready_Leaf){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLeaf3"), true);
        mat4.translate(mvMatrix,mvMatrix,[-0.75,-2.5,0.5]);
        mat4.scale(mvMatrix,mvMatrix,[0.7,0.7,0.7]);
        setMatrixUniforms();
        drawLeaf();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLeaf3"), false);
        
    }
    if (ready_Trunk){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTrunk3"), true);
        mat4.translate(mvMatrix,mvMatrix,[0,0,-0.75]);
        
        setMatrixUniforms();
        drawTrunk();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTrunk3"), false);
        
    }

    //Build Tree Four
    if (ready_Leaf){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLeaf4"), true);
        mat4.translate(mvMatrix,mvMatrix,[3,-5,0.7]);
        setMatrixUniforms();
        drawLeaf();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLeaf4"), false);
        
    }
    if (ready_Trunk){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTrunk4"), true);
        mat4.translate(mvMatrix,mvMatrix,[0,0,-0.75]);
        
        setMatrixUniforms();
        drawTrunk();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTrunk4"), false);
        
    }

    //Build Tree Five
    if (ready_Leaf){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLeaf5"), true);
        mat4.translate(mvMatrix,mvMatrix,[-12,7,0.7]);
        setMatrixUniforms();
        drawLeaf();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLeaf5"), false);
        
    }
    if (ready_Trunk){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTrunk5"), true);
        mat4.translate(mvMatrix,mvMatrix,[0,0,-0.75]);
        
        setMatrixUniforms();
        drawTrunk();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTrunk5"), false);
        
    }
    

    //Build Tree Six
    if (ready_Leaf){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLeaf6"), true);
        mat4.scale(mvMatrix,mvMatrix,[0.7,0.7,0.7]);
        mat4.translate(mvMatrix,mvMatrix,[0.5,-0.5,0.7]);
        setMatrixUniforms();
        drawLeaf();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLeaf6"), false);
        
    }
    if (ready_Trunk){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTrunk6"), true);
        mat4.translate(mvMatrix,mvMatrix,[0,0,-0.75]);
        
        setMatrixUniforms();
        drawTrunk();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTrunk6"), false);
        
    }

    //Build Tree Seven
    if (ready_Leaf){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLeaf7"), true);
        mat4.translate(mvMatrix,mvMatrix,[8,-11,0.7]);
        setMatrixUniforms();
        drawLeaf();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLeaf7"), false);
        
    }
    if (ready_Trunk){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTrunk7"), true);
        mat4.translate(mvMatrix,mvMatrix,[0,0,-0.75]);
        
        setMatrixUniforms();
        drawTrunk();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTrunk7"), false);
        
    }
    
 
    //Build Tree Eight
    if (ready_Leaf){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLeaf8"), true);
        mat4.translate(mvMatrix,mvMatrix,[-1,1,0.7]);
        setMatrixUniforms();
        drawLeaf();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLeaf8"), false);
        
    }
    if (ready_Trunk){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTrunk8"), true);
        mat4.translate(mvMatrix,mvMatrix,[0,0,-0.75]);
        
        setMatrixUniforms();
        drawTrunk();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTrunk8"), false);
        
    }



    //Build Tree Nine
    if (ready_Leaf){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLeaf9"), true);
        mat4.translate(mvMatrix,mvMatrix,[-7,12,0.7]);
        setMatrixUniforms();
        drawLeaf();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLeaf9"), false);
        
    }
    if (ready_Trunk){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTrunk9"), true);
        mat4.translate(mvMatrix,mvMatrix,[0,0,-0.75]);
        setMatrixUniforms();
        drawTrunk();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTrunk9"), false);
        
    }
    
    if (ready_Leaf){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLeaf10"), true);
        mat4.translate(mvMatrix,mvMatrix,[14,9,0.7]);
        setMatrixUniforms();
        drawLeaf();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLeaf10"), false);
        
    }
    if (ready_Trunk){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTrunk10"), true);
        mat4.translate(mvMatrix,mvMatrix,[0,0,-0.75]);
        setMatrixUniforms();
        drawTrunk();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTrunk10"), false);
        
    }
    
    



   
    if (ready_Sun){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsSun"), true);
        mat4.translate(mvMatrix,mvMatrix,[-3.2,-11.3,-1.4]);
        mat4.translate(mvMatrix,mvMatrix,[SunRX,3,SunRZ]);

        setMatrixUniforms();
        drawSun();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsSun"), false);
        
    }
 
    mat4.translate(mvMatrix,mvMatrix,[0,0,0.15]);
    
    if (ready_car_top){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTopCar"), true);
        mat4.translate(mvMatrix,mvMatrix,[-SunRX,-3,-SunRZ])
        mat4.translate(mvMatrix,mvMatrix,[0,0,2]);
        mat4.translate(mvMatrix,mvMatrix,[CarRX,CarRY,0]);
        mat4.rotateZ(mvMatrix,mvMatrix,degToRad(90));
        mat4.rotateZ(mvMatrix,mvMatrix,degToRad(Carangle));
        mat4.scale(mvMatrix,mvMatrix,[4,2,0.8]);
        setMatrixUniforms();
        drawCar();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTopCar"), false);
        
    }
    if (ready_SLight){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsHLight"), true);
        mat4.scale(mvMatrix,mvMatrix,[0.25,0.5,1.25]);
        mat4.scale(mvMatrix,mvMatrix,[1.5,1.5,1.5]);
        mat4.translate(mvMatrix,mvMatrix,[-1.3,0.5,0]);
        setMatrixUniforms();
        drawSLight();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsHLight"), false);
    }
    
    if (ready_SLight){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsHLight"), true);
        mat4.translate(mvMatrix,mvMatrix,[0,-1,0]);
        setMatrixUniforms();
        drawSLight();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsHLight"), false);
    }
    
    mat4.translate(mvMatrix,mvMatrix,[1.3,0.5,0]);
    mat4.scale(mvMatrix,mvMatrix,[1/1.5,1/1.5,1/1.5]);
    mat4.scale(mvMatrix,mvMatrix,[4,2,0.8]);
    
    if (ready_car_top){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTopCar"), true);

        mat4.translate(mvMatrix,mvMatrix,[0.1,0,0.8]);
        mat4.scale(mvMatrix,mvMatrix,[1,1,0.5]);
        mat4.scale(mvMatrix,mvMatrix,[0.4,1,1]);
        setMatrixUniforms();
        drawCar();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTopCar"), false);
    }
    mat4.scale(mvMatrix,mvMatrix,[0.25,0.5,1.125]);
    

    
    
    //Tire one
    
    if (ready_Tire){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTire"), true);
        mat4.scale(mvMatrix,mvMatrix,[3,3,3]);
        mat4.rotateX(mvMatrix,mvMatrix,degToRad(90));
        mat4.translate(mvMatrix,mvMatrix,[-1.8,-0.8,-0.375]);
        mat4.rotateZ(mvMatrix,mvMatrix,degToRad(Tireangle));
        setMatrixUniforms();
        drawTire();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTire"), false);
        
    }
    if (ready_Line){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), true);
        mat4.rotateX(mvMatrix,mvMatrix,degToRad(90));
        setMatrixUniforms();
        drawLine();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), false);
    }
    
    if (ready_Line){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), true);
        mat4.rotateY(mvMatrix,mvMatrix,degToRad(60));
        setMatrixUniforms();
        drawLine();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), false);
    }
    if (ready_Line){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), true);
        mat4.rotateY(mvMatrix,mvMatrix,degToRad(60));
        setMatrixUniforms();
        drawLine();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), false);
    }
    
    if (ready_Tire){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTire"), true);
        mat4.rotateY(mvMatrix,mvMatrix,degToRad(240));
        mat4.rotateX(mvMatrix,mvMatrix,degToRad(270));
        mat4.translate(mvMatrix,mvMatrix,[0,0,0.75]);
        setMatrixUniforms();
        drawTire();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTire"), false);
        
    }
    
    if (ready_Line){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), true);
        mat4.rotateX(mvMatrix,mvMatrix,degToRad(90));
        mat4.translate(mvMatrix,mvMatrix,[0,0,0]);
        setMatrixUniforms();
        drawLine();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), false);
    }
    if (ready_Line){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), true);
        mat4.rotateY(mvMatrix,mvMatrix,degToRad(60));
        setMatrixUniforms();
        drawLine();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), false);
    }
    if (ready_Line){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), true);
        mat4.rotateY(mvMatrix,mvMatrix,degToRad(60));
        setMatrixUniforms();
        drawLine();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), false);
    }
    
    if (ready_Line){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), true);
        mat4.rotateY(mvMatrix,mvMatrix,degToRad(60));
        mat4.rotateX(mvMatrix,mvMatrix,degToRad(90));
        mat4.translate(mvMatrix,mvMatrix,[0,-0.1,0.345]);
        setMatrixUniforms();
        drawLine();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), false);
    }
    
    mat4.translate(mvMatrix,mvMatrix,[0,0.1,-0.345]);
    mat4.rotateX(mvMatrix,mvMatrix,degToRad(-90));
    mat4.rotateY(mvMatrix,mvMatrix,degToRad(-60));
    
    
    if (ready_Tire){
        
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTire"), true);
    
        mat4.rotateY(mvMatrix,mvMatrix,degToRad(240));
        mat4.rotateX(mvMatrix,mvMatrix,degToRad(270));
        mat4.translate(mvMatrix,mvMatrix,[0,0,-0.75]);
        mat4.rotateZ(mvMatrix,mvMatrix,degToRad(-Tireangle));
        mat4.translate(mvMatrix,mvMatrix,[0,0,0.75]);
        mat4.translate(mvMatrix,mvMatrix,[3,0,0]);
        mat4.rotateZ(mvMatrix,mvMatrix,degToRad(Tireangle));
        setMatrixUniforms();
        drawTire();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTire"), false);
        
    }
    if (ready_Line){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), true);
        mat4.rotateX(mvMatrix,mvMatrix,degToRad(90));
        setMatrixUniforms();
        drawLine();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), false);
    }
    if (ready_Line){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), true);
        mat4.rotateY(mvMatrix,mvMatrix,degToRad(60));
        setMatrixUniforms();
        drawLine();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), false);
    }
    if (ready_Line){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), true);
        mat4.rotateY(mvMatrix,mvMatrix,degToRad(60));
        setMatrixUniforms();
        drawLine();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), false);
    }
    


    
    if (ready_Tire){
        
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTire"), true);
        mat4.rotateY(mvMatrix,mvMatrix,degToRad(240));
        mat4.rotateX(mvMatrix,mvMatrix,degToRad(270));
        mat4.translate(mvMatrix,mvMatrix,[0,0,-0.75]);
        setMatrixUniforms();
        drawTire();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsTire"), false);
        
    }
    
    if (ready_Line){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), true);
        mat4.rotateX(mvMatrix,mvMatrix,degToRad(90));
        setMatrixUniforms();
        drawLine();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), false);
    }
    if (ready_Line){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), true);
        mat4.rotateY(mvMatrix,mvMatrix,degToRad(60));
        setMatrixUniforms();
        drawLine();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), false);
    }
    if (ready_Line){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), true);
        mat4.rotateY(mvMatrix,mvMatrix,degToRad(60));
        setMatrixUniforms();
        drawLine();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), false);
    }

    if (ready_Line){
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), true);
        mat4.rotateY(mvMatrix,mvMatrix,degToRad(60));
        mat4.rotateX(mvMatrix,mvMatrix,degToRad(90));
        mat4.translate(mvMatrix,mvMatrix,[0,-0.1,-0.345]);

        setMatrixUniforms();
        drawLine();
        gl.uniform1f(gl.getUniformLocation(shaderProgram, "uIsLine"), false);
    }
    
    mat4.translate(mvMatrix,mvMatrix,[0,0.1,0.345]);
    mat4.rotateX(mvMatrix,mvMatrix,degToRad(-90));
    mat4.rotateY(mvMatrix,mvMatrix,degToRad(-60));

}

function startup() {
    canvas = document.getElementById("myGLCanvas");
    gl = createGLContext(canvas);
    gl.clearColor(0, 0, 0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    setupShaders();
    setupBuffers();

    tick();

}



function tick() {
    requestAnimFrame(tick);
    draw();
    if (document.getElementById("animate").checked){
        animate();}
}

function animate() {
    if (then==0)
    {
        then = Date.now();
    }
    else
    {
        now=Date.now();
        now *= 0.001;
        var deltaTime = now - then;
        then = now;

        SunRX = 13.5 * Math.cos(degToRad(angle));
        SunRZ = 13.5 * Math.sin(degToRad(angle));
        
        CarRX = 8.4 * Math.cos(degToRad(Carangle));
        CarRY = 8.4 * Math.sin(degToRad(Carangle));
        
        
        angle += 0.4;
        Tireangle += 3.2;
        
        Carangle += -0.8;

        
    }
}










