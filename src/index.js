import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, Mesh, TransformNode, SceneLoader } from '@babylonjs/core';
import { glTF } from '@babylonjs/loaders';
import * as GUI from '@babylonjs/gui';

//import assets
import latteModel from "../assets/Latte.glb";

// Get the canvas DOM element
const canvas = document.getElementById('renderCanvas');
canvas.classList.add('WidthHeightFull');

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