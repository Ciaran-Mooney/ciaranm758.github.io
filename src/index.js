import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, AssetsManager, PBRMaterial } from '@babylonjs/core';
import * as _ from '@babylonjs/loaders';

//import assets
import model from "../assets/model.obj";

// Get the canvas DOM element
const canvas = document.getElementById('renderCanvas');
canvas.classList.add('WidthHeightFull');

var engine = new Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
var createScene = function() {

    const scene = new Scene(engine);
    
    const rotateCamera = new ArcRotateCamera('rotateCamera', 0, 0, 10, new Vector3(0, 2, -10), scene);
    rotateCamera.setTarget(new Vector3(0, 1, 0));
    rotateCamera.attachControl(canvas, false);
    rotateCamera.useFramingBehavior = true;
    
    const light = new HemisphericLight('light1', new Vector3(0, 8, 0), scene);

    const assetsManager = new AssetsManager(scene);
    let modelTask = assetsManager.addMeshTask('modelTask', "", model);
    modelTask.onSuccess = (task) => {
        let targetMesh = Mesh.MergeMeshes(task.loadedMeshes);
        rotateCamera.setTarget(targetMesh);
    };
    
    assetsManager.load();
    return scene;
}

var scene = createScene();

engine.runRenderLoop(function(){
    scene.render();
});

window.addEventListener('resize', function(){
    engine.resize();
});