import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, Mesh, TransformNode, SceneLoader } from '@babylonjs/core';
import { glTF } from '@babylonjs/loaders';
import * as GUI from '@babylonjs/gui';

//import assets
import latteModel from "../assets/Latte.glb";

// Get the canvas DOM element
const canvas = document.getElementById('renderCanvas');
canvas.classList.add('WidthHeightFull');

//TODO : GROQ url query https://tzv81qob.api.sanity.io/v1/data/query/production?query=*%5B_type%20%3D%3D%20'movie'%5D%20
// If receiving CORS error from Sanity - add dev hosted url to sanity with CLI e.g: Sanity cors add http://localhost:8080/
async function testRequestCall(url) {
    return await fetch(url);
}

async function testGROQ() {
    testRequestCall("https://tzv81qob.api.sanity.io/v1/data/query/production?query=*%5B_type%20%3D%3D%20'movie'%5D%20")
        .then(result => console.log(result));
}

// 3D UI
// https://playground.babylonjs.com/#8Y780Y#20
function create3DUI() {
    var manager = new GUI.GUI3DManager(scene);
    var anchor = new TransformNode("");

    var panel = new GUI.CylinderPanel();
    panel.margin = 0.2;

    manager.addControl(panel);
    panel.linkToTransformNode(anchor);
    panel.position.z = -1.5;

    var addButton = function () {
        var button = new GUI.HolographicButton("orientation");
        panel.addControl(button);
        button.text = "Button #" + panel.children.length;
    }

    panel.blockLayout = true;
    for (var index = 0; index < 60; index++) {
        addButton();    
    }
    panel.blockLayout = false;
}

// 2D UI
function create2DUI() {
    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var button1 = GUI.Button.CreateSimpleButton("but1", "Click Me");
    
    //Design
    button1.width = "150px"
    button1.height = "40px";
    button1.color = "white";
    button1.cornerRadius = 20;
    button1.background = "green";
    //position
    button1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    button1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    //events
    button1.onPointerDownObservable.add(() => {
        //testGROQ();
        //LoadedModel.scaling.scaleInPlace(LoadedModel.scaling);
    });
    button1.onPointerEnterObservable.add(function() {
        button1.color = "red";
    });
    button1.onPointerOutObservable.add(function() {
        button1.color = "white";
    });

    advancedTexture.addControl(button1);   
}

async function importModel(scene, model) {

    const importResult = await SceneLoader.ImportMeshAsync("", "", model, scene, undefined, ".glb");
    var loadedModel = importResult.meshes[0];
    loadedModel.scaling.scaleInPlace(0.5);
}

var engine = new Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
var createScene = function(){

    var scene = new Scene(engine);

    var camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, false);
    
    const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
    const ground = Mesh.CreateGround('ground1', 6, 6, 2, scene, false);

    importModel(scene, latteModel);

    return scene;
}

var scene = createScene();

engine.runRenderLoop(function(){
    scene.render();
});

window.addEventListener('resize', function(){
    engine.resize();
});