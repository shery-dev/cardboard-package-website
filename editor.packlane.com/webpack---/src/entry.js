// import ShadowOnlyMaterial from 'babylonjs-materials';
import jQuery from "jquery";
import earcut from "earcut";
import { PanelSelector } from "./panel_selector";

const $ = jQuery;
// BABYLON.Tools.BaseUrl = texturesUrl;

var last_picked_mesh = '';
var onPointerMove = function (e) {
    if (typeof pdp_widget != 'undefined' && pdp_widget) return;

    var result = window.scene.pick(window.scene.pointerX, window.scene.pointerY, null, null, window.scene.activeCamera);
    if (result.hit) {
        if (result.pickedMesh.name != last_picked_mesh) {
            window.top.postMessage({ "three_d_hover": result.pickedMesh.name });
            last_picked_mesh = result.pickedMesh.name;
            
        }
        PanelSelector.highlightPanel(result.pickedMesh);
    } else {
        PanelSelector.removeMeshHighlight();
        if(last_picked_mesh) {
            window.top.postMessage({ "three_d_hover": 'ground' });
            last_picked_mesh = '';
        }
    }
};
document.getElementById("renderCanvas").addEventListener("mousemove", onPointerMove, false);

var onPointerClick = function (e) {
    var result = window.scene.pick(window.scene.pointerX, window.scene.pointerY, null, null, window.scene.activeCamera);
    if (result.hit && Engine3DVariables.meshes.hasOwnProperty(result.pickedMesh.name)) {
        console.log(result.pickedMesh.name);
    }
}
document.getElementById("renderCanvas").addEventListener("click", onPointerClick, false);


$(window).on("blur",()=>{
    PanelSelector.removeMeshHighlight();
});

! (function( $ ) {
    var PDWGL = $.printqDetectWebGL = () => {
    };
    $.extend( PDWGL, {
        defaults    : {
            canvas : '#renderCanvas',
        },
        _O          : function( o ) {
            return $.extend( {}, PDWGL.defaults, o );
        },
        init        : () => {
            var o = PDWGL._O( o );
            if ( ! PDWGL.detectWebGl( o ) ) {
                return false;
            }
            return true;
        },
        detectWebGl : function( options ) {
            var o = PDWGL._O( options );
            var canvas = $( o.canvas );
            if ( ! ! WebGLRenderingContext ) {
                if ( canvas.length ) {
                    canvas = canvas.get( 0 );
                    try {
                        return ! ! WebGLRenderingContext && (
                                canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ));
                    } catch ( e ) {
                        return false;
                    }
                }
            }
            return false;
        }
    } );
})( jQuery );

var webGlEnabled = jQuery.printqDetectWebGL.init();
if ( webGlEnabled ) {
    var _scene;

    var animation_running = 0;
    var animation_sequence_active = false;
    var onMessageStorage = [];
    var loaded = false;


    // Building variables
    var meshesParents = [];
    var curves_count = 0;
    var axisPoints = []
    var puncte_finale_sus = [];
    var puncte_finale_jos = [];
    var puncte_finale_sides = [];
    var name_array = [];
    var curve_parent = [];
    var uvsCurve = [];
    var toBuild_no_y = [];
    var min_x = 99999;
    var min_y = 99999;
    var max_x = - 99999;
    var max_y = - 99999;

    var model_min_y = 99999;
    var model_max_y = - 99999;
    var model_min_x = 99999;
    var model_max_x = - 99999;

    
    var points = [];
    var prevPoints = [];
    var curvePoints = [];
    var sideMeshes = [];


    // Materials
    var CartonMaterial;
    var FaceMaterial;
    var BackMaterial;


    // Model config
    var STANDARD_MODEL = false;
    var thickness = parseFloat( Engine3DVariables.thickness );  // get thickness

    // Model optimize
    var curveSides = [];


    // Camera config
    var arcCamera;
    var old_max_x = 0;
    var old_max_y = 0;
    var old_min_x = 0;
    var old_min_y = 0;
    var tmp = 1;
    var buffer = null;
    var posAnimation_running = 0;
    var cachedModelData = null;
    var disableRotation = false;
    var onload_radius = null;
    var height_multiplier = 3;
    var width_multiplier = 4.5;
    var max_zoom_out_multiplier = 4;

    Math.easeInOutQuad = ( t, b, c, d ) => {
        t /= d / 2;
        if ( t < 1 ) return c / 2 * t * t + b;
        t --;
        return - c / 2 * (t * (t - 2) - 1) + b;
    };


    var BabylonModel = function( canvas, model ) {
        this.model = model;
        this.engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

        // Resize window event
        var _this = this;

        window.addEventListener( "resize", function() {
            if (!_this) return;
            _this.engine.resize();
            _this.updateWheelPrecision();
        } );

        var loadingScreen = new MyLoadingScreen( "I'm loading!!" );
        //Set the loading screen in the engine to replace the default one
        this.engine.loadingScreen = loadingScreen;

        return this;
    };

    BabylonModel.prototype.testHardwareScaling = function(scene) {
        let engine = scene.getEngine();
        //Nth times better image resolution
        let scale_level_array = {
            60: 1 / 4, 
            48: 1 / 3, 
            30: 1 / 2,
            // Enhance quality on supported hardware (should be dynamic in the viewer)
            24: Math.max(0.5, 1 / (window.devicePixelRatio || 2))
        };

        let frame_count = 1, 
            total_fps = engine.getFps();
        let prev_allowed_fps = total_fps;
        let test_count = 0;

        //set as 4 times better image resolution
        engine.setHardwareScalingLevel(scale_level_array['60']);
        scene.registerAfterRender(() => {
            total_fps += engine.getFps();
            frame_count += 1;
        });
        let interval_id = setInterval(() => {
            let avg_fps = total_fps / frame_count;
            // sort from higher to lower
            let keys = Object.keys(scale_level_array).sort((a,b) => b - a);
            let is_fps_stabled = avg_fps >= parseFloat(prev_allowed_fps);
            
            if (is_fps_stabled || test_count >= 3) {//maximum 3 test
                clearInterval(interval_id);
            }

            for (var allowed_fps of keys) {
                if (avg_fps >= allowed_fps) {
                    let level = scale_level_array[allowed_fps];
                    engine.setHardwareScalingLevel(level);
                    prev_allowed_fps = allowed_fps;
                    break;
                }
            }

            test_count += 1;
        }, 2000); //test every 2 sec
    }

    BabylonModel.prototype.startScene = function( cb ) {
        this.model.data = this.model.close_data;
        BABYLON.SceneLoader.Load( texturesUrl, 'data:' + this.model.data, this.engine, ( scene ) => {
            this.scene = scene;
            window.scene = scene;
            _scene = scene;
            setTimeout(function(){
                _scene.multiMaterials = [];
                _scene.meshes = [];
                points = Engine3DVariables.pointsOnly;
                prevPoints = points;
                createMyMaterials();

                if ( STANDARD_MODEL == true ) {
                    createMeshesStandard();
                    createMeshesCopyStandard();
                    createSidesStandard();
                    createParentsStandard();
                    createPivotAxisStandard();
                    cb();
                }
                else if ( STANDARD_MODEL == false ) {
                    createAxisPointsAdvanced();
                    createMeshesAdvanced();
                    createMeshesCopyAdvanced();
                    createCurveAdvanced();
                    createParentsAdvanced();
                    createPivotAxisAdvanced();
                    createSidesAdvanced();
                    cb();
                }

                if (Engine3DVariables.enableMeasurementGuides) {
                    drawMeasurementGuides();
                }
            }, 1000);

            //add texture to mug
            for ( var index in _scene.meshes ) {
                if ( _scene.meshes[index].name == "Extra" ) {
                    for ( var matindex in _scene.materials ) {
                        if ( _scene.meshes[index].material.id == _scene.materials[matindex].id ) {
                            _scene.materials[matindex].diffuseTexture = new BABYLON.Texture( texturesUrl + "logo.png", _scene );
                        }
                    }
                }
            }

            scene.executeWhenReady( () => {
                this.engine.runRenderLoop( () => {
                    this.scene.render();
                });
            });
        });
    };

    BabylonModel.prototype.initScene = function(init_camera_cb) {
        this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

        this.initCamera(init_camera_cb);
        this.initLights();

    };

    BabylonModel.prototype.initGlassMat = function( meshName ) {

        for ( var index in this.scene.meshes ) {
            if ( this.scene.meshes[index].name == meshName ) {
                var hdrTexture = new BABYLON.HDRCubeTexture( "white.hdr", this.scene, 128 );
                var glass = new BABYLON.PBRMaterial( "glass", this.scene );
                glass.reflectionTexture = hdrTexture;
                glass.indexOfRefraction = 0.52;
                glass.alpha = 0.5;
                glass.directIntensity = 0.0;
                glass.environmentIntensity = 0.7;
                glass.cameraExposure = 1.66;
                glass.cameraContrast = 1.66;
                glass.microSurface = 1;
                glass.reflectivityColor = new BABYLON.Color3( 0.2, 0.2, 0.2 );
                glass.albedoColor = new BABYLON.Color3( 0.95, 0.95, 0.95 );
                this.scene.meshes[index].material = glass;
            }
        }
    }

    BabylonModel.prototype.initCamera = function (cb) {
        arcCamera = new BABYLON.ArcRotateCamera( "ArcRotateCamera", 0, 0, 0, new BABYLON.Vector3( 0, 0, 0 ), this.scene );
        arcCamera.setPosition( this.scene.activeCamera.position );
        
        const animationStage = 0;

        model.babylon.multiSequenceAnimation((animationStage * 1), (animationStage * 1), model.animValues, { noAnimation: 1 });
        
        this.scene.onAfterRenderObservable.addOnce(async () => {
            model.babylon.engine.flushFramebuffer();

            for (var i in Engine3DVariables.meshNames) {
                let mesh = scene.getMeshByName(Engine3DVariables.meshNames[i]);
                let minimumBoundingBox = mesh.getBoundingInfo().boundingBox.minimumWorld;
                if (minimumBoundingBox.y <= model_min_y) {
                    model_min_y = minimumBoundingBox.y;
                }
                if (minimumBoundingBox.x <= model_min_x) {
                    model_min_x = minimumBoundingBox.x;
                }

                let maximumBoundingBox = mesh.getBoundingInfo().boundingBox.maximumWorld;
                if (maximumBoundingBox.y >= model_max_y) {
                    model_max_y = maximumBoundingBox.y;
                }
                if (maximumBoundingBox.x >= model_max_x) {
                    model_max_x = maximumBoundingBox.x;
                }
            }

            var model_width = model_max_x - model_min_x;
            var model_height = model_max_y - model_min_y;

            if (model_height * height_multiplier > model_width * width_multiplier) {
                onload_radius = arcCamera.radius = model_height * height_multiplier;
            } else {
                onload_radius = arcCamera.radius = model_width * width_multiplier;
            }

            if (typeof pdp_widget != 'undefined' && pdp_widget) {
                onload_radius /= 1.30;
                arcCamera.radius = onload_radius;
            }

            if (model_min_x > model_min_y) {
                arcCamera.lowerRadiusLimit = model_width * width_multiplier;
            }
            else if (model_min_x <= model_min_y) {
                arcCamera.lowerRadiusLimit = model_height * height_multiplier;
            }

            for (var name in Engine3DVariables.meshes) {
                if (name == Engine3DVariables.cameraSettings.cameraCenter) {
                    buffer = name;
                    break;
                }
            }

            for (var i = 0; i < name_array.length; i++) {
                if (buffer == name_array[i]) {
                    buffer = i;
                    break;
                }
            }

            if (Engine3DVariables.cameraSettings.cameraCenter.length > 0) {
                var local_x = _scene.meshes[buffer].getBoundingInfo().boundingBox.minimumWorld.x;
                var local_y = _scene.meshes[buffer].getBoundingInfo().boundingBox.minimumWorld.y;
                var local_z = _scene.meshes[buffer].getBoundingInfo().boundingBox.minimumWorld.z;

                var global_x = _scene.meshes[buffer].getBoundingInfo().boundingBox.maximumWorld.x;
                var global_y = _scene.meshes[buffer].getBoundingInfo().boundingBox.maximumWorld.y;
                var global_z = _scene.meshes[buffer].getBoundingInfo().boundingBox.maximumWorld.z;
                arcCamera.target.x = (local_x + global_x) / 2;
                var heightAdjust = (model_max_y - model_min_y) / 2;
                arcCamera.target.y = ((local_y + global_y) / 2) + heightAdjust;
                arcCamera.target.z = (local_z + global_z) / 2;

            }
            else if (Engine3DVariables.cameraSettings.cameraCenter.length == 0) {

                arcCamera.target.x = eval(Engine3DVariables.cameraSettings.cameraTargetAdj.x);
                arcCamera.target.y = eval(Engine3DVariables.cameraSettings.cameraTargetAdj.y);
                arcCamera.target.z = eval(Engine3DVariables.cameraSettings.cameraTargetAdj.z);
            }
            // THIS OVERRIDES CAMERA POSITION BASED ON CONFIG. CAMERA POSITION IS NOW COMPUTED DYNAMICALLY BASED ON BOX DIMENSIONS
            if ( typeof Engine3DVariables.cameraSettings.cameraPosition != "undefined" ) {
                arcCamera.position.z *= Engine3DVariables.cameraSettings.reverse ? -1 : 1;
                let tempRadius = arcCamera.radius; //preserve radius
                var poz = new BABYLON.Vector3(Engine3DVariables.cameraSettings.cameraPosition.x, Engine3DVariables.cameraSettings.cameraPosition.y, arcCamera.position.z);
                arcCamera.setPosition(poz);
                arcCamera.radius = tempRadius;
            }
            
            arcCamera.attachControl(this.engine.getRenderingCanvas(), false);
            this.scene.activeCamera = arcCamera;

            for (var index in _scene.meshes) {
                if (_scene.meshes[index].name == "Extra") {
                    MugPosition = new BABYLON.Vector3(x, 2, z);
                    _scene.meshes[index].position = MugPosition;
                }
            }

            arcCamera.panningSensibility = 0;
            this.updateWheelPrecision();

            var rot_state = { x: arcCamera.alpha, y: arcCamera.beta };
            this.scene.registerBeforeRender(function () {
                if (disableRotation) {
                    arcCamera.alpha = rot_state.x;
                    arcCamera.beta = rot_state.y;
                }
            })

            cb();

            PanelSelector.initPanelSelector(model);
            let light = scene.getLightByID("Hemi1");
            if (light) {
                let target = getCameraTarget();
                light.position = new BABYLON.Vector3( target.x, -50, target.z );
            }
        });
    };

    BabylonModel.prototype.updateWheelPrecision = function() {
        if (!arcCamera) return;
        arcCamera.wheelPrecision = Math.min(Math.max(getSlope(
            {x: 0, y: 0},
            {x: window.innerHeight, y: window.innerWidth}
        ), 0.1), 0.8);
    }

    BabylonModel.prototype.initLights = function() {
        var ground = BABYLON.Mesh.CreatePlane( 'ground', 6000, this.scene );
        ground.rotation.x = Math.PI / 2;
        ground.material = new BABYLON.ShadowOnlyMaterial( 'mat', this.scene );

        ground.position.y = eval( Engine3DVariables.cameraSettings.ground );
        for ( var meshName in Engine3DVariables.meshes ) {
            if ( typeof Engine3DVariables.meshes[meshName].ground !== 'undefined' ) {
                ground.position.y = Engine3DVariables.meshes[meshName].ground;
            }
        }

        this.scene.lights = [];

        var light = new BABYLON.DirectionalLight( "dir01", new BABYLON.Vector3( - 100, - 200, - 100 ), this.scene );
        light.position = new BABYLON.Vector3( 1200, 1400, 1200 );
        light.intensity = 0.8;


        var light2 = new BABYLON.DirectionalLight( "dir02", new BABYLON.Vector3( 100, 200, 100 ), this.scene );
        var light3 = new BABYLON.HemisphericLight( "Hemi0", new BABYLON.Vector3( 100, 200, 100 ), this.scene );
        // light position will be override after updateCamera
        var light4 = new BABYLON.HemisphericLight( "Hemi1", new BABYLON.Vector3( 341.31255, -50, 504.825 ), this.scene );
        light2.position = new BABYLON.Vector3( - 200, - 400, - 200 );
        light3.position = new BABYLON.Vector3( 200, - 400, - 200 );
        light4.intensity = 0.2;

        light2.intensity = 0.8;
        light3.intensity = 2;
        light2.excludedMeshes = [ground];
        light3.excludedMeshes = [ground];
        light4.excludedMeshes = [ground];


        var shadowGenerator = new BABYLON.ShadowGenerator( 1024, light );
        shadowGenerator.useBlurVarianceShadowMap = true;
        shadowGenerator.blurScale = 2;
        shadowGenerator.setDarkness( 0.95 );
        this.scene.meshes.forEach( function( mesh ) {
            if ( mesh.name != "ground" ) {
                mesh.receiveShadows = false;
                shadowGenerator.getShadowMap().renderList.push( mesh );
            }
        } );
        ground.receiveShadows = true;

    };

    BabylonModel.prototype.animation = function( stage, animValues, params ) {
        _scene = this.scene;
        var reverse = 0;
        var noAnimation = 0;
        if ( typeof (params) != 'undefined' ) {
            if ( params.hasOwnProperty( 'reverse' ) )
                reverse = params.reverse;
            if ( params.hasOwnProperty( 'noAnimation' ) )
                noAnimation = params.noAnimation;
        }
        var list = new Array();
        var positionList = new Array();
        if ( ! reverse ) {
            var currentList = animValues[stage];
            if ( typeof animValues[stage - 1] != "undefined" ) {
                var previousList = animValues[stage - 1];
            }
            for ( var step in currentList ) {
                for ( var meshName in currentList[step]['Rotation'] ) {
                    if ( typeof (currentList[step]['Rotation'][meshName]) != 'undefined' || typeof (currentList[step]['Rotation'][meshName]['end']) != 'undefined' ) {
                        //rotation
                        if ( step == 0 ) {
                            if ( typeof previousList == "undefined" ) {
                                var startAng = "0";
                            }
                            else {
                                var startAng = previousList[previousList.length - 1]['Rotation'][meshName]['end'];
                            }
                            var obj = {
                                meshName   : meshName,
                                startAngle : startAng,
                                endAngle   : currentList[step]['Rotation'][meshName]['end']
                            };
                        }
                        else {
                            var obj = {
                                meshName   : meshName,
                                startAngle : currentList[step - 1]['Rotation'][meshName]['end'],
                                endAngle   : currentList[step]['Rotation'][meshName]['end']
                            };
                        }
                        if ( noAnimation ) {
                            obj['noAnimation'] = 1;
                        }
                        if ( typeof list[step] == 'undefined' ) {
                            list[step] = [];
                            list[step]['rotation'] = new Array();
                        }
                        list[step]['rotation'].push( obj );
                    }
                }
                for ( var meshName in currentList[step]['Position'] ) {
                    if ( typeof (currentList[step]['Position'][meshName]) != 'undefined' || typeof (currentList[step]['Position'][meshName]['position']) != 'undefined' ) {
                        if ( step == 0 ) {
                            if ( typeof previousList == "undefined" ) {
                                var startPos = animValues[0][0]['Position'][meshName];
                            }
                            else {
                                var startPos = previousList[previousList.length - 1]["Position"][meshName];
                            }
                            var obj = {
                                meshName      : meshName,
                                startPosition : startPos,
                                endPos        : currentList[step]["Position"][meshName]
                            };

                        }
                        else {
                            var obj = {
                                meshName      : meshName,
                                startPosition : currentList[step - 1]['Position'][meshName],
                                endPos        : currentList[step]['Position'][meshName]
                            };
                        }
                        if ( noAnimation ) {
                            obj['noAnimation'] = 1;
                        }
                        if ( typeof positionList[step] == 'undefined' ) {
                            positionList[step] = [];
                            positionList[step]['position'] = new Array();
                        }
                        positionList[step]['position'].push( obj );
                    }
                }
            }
        }
        else {
            var previousList = animValues[stage];
            var currentList = animValues[stage + 1];
            var end = currentList.length - 2; //start from step-1
            for ( var step = end; step >= 0; step -- ) {
                for ( var meshName in currentList[step]['Rotation'] ) {
                    var obj = {
                        meshName   : meshName,
                        startAngle : currentList[step + 1]['Rotation'][meshName]['end'],
                        endAngle   : currentList[step]["Rotation"][meshName]["end"]
                    };
                    if ( noAnimation ) {
                        obj['noAnimation'] = 1;
                    }
                    if ( typeof list[step + 1] === 'undefined' ) {
                        list[step + 1] = [];
                        list[step + 1]['rotation'] = new Array();
                    }
                    list[step + 1]['rotation'].push( obj );
                }
                for ( var meshName in currentList[step]["Position"] ) {
                    var obj = {
                        meshName      : meshName,
                        startPosition : currentList[step + 1]['Position'][meshName],
                        endPos        : currentList[step]["Position"][meshName]
                    };
                    if ( noAnimation ) {
                        obj['noAnimation'] = 1;
                    }
                    if ( typeof positionList[step + 1] === 'undefined' ) {
                        positionList[step + 1] = [];
                        positionList[step + 1]['position'] = new Array();
                    }
                    positionList[step + 1]['position'].push( obj );
                }
            }
            //add step to previous stage
            for ( meshName in previousList[previousList.length - 1]["Rotation"] ) {
                obj = {
                    meshName   : meshName,
                    startAngle : currentList[0]["Rotation"][meshName]["end"],
                    endAngle   : previousList[previousList.length - 1]['Rotation'][meshName]['end']
                }
                if ( noAnimation ) {
                    obj['noAnimation'] = 1;
                }
                if ( typeof list[0] == 'undefined' ) {
                    list[0] = [];
                    list[0]['rotation'] = new Array();
                }
                list[0]['rotation'].push( obj );
            }
            for ( meshName in previousList[previousList.length - 1]["Position"] ) {
                obj = {
                    meshName      : meshName,
                    startPosition : currentList[0]["Position"][meshName],
                    endPos        : previousList[previousList.length - 1]['Position'][meshName]
                }
                if ( noAnimation ) {
                    obj['noAnimation'] = 1;
                }
                if ( typeof positionList[0] == 'undefined' ) {
                    positionList[0] = [];
                    positionList[0]['position'] = new Array();
                }
                positionList[0]['position'].push( obj );
            }
        }

        var deactivateButtons = function() {
            if ( ! animation_running && ! posAnimation_running ) {
                $( '.animation-button' ).css( {'pointerEvents' : 'auto'} );
            }
        };

        var animateMesh = function( meshData, noAnimation, stop ) {
            animation_running = 1;
            var mesh = scene.getMeshByName( meshData['meshName'] );
            var axis = new BABYLON.Vector3( Engine3DVariables.meshes[mesh.name].axis.quaternion[0], Engine3DVariables.meshes[mesh.name].axis.quaternion[1], Engine3DVariables.meshes[mesh.name].axis.quaternion[2] );
            var sA = eval( meshData['startAngle'] );
            var eA = eval( meshData['endAngle'] );
            var c = eA - sA;
            var fps = 50;
            var t = 0;
            var b = sA;
            if ( noAnimation ) {
                mesh.rotationQuaternion = new BABYLON.Quaternion.RotationAxis( axis, eA );
                animation_running = 0;
                if ( stop ) {
                    animateListStage( list.shift(), noAnimation );
                }
            }
            else {
                var timeframe = 60 / fps * 10;
                var d = 500;

                var frame = setInterval( (function( noAnimation ) {
                    return function() {
                        $( '.animation-button' ).css( {'pointerEvents' : 'none'} );
                        animationTimer( noAnimation )
                    }
                })( noAnimation ), timeframe, t, b, c, d, stop );
            }

            function animationTimer ( noAnimation ) {
                if ( t > d ) {
                    stopAnimation( noAnimation );
                }
                else {
                    step = Math.easeInOutQuad( t, b, c, d );
                    mesh.rotationQuaternion = new BABYLON.Quaternion.RotationAxis( axis, step );
                    t += timeframe;
                }
            }

            function stopAnimation ( noAnimation ) {
                clearInterval( frame );
                animation_running = 0;
                deactivateButtons();
                if ( typeof (stop) != 'undefined' ) {
                    if ( stop ) {
                        animateListStage( list.shift(), noAnimation );
                    }
                }
            }
        };

        var animatePosition = function( meshData, noAnimation, stop ) {
            animation_running = 1;
            posAnimation_running = 1;
            scene.meshes.forEach( function( mesh ) {
                if ( meshData['meshName'] == mesh.name ) {
                    // t=current time
                    // b=start value
                    // c=change in value
                    // d=duration
                    var c = new Array();
                    var b = new Array();
                    b.x = parseFloat( meshData['startPosition']['x'] );
                    b.y = parseFloat( meshData['startPosition']['y'] );
                    b.z = parseFloat( meshData['startPosition']['z'] );
                    c.x = parseFloat( meshData['endPos']['x'] ) - b.x;
                    c.y = parseFloat( meshData['endPos']['y'] ) - b.y;
                    c.z = parseFloat( meshData['endPos']['z'] ) - b.z;
                    var fps = 50;
                    var t = 0;
                    if ( (meshData.hasOwnProperty( 'noAnimation' ) && meshData['noAnimation']) || noAnimation ) {
                        mesh.position.x = parseFloat( meshData['endPos']['x'] );
                        mesh.position.y = parseFloat( meshData['endPos']['y'] );
                        mesh.position.z = parseFloat( meshData['endPos']['z'] );
                        animation_running = 0;
                        posAnimation_running = 0;
                        if ( stop ) {
                            animatePositionStage( positionList.shift(), noAnimation );
                        }

                    }
                    else {
                        var timeframe = 60 / fps * 10;
                        var d = 500;
                        var frame = setInterval( (function( noAnimation ) {
                            return function() {
                                $( '.animation-button' ).css( {'pointerEvents' : 'none'} );
                                animationPositionTimer( noAnimation )
                            }
                        })( noAnimation ), timeframe, t, meshData, d, stop );
                    }

                    function animationPositionTimer ( noAnimation ) {
                        if ( t > d ) {
                            stopPositionAnimation( noAnimation );
                        }
                        else {
                            c = new Array();
                            b = new Array();
                            b.x = parseFloat( meshData['startPosition']['x'] );
                            b.y = parseFloat( meshData['startPosition']['y'] );
                            b.z = parseFloat( meshData['startPosition']['z'] );
                            c.x = parseFloat( meshData['endPos']['x'] ) - b.x;
                            c.y = parseFloat( meshData['endPos']['y'] ) - b.y;
                            c.z = parseFloat( meshData['endPos']['z'] ) - b.z;
                            mesh.position.x = Math.easeInOutQuad( t, b.x, c.x, d );
                            mesh.position.y = Math.easeInOutQuad( t, b.y, c.y, d );
                            mesh.position.z = Math.easeInOutQuad( t, b.z, c.z, d );
                            t += timeframe;
                        }
                    }

                    function stopPositionAnimation ( noAnimation ) {
                        clearInterval( frame );
                        animation_running = 0;
                        posAnimation_running = 0;
                        deactivateButtons();
                        if ( typeof (stop) != 'undefined' ) {
                            if ( stop ) {
                                animatePositionStage( positionList.shift(), noAnimation );
                            }
                        }
                    }
                }
            });
        };

        var animateListStage = function( listStage, noAnimation ) {
            if ( typeof listStage != 'undefined' ) {
                var k = 0;
                for ( var index in listStage['rotation'] ) {
                    k ++;
                    if ( k == listStage['rotation'].length )
                        animateMesh( listStage['rotation'][index], noAnimation, 1 );
                    else
                        animateMesh( listStage['rotation'][index], noAnimation, 0 );
                }
            }
        };

        var animatePositionStage = function( positionStage, noAnimation ) {
            if ( typeof positionStage !== 'undefined' ) {
                var k = 0;
                for ( var index in positionStage['position'] ) {
                    k ++;
                    if ( k == positionStage['position'].length )
                        animatePosition( positionStage['position'][index], noAnimation, 1 );
                    else
                        animatePosition( positionStage['position'][index], noAnimation, 0 );
                }
            }
        };

        var toAnimate = true;

        if ( reverse ) {
            list = list.reverse();
            positionList = positionList.reverse();
        }

        animateListStage( list.shift(), noAnimation );
        if ( positionList.length && toAnimate ) {
            animatePositionStage( positionList.shift(), noAnimation );
        }


    };

    BabylonModel.prototype.multiSequenceAnimation = function (stage, endStage, animValues, params) {
        if (Engine3DVariables.enableMeasurementGuides && open_animation_stage < endStage) {
            disableMeasurementGuides();
        }
        var reverse = stage > endStage;
        var noAnimation = 0;
        if (typeof (params) != 'undefined') {
            if (params.hasOwnProperty('noAnimation'))
                noAnimation = params.noAnimation;
        }

        _scene = this.scene;
        var list = new Array();
        var positionList = new Array();
        var callStopAnimation = false;
        var animationTimeoutArray = [];

        var deactivateButtons = function () {
            if (!animation_running && !posAnimation_running) {
                $('.animation-button').css({ 'pointerEvents': 'auto' });
            }
        };
        
        var animateMesh = function (meshData, noAnimation, stop) {
            animation_running = 1;
            var mesh = scene.getMeshByName(meshData['meshName']);
            var axis = new BABYLON.Vector3(Engine3DVariables.meshes[mesh.name].axis.quaternion[0], Engine3DVariables.meshes[mesh.name].axis.quaternion[1], Engine3DVariables.meshes[mesh.name].axis.quaternion[2]);
            var sA = eval(meshData['startAngle']);
            var eA = eval(meshData['endAngle']);
            var c = eA - sA;
            var fps = 50;
            var t = 0;
            var b = sA;
            if (noAnimation) {
                mesh.rotationQuaternion = new BABYLON.Quaternion.RotationAxis(axis, eA);
                animation_running = 0;
                if (stop) {
                    animateListStage(list.shift(), noAnimation);
                }
            }
            else {
                var timeframe = 60 / fps * 10;
                var d = window.animationDuration ? window.animationDuration : 400;
                
                var frame = setInterval((function (noAnimation) {
                    return function () {
                        $('.animation-button').css({ 'pointerEvents': 'none' });
                        animationTimer(noAnimation);
                        PanelSelector.removeMeshHighlight();
                        PanelSelector.removeMeshOutline();
                    }
                })(noAnimation), timeframe, t, b, c, d, stop);
                if(callStopAnimation){
                    clearInterval(frame);
                    stopAnimation(noAnimation);
                }
            }

            function animationTimer(noAnimation) {
                if (t > d) {
                    stopAnimation(noAnimation);
                }
                else {
                    var step = Math.easeInOutQuad(t, b, c, d);
                    mesh.rotationQuaternion = new BABYLON.Quaternion.RotationAxis(axis, step);
                    t += timeframe;
                }
            }

            function stopAnimation(noAnimation) {
                clearInterval(frame);
                animation_running = 0;
                deactivateButtons();
                if (typeof (stop) != 'undefined') {
                    if (stop) {
                        animateListStage(list.shift(), noAnimation);
                    }
                }
            }
        };

        async function stopAnimation () {
            return new Promise((resolve) => {
                for(var id of animationTimeoutArray){
                    clearTimeout(id);
                }
                animationTimeoutArray = [];
                callStopAnimation = true;
                setTimeout(resolve, window.animationDuration || 400);
            });
        }

        window.stopPanelAnimation = stopAnimation;

        var animatePosition = function (meshData, noAnimation, stop) {
            animation_running = 1;
            posAnimation_running = 1;
            scene.meshes.forEach(function (mesh) {
                if (meshData['meshName'] == mesh.name) {
                    var c = new Array();
                    var b = new Array();
                    b.x = parseFloat(meshData['startPosition']['x']);
                    b.y = parseFloat(meshData['startPosition']['y']);
                    b.z = parseFloat(meshData['startPosition']['z']);
                    c.x = parseFloat(meshData['endPos']['x']) - b.x;
                    c.y = parseFloat(meshData['endPos']['y']) - b.y;
                    c.z = parseFloat(meshData['endPos']['z']) - b.z;
                    var fps = 50;
                    var t = 0;
                    if ((meshData.hasOwnProperty('noAnimation') && meshData['noAnimation']) || noAnimation) {
                        mesh.position.x = parseFloat(meshData['endPos']['x']);
                        mesh.position.y = parseFloat(meshData['endPos']['y']);
                        mesh.position.z = parseFloat(meshData['endPos']['z']);
                        animation_running = 0;
                        posAnimation_running = 0;
                        if (stop) {
                            animatePositionStage(positionList.shift(), noAnimation);
                        }

                    }
                    else {
                        var timeframe = 60 / fps * 10;
                        var d = 500;
                        var frame = setInterval((function (noAnimation) {
                            return function () {
                                $('.animation-button').css({ 'pointerEvents': 'none' });
                                animationPositionTimer(noAnimation)
                            }
                        })(noAnimation), timeframe, t, meshData, d, stop);
                    }

                    function animationPositionTimer(noAnimation) {
                        if (t > d) {
                            stopPositionAnimation(noAnimation);
                        }
                        else {
                            c = new Array();
                            b = new Array();
                            b.x = parseFloat(meshData['startPosition']['x']);
                            b.y = parseFloat(meshData['startPosition']['y']);
                            b.z = parseFloat(meshData['startPosition']['z']);
                            c.x = parseFloat(meshData['endPos']['x']) - b.x;
                            c.y = parseFloat(meshData['endPos']['y']) - b.y;
                            c.z = parseFloat(meshData['endPos']['z']) - b.z;
                            mesh.position.x = Math.easeInOutQuad(t, b.x, c.x, d);
                            mesh.position.y = Math.easeInOutQuad(t, b.y, c.y, d);
                            mesh.position.z = Math.easeInOutQuad(t, b.z, c.z, d);
                            t += timeframe;
                        }
                    }

                    function stopPositionAnimation(noAnimation) {
                        clearInterval(frame);
                        animation_running = 0;
                        posAnimation_running = 0;
                        deactivateButtons();
                        if (typeof (stop) != 'undefined') {
                            if (stop) {
                                animatePositionStage(positionList.shift(), noAnimation);
                            }
                        }
                    }
                }
            });
        };

        var animateListStage = function (listStage, noAnimation) {
            if (typeof listStage != 'undefined') {
                var k = 0;
                for (var index in listStage['rotation']) {
                    k++;
                    if (k == listStage['rotation'].length)
                        animateMesh(listStage['rotation'][index], noAnimation, 1);
                    else
                        animateMesh(listStage['rotation'][index], noAnimation, 0);
                }
            } else {
                animation_sequence_active = false;
            }
        };

        var animatePositionStage = function (positionStage, noAnimation) {
            if (typeof positionStage !== 'undefined') {
                var k = 0;
                for (var index in positionStage['position']) {
                    k++;
                    if (k == positionStage['position'].length) {
                        animatePosition(positionStage['position'][index], noAnimation, 1);
                    } else {
                        animatePosition(positionStage['position'][index], noAnimation, 0);
                    }
                }
            }
        };

        var performAnimationSequence = function () {
            if (animation_sequence_active == false) {
                animation_sequence_active = true;
                if (!reverse) {
                    if (stage != endStage) {
                        var currentList = animValues[stage + 1];
                    } else {
                        var currentList = animValues[stage];
                    }
                    if (typeof animValues[stage] != "undefined") {
                        var previousList = animValues[stage];
                    }

                    for (var step in currentList) {
                        for (var meshName in currentList[step]['Rotation']) {
                            if (typeof (currentList[step]['Rotation'][meshName]) != 'undefined' || typeof (currentList[step]['Rotation'][meshName]['end']) != 'undefined') {
                                //rotation
                                if (step == 0) {
                                    if (typeof previousList == "undefined") {
                                        var startAng = "0";
                                    }
                                    else {
                                        var startAng = previousList[previousList.length - 1]['Rotation'][meshName]['end'];
                                    }
                                    var obj = {
                                        meshName: meshName,
                                        startAngle: startAng,
                                        endAngle: currentList[step]['Rotation'][meshName]['end']
                                    };
                                }
                                else {
                                    var obj = {
                                        meshName: meshName,
                                        startAngle: currentList[step - 1]['Rotation'][meshName]['end'],
                                        endAngle: currentList[step]['Rotation'][meshName]['end']
                                    };
                                }
                                if (noAnimation) {
                                    obj['noAnimation'] = 1;
                                }
                                if (typeof list[step] == 'undefined') {
                                    list[step] = [];
                                    list[step]['rotation'] = new Array();
                                }
                                list[step]['rotation'].push(obj);
                            }
                        }
                        for (var meshName in currentList[step]['Position']) {
                            if (typeof (currentList[step]['Position'][meshName]) != 'undefined' || typeof (currentList[step]['Position'][meshName]['position']) != 'undefined') {
                                if (step == 0) {
                                    if (typeof previousList == "undefined") {
                                        var startPos = animValues[0][0]['Position'][meshName];
                                    }
                                    else {
                                        var startPos = previousList[previousList.length - 1]["Position"][meshName];
                                    }
                                    var obj = {
                                        meshName: meshName,
                                        startPosition: startPos,
                                        endPos: currentList[step]["Position"][meshName]
                                    };

                                }
                                else {
                                    var obj = {
                                        meshName: meshName,
                                        startPosition: currentList[step - 1]['Position'][meshName],
                                        endPos: currentList[step]['Position'][meshName]
                                    };
                                }
                                if (noAnimation) {
                                    obj['noAnimation'] = 1;
                                }
                                if (typeof positionList[step] == 'undefined') {
                                    positionList[step] = [];
                                    positionList[step]['position'] = new Array();
                                }
                                positionList[step]['position'].push(obj);
                            }
                        }
                    }
                }
                else {
                    var currentList = animValues[stage];
                    var previousList = animValues[stage - 1];
                    var end = currentList.length - 2; //start from step-1

                    for (var step = end; step >= 0; step--) {
                        for (var meshName in currentList[step]['Rotation']) {
                            var obj = {
                                meshName: meshName,
                                startAngle: currentList[step + 1]['Rotation'][meshName]['end'],
                                endAngle: currentList[step]["Rotation"][meshName]["end"]
                            };
                            if (noAnimation) {
                                obj['noAnimation'] = 1;
                            }
                            if (typeof list[step + 1] === 'undefined') {
                                list[step + 1] = [];
                                list[step + 1]['rotation'] = new Array();
                            }
                            list[step + 1]['rotation'].push(obj);
                        }
                        for (var meshName in currentList[step]["Position"]) {
                            var obj = {
                                meshName: meshName,
                                startPosition: currentList[step + 1]['Position'][meshName],
                                endPos: currentList[step]["Position"][meshName]
                            };
                            if (noAnimation) {
                                obj['noAnimation'] = 1;
                            }
                            if (typeof positionList[step + 1] === 'undefined') {
                                positionList[step + 1] = [];
                                positionList[step + 1]['position'] = new Array();
                            }
                            positionList[step + 1]['position'].push(obj);
                        }
                    }
                    //add step to previous stage
                    for (meshName in previousList[previousList.length - 1]["Rotation"]) {
                        obj = {
                            meshName: meshName,
                            startAngle: currentList[0]["Rotation"][meshName]["end"],
                            endAngle: previousList[previousList.length - 1]['Rotation'][meshName]['end']
                        }
                        if (noAnimation) {
                            obj['noAnimation'] = 1;
                        }
                        if (typeof list[0] == 'undefined') {
                            list[0] = [];
                            list[0]['rotation'] = new Array();
                        }
                        list[0]['rotation'].push(obj);
                    }
                    for (meshName in previousList[previousList.length - 1]["Position"]) {
                        obj = {
                            meshName: meshName,
                            startPosition: currentList[0]["Position"][meshName],
                            endPos: previousList[previousList.length - 1]['Position'][meshName]
                        }
                        if (noAnimation) {
                            obj['noAnimation'] = 1;
                        }
                        if (typeof positionList[0] == 'undefined') {
                            positionList[0] = [];
                            positionList[0]['position'] = new Array();
                        }
                        positionList[0]['position'].push(obj);
                    }
                }

                var toAnimate = true;

                if (reverse) {
                    list = list.reverse();
                    positionList = positionList.reverse();
                }
                animateListStage(list.shift(), noAnimation);
                if (positionList.length && toAnimate) {
                    animatePositionStage(positionList.shift(), noAnimation);
                }
                stage += reverse ? -1 : 1;
            }
            let timeoutId = setTimeout(()=>{
                if (stage < endStage && !reverse) {
                    performAnimationSequence();
                } else if (stage > endStage && reverse) {
                    performAnimationSequence();
                } else {
                    if (use_animation_buttons) {
                        $('.animation-btn').prop('disabled', false);
                    } else {
                        var animationSlider = document.getElementById("AnimationSlider");
                        animationSlider.disabled = false;
                    }
                    document.dispatchEvent(new Event('animationfinished',{from: stage, to:endStage}));
                    if (Engine3DVariables.enableMeasurementGuides &&  open_animation_stage >= endStage) {
                        enableMeasurementGuides();
                    }
                }
                animationTimeoutArray.splice(animationTimeoutArray.indexOf(timeoutId),1);
            }, 500);
            
            if (timeoutId) {
                animationTimeoutArray.push(timeoutId);
            }
        }
        performAnimationSequence();
    };

    BabylonModel.prototype.initMaterial = function() {
        _scene = this.scene;
        this.scene.meshes.forEach( function( mesh ) {

            if ( mesh.material ) {
                if ( mesh.material.name == "white" ) {
                    mesh.material.backFaceCulling = false;
                    mesh.material.diffuseColor = new BABYLON.Color3( 0.85, 0.85, 0.85 );

                }
            }
        } );

    };

    BabylonModel.prototype.changeCameraTarget = function() {
        var radius = arcCamera.radius;

        if (model_max_x >= old_max_x) {
            old_max_x = model_max_x;
            arcCamera.lowerRadiusLimit = old_max_x / width_multiplier;
            arcCamera.upperRadiusLimit = old_max_x * width_multiplier * max_zoom_out_multiplier;
        }
        else if (model_max_x <= old_max_x) {
            old_max_x = model_max_x;
            arcCamera.lowerRadiusLimit = old_max_x / width_multiplier;
            arcCamera.upperRadiusLimit = old_max_x * width_multiplier * max_zoom_out_multiplier;
        }
        else if (model_max_y >= old_max_y) {
            old_max_y = model_max_y;
            arcCamera.lowerRadiusLimit = old_max_y / height_multiplier;
            arcCamera.upperRadiusLimit = old_max_y * height_multiplier * max_zoom_out_multiplier;
        }
        else if (model_max_y <= old_max_y) {
            old_max_y = model_max_y;
            arcCamera.lowerRadiusLimit = old_max_y / height_multiplier;
            arcCamera.upperRadiusLimit = old_max_y * height_multiplier * max_zoom_out_multiplier;
        }
        else {
            onload_radius = arcCamera.radius = radius;
        }
    };

    BabylonModel.prototype.changeInitialTexture = function() {
        var path = texturesUrl;
        if ( outsideTexture ) {
            var outsideMat = window.scene.getMaterialByName( "BackMaterial" );
            if ( ! isProof ) {
                outsideMat.diffuseTexture = new BABYLON.Texture( path + outsideTexture, _scene );
            }
            else {

                outsideMat.diffuseTexture = new BABYLON.Texture( outsideTexture, _scene );
            }

        }
        if ( insideTexture ) {
            var insideMat = window.scene.getMaterialByName( "FaceMaterial" );
            insideMat.diffuseTexture = new BABYLON.Texture( path + insideTexture, _scene );
        }
    };

    // ======================================================  STANDARD  =================================================== //
    var createMeshesStandard = function() {

        var UVdimension = [];

        for ( var name in points['points'] ) {

            if ( typeof points['points'][name][0] === 'string' ) {
                meshesParents.push( points['points'][name][0] )
                points['points'][name].shift();
            }
            else {
                meshesParents.push( "noParent" );
            }
        }

        //CALCUL UV
        for ( var name in points['points'] ) {
            for ( var i = 0; i <= points['points'][name].length - 2; i += 2 ) {
                if ( points['points'][name][i] <= min_x ) {
                    min_x = points['points'][name][i];
                }

                if ( points['points'][name][i] >= max_x ) {
                    max_x = points['points'][name][i];
                }
            }

            for ( var j = 1; j < points['points'][name].length - 1; j += 2 ) {
                if ( points['points'][name][j] <= min_y ) {
                    min_y = points['points'][name][j];
                }
                if ( points['points'][name][j] >= max_y ) {
                    max_y = points['points'][name][j];
                }
            }
        }
        //  CALCUL MIN MAX X Y

        if ( tmp == 1 ) {
            old_max_x = max_x;
            old_max_y = max_y;
            old_min_x = min_x;
            old_min_y = min_y;

            tmp --;
        }

        UVdimension['p1'] = [];
        UVdimension['p1']['x'] = max_x;
        UVdimension['p1']['y'] = max_y;

        UVdimension['p2'] = [];
        UVdimension['p2']['x'] = min_x;
        UVdimension['p2']['y'] = min_y;

        var w = Math.abs( max_x - min_x );
        var h = Math.abs( max_y - min_y );
        if ( typeof points['svgDim'] !== 'undefined' ) {
            if ( typeof points['svgDim']['width'] !== 'undefined' ) {
                w = points['svgDim']['width'];
            }
        }
        if ( typeof points['svgDim'] !== 'undefined' ) {
            if ( typeof points['svgDim']['height'] !== 'undefined' ) {
                h = points['svgDim']['height'];
            }
        }

        var x = - 1;
        for ( var name in points["points"] ) {

            x ++;

            name_array.push( name );

            var indici = [];
            var puncte = [];
            var uv = [];
            var normals = [];

            for ( var i = 0; i < points["points"][name].length; i += 2 ) {

                //PUNCTE
                puncte.push( points["points"][name][i] );
                puncte.push( thickness );
                puncte.push( points["points"][name][i + 1] );


                //INDICI
                if ( (i + 1) % 2 != 0 ) {
                    indici.push( parseInt( i / 2 ) );
                }

                //UVs
                var u = 1 - ((points["points"][name][i] - min_x + parseFloat(points.svgDim.margin)) / w);                  //lungime
                var v = (points["points"][name][i + 1] - min_y + parseFloat(points.svgDim.margin )) / h + 1;                //inaltime

                uv.push( u );
                uv.push( - v );
            }
            // PUNCTE INDICI UV

            var earcut_points = points["points"][name];
            indici = earcut( earcut_points );

            var vertexData = new BABYLON.VertexData();
            BABYLON.VertexData.ComputeNormals( puncte, indici, normals );
            vertexData.positions = puncte;
            vertexData.indices = indici;
            vertexData.uvs = uv;

            var meshName = new BABYLON.Mesh( name, window.scene );

            vertexData.applyToMesh( meshName );
            meshName.material = FaceMaterial;
        }
    };

    var createMeshesCopyStandard = function() {

        var UVdimension = [];

        UVdimension['p1'] = [];
        UVdimension['p1']['x'] = max_x;
        UVdimension['p1']['y'] = max_y;

        UVdimension['p2'] = [];
        UVdimension['p2']['x'] = min_x;
        UVdimension['p2']['y'] = min_y;

        var w = Math.abs( max_x - min_x );
        var h = Math.abs( max_y - min_y );
        if ( typeof points['svgDim'] !== 'undefined' ) {
            if ( typeof points['svgDim']['width'] !== 'undefined' ) {
                w = points['svgDim']['width'];
            }
        }
        if ( typeof points['svgDim'] !== 'undefined' ) {
            if ( typeof points['svgDim']['height'] !== 'undefined' ) {
                h = points['svgDim']['height'];
            }
        }

        var index = - 1;
        for ( var name in points["points"] ) {

            index ++;
            var indici = [];
            var puncte = [];
            var uv = [];
            var normals = [];

            for ( var i = 0; i < points["points"][name].length; i += 2 ) {

                //PUNCTE
                puncte.push( points["points"][name][i] );
                puncte.push( 0 );
                puncte.push( points["points"][name][i + 1] );

                //INDICI
                if ( (i + 1) % 2 != 0 ) {
                    indici.push( parseInt( i / 2 ) );
                }

                //UVs
                var u = ((points["points"][name][i] - min_x + parseFloat (points.svgDim.margin)) / w);                  //lungime
                var v = (points["points"][name][i + 1] - min_y + parseFloat (points.svgDim.margin)) / h + 1;                //inaltime

                uv.push( u );
                uv.push( - v );
            }
            // PUNCTE INDICI UV

            var earcut_points = points["points"][name];
            indici = earcut( earcut_points );

            var vertexData = new BABYLON.VertexData();
            BABYLON.VertexData.ComputeNormals( puncte, indici, normals );
            vertexData.positions = puncte;
            vertexData.indices = indici;
            vertexData.uvs = uv;

            var meshName = new BABYLON.Mesh( name + "_copy", window.scene );

            vertexData.applyToMesh( meshName );
            meshName.material = BackMaterial;

            var merge = BABYLON.Mesh.MergeMeshes( [window.scene.meshes[0], meshName], true );

            var multimat = new BABYLON.MultiMaterial( "multi", window.scene );
            multimat.subMaterials.push( FaceMaterial );
            multimat.subMaterials.push( BackMaterial );

            merge.material = multimat;

            merge.subMeshes = [];

            var vertices = merge.getTotalVertices();
            var indices = merge.getTotalIndices();

            merge.subMeshes.push( new BABYLON.SubMesh( 0, 0, vertices / 2, 0, indices / 2, merge ) );
            merge.subMeshes.pop();
            merge.subMeshes.push( new BABYLON.SubMesh( 1, vertices / 2, vertices / 2, indices / 2, indices / 2, merge ) );
            merge.subMeshes.pop();

        }
    };

    var createSidesStandard = function() {

        var index = - 1;
        for ( var name in points["points"] ) {

            var toMerge = [];

            index ++;
            var reset = points["points"][name].length;

            for ( var i = 0; i < points["points"][name].length; i += 2 ) {

                var puncte = [];

                puncte.push( new BABYLON.Vector3( points["points"][name][i % reset], 0, points["points"][name][(i + 1) % reset] ) );
                puncte.push( new BABYLON.Vector3( points["points"][name][(i + 2) % reset], 0, points["points"][name][(i + 3) % reset] ) );
                puncte.push( new BABYLON.Vector3( points["points"][name][i % reset], thickness, points["points"][name][(i + 1) % reset] ) );
                puncte.push( new BABYLON.Vector3( points["points"][name][(i + 2) % reset], thickness, points["points"][name][(i + 3) % reset] ) );

                var ribbonMesh = BABYLON.Mesh.CreateRibbon( name + "_sidePlanes", [puncte], false, false, 0, window.scene );

                ribbonMesh.material = CartonMaterial;

                toMerge.push( ribbonMesh );

            }

            if(toMerge.length > 0) {
                var merge = BABYLON.Mesh.MergeMeshes( toMerge, true );

                merge.parent = window.scene.meshes[index];
            }
        }
    };

    var createParentsStandard = function() {

        var copy_;
        // PARENTS FOR EACH MESH
        for ( var pars = 0; pars < name_array.length; pars ++ ) {
            if ( meshesParents[pars] != 'noParent' ) {
                for ( var index in window.scene.meshes ) {


                    if ( meshesParents[pars] == window.scene.meshes[index].name.replace( "_merged", "" ) ) {
                        copy_ = window.scene.meshes[index];
                        break;
                    }
                }
                window.scene.meshes[pars].parent = copy_;

            }
        }
    };

    var createPivotAxisStandard = function() {

        for ( var name in points['points'] ) {

            if ( typeof points['points'][name][0] === 'string' ) {
                points['points'][name].shift();
            }

        }

        for ( var index = 0; index < name_array.length; index ++ ) {

            var name = window.scene.meshes[index].name.replace( "_merged", "" );

            var pivotx = points["axis"][name].pivot.x;
            var pivoty = points["axis"][name].pivot.y;


            var vx_ = points["axis"][name].target.x;
            var vz_ = points["axis"][name].target.y;


            var vx = vx_ - pivotx;
            var vz = vz_ - pivoty;

            var mv = Math.sqrt( Math.pow( vx, 2 ) + Math.pow( vz, 2 ) );//magnitude
            var quaternion = [vx / mv, thickness, vz / mv];

            Engine3DVariables.meshes[name].axis.quaternion = [];
            Engine3DVariables.meshes[name].axis.quaternion[0] = quaternion[0];
            Engine3DVariables.meshes[name].axis.quaternion[1] = 0;
            Engine3DVariables.meshes[name].axis.quaternion[2] = quaternion[2];

            if ( Engine3DVariables.meshes[name].fold == "Out" ) {
                window.scene.meshes[index].setPivotMatrix( BABYLON.Matrix.Translation( - pivotx, - thickness, - pivoty ), true );
            }
            else {
                window.scene.meshes[index].setPivotMatrix( BABYLON.Matrix.Translation( - pivotx, 0, - pivoty ), true );
            }

            window.scene.meshes[index].name = name;
        }
    };

    var updateMeshesStandard = function( result ) {

        points = result.points_only;
        prevPoints = points;

        while ( _scene.meshes.length != 0 ) {
            _scene.meshes[0].dispose();
        }

        meshesParents = [];
        curves_count = 0;
        axisPoints = []
        puncte_finale_sus = [];
        puncte_finale_jos = [];
        puncte_finale_sides = [];
        name_array = [];
        curve_parent = [];
        uvsCurve = [];
        toBuild_no_y = [];


        name_array = [];
        axisPoints = [];
        uvsCurve = [];

        min_x = Infinity;
        min_y = Infinity;
        max_x = -Infinity;
        max_y = -Infinity;


        createMeshesStandard();

        createMeshesCopyStandard();

        createSidesStandard();

        createParentsStandard();

        createPivotAxisStandard();

    };

    var createMyMaterials = function() {
        CartonMaterial = new BABYLON.StandardMaterial( "CartonMaterial", window.scene );
        CartonMaterial.backFaceCulling = false;
        CartonMaterial.diffuseTexture = new BABYLON.Texture( "../packing_textures/karton.jpg", window.scene );
        CartonMaterial.specularColor = new BABYLON.Color3( 0, 0, 0 );
        // CartonMaterial.wireframe = true;
        // CartonMaterial.useLogarithmicDepth = true;

        FaceMaterial = new BABYLON.StandardMaterial( "FaceMaterial", window.scene );
        FaceMaterial.backFaceCulling = false;
        FaceMaterial.diffuseTexture = new BABYLON.Texture( "../packing_textures/karton.jpg", window.scene );
        FaceMaterial.specularColor = new BABYLON.Color3( 0, 0, 0 );
        // FaceMaterial.wireframe = true;
        // FaceMaterial.useLogarithmicDepth = true;

        BackMaterial = new BABYLON.StandardMaterial( "BackMaterial", window.scene );
        BackMaterial.backFaceCulling = false;
        BackMaterial.diffuseTexture = new BABYLON.Texture( "../packing_textures/white.png", window.scene );
        BackMaterial.specularColor = new BABYLON.Color3( 0, 0, 0 );
        // BackMaterial.wireframe = true;
        // BackMaterial.useLogarithmicDepth = true;

    };

    var getCameraTarget = function() {

        let x = arcCamera.target.x;
        let y = arcCamera.target.y;
        let z = arcCamera.target.z;

        return {x : x, y : y, z : z};
    };

    var getCameraPosition = function() {

        var xpos = arcCamera.position.x;
        var ypos = arcCamera.position.y;
        var zpos = arcCamera.position.z;

        console.log( xpos );
        console.log( ypos );
        console.log( zpos );

        return {x : xpos, y : ypos, z : zpos};
    };

    var setQuality = function() {

        if ( STANDARD_MODEL == false ) {
            STANDARD_MODEL = true;
        }
        else if ( STANDARD_MODEL == true ) {
            STANDARD_MODEL = false;
        }
        else if ( typeof STANDARD_MODEL === "undefined" ) {
            STANDARD_MODEL = true;
        }
    };

    var updateCamera = function() {

        if ( max_x > max_y ) {
            arcCamera.upperRadiusLimit = max_x * width_multiplier;
        }
        else if ( max_x <= max_y ) {
            arcCamera.upperRadiusLimit = max_y * height_multiplier;
        }

        if ( min_x > min_y ) {
            arcCamera.lowerRadiusLimit = min_x * width_multiplier;
        }
        else if ( min_x <= min_y ) {
            arcCamera.lowerRadiusLimit = min_y * height_multiplier;
        }

        if ( Engine3DVariables.cameraSettings.cameraCenter.length > 0 ) {


            for ( var name in Engine3DVariables.meshes ) {
                if ( name == Engine3DVariables.cameraSettings.cameraCenter ) {
                    buffer = name;
                    break;
                }
            }

            for ( var i = 0; i < name_array.length; i ++ ) {
                if ( buffer == name_array[i] ) {
                    buffer = i;
                    break;
                }
            }

            var local_x = _scene.meshes[buffer].getBoundingInfo().boundingBox.minimumWorld.x;
            var local_y = _scene.meshes[buffer].getBoundingInfo().boundingBox.minimumWorld.y;
            var local_z = _scene.meshes[buffer].getBoundingInfo().boundingBox.minimumWorld.z;

            var global_x = _scene.meshes[buffer].getBoundingInfo().boundingBox.maximumWorld.x;
            var global_y = _scene.meshes[buffer].getBoundingInfo().boundingBox.maximumWorld.y;
            var global_z = _scene.meshes[buffer].getBoundingInfo().boundingBox.maximumWorld.z;

            arcCamera.target.x = (local_x + global_x) / 2;
            var heightAdjust = (model_max_y - model_min_y) / 2;
            arcCamera.target.y = ((local_y + global_y) / 2) + heightAdjust;
            arcCamera.target.z = (local_z + global_z) / 2;

        }

        scene.activeCamera = arcCamera;

        arcCamera.panningSensibility = 10;
        arcCamera.wheelPrecision = 1;
    };

    window.getCameraTarget = getCameraTarget;
    window.getCameraPosition = getCameraPosition;
    window.setQuality = setQuality;


    // ======================================================  ADVANCED  =================================================== //

    function localRound ( number, precision = 10 ) {
        return +(Math.round( number + "e+" + precision ) + "e-" + precision);
    }

    var measurementGuideLines = [];
    var measurementGuidePlaneText = [];
    var linesystem;

    var drawMeasurementGuides = function () {
        let active_mesh = Engine3DVariables.measurementGuides;

        let lengthGuide = active_mesh.length;
        let depthGuide = active_mesh.depth;
        let widthGuide = active_mesh.width;

        let focusMesh = scene.getMeshByName(active_mesh.focus.target);
        let lengthMesh = scene.getMeshByName(lengthGuide.target);
        let depthMesh = scene.getMeshByName(depthGuide.target);
        let widthMesh = scene.getMeshByName(widthGuide.target);

        let focusX = focusMesh.getBoundingInfo().boundingBox.minimum.x;
        let focusY = focusMesh.getBoundingInfo().boundingBox.minimum.y;
        let focusZ = focusMesh.getBoundingInfo().boundingBox.minimum.z;
        let minimumX = lengthMesh.getBoundingInfo().boundingBox.minimum[lengthGuide.key];
        let maximumX = lengthMesh.getBoundingInfo().boundingBox.maximum[lengthGuide.key];
        let minimumY = depthMesh.getBoundingInfo().boundingBox.minimum[depthGuide.key];
        let maximumY = depthMesh.getBoundingInfo().boundingBox.maximum[depthGuide.key];
        let minimumZ = widthMesh.getBoundingInfo().boundingBox.minimum[widthGuide.key];
        let maximumZ = widthMesh.getBoundingInfo().boundingBox.maximum[widthGuide.key];
        let lengthA, lengthB, width, depth;

        if (!Engine3DVariables.cameraSettings.reverse) {
            lengthA = {
                x: focusX + (maximumX - minimumX),
                y: focusY,
                z: focusZ + (maximumZ - minimumZ)
            }
            lengthB = {
                x: focusX,
                y: focusY,
                z: focusZ + (maximumZ - minimumZ)
            }
            width = {
                x: focusX,
                y: focusY,
                z: focusZ
            }
            depth = {
                x: focusX,
                y: focusY + (maximumY - minimumY),
                z: focusZ
            }
        } else {
            lengthA = {
                x: focusX,
                y: focusY,
                z: focusZ
            }
            lengthB = {
                x: focusX + (maximumX - minimumX),
                y: focusY,
                z: focusZ
            }
            width = {
                x: focusX + (maximumX - minimumX),
                y: focusY,
                z: focusZ + (maximumZ - minimumZ)
            }
            depth = {
                x: focusX + (maximumX - minimumX),
                y: focusY + (maximumY - minimumY),
                z: focusZ + (maximumZ - minimumZ)
            }
        }

        let lengthDiff = Math.max(lengthA.x, lengthB.x) - Math.min(lengthA.x, lengthB.x);
        let widthDiff = Math.max(lengthB.z, width.z) - Math.min(lengthB.z, width.z);
        let depthDiff = Math.max(depth.y, width.y) - Math.min(depth.y, width.y);
        let longestSideLength = Math.max(lengthDiff, widthDiff, depthDiff);
        let averageSideLength = (lengthDiff + widthDiff + depthDiff) /3;

        let dimensionOverride = Engine3DVariables.measurementGuides.hasOwnProperty('dimension_override') ? Engine3DVariables.measurementGuides.dimension_override : {};

        let additionalPadding = lengthGuide.hasOwnProperty('padding') ? lengthGuide['padding'] : 0;
        let dimension = dimensionOverride.hasOwnProperty('length') ? dimensionOverride.length : 'length';
        drawSide(lengthA, lengthB, longestSideLength, averageSideLength, dimension, additionalPadding);

        additionalPadding = depthGuide.hasOwnProperty('padding') ? depthGuide['padding'] : 0;
        dimension = dimensionOverride.hasOwnProperty('width') ? dimensionOverride.width : 'width';
        drawSide(lengthB, width, longestSideLength, averageSideLength, dimension, additionalPadding);

        additionalPadding = widthGuide.hasOwnProperty('padding') ? widthGuide['padding'] : 0;
        dimension = dimensionOverride.hasOwnProperty('depth') ? dimensionOverride.depth : 'depth';
        drawSide(width, depth, longestSideLength, averageSideLength, dimension, additionalPadding);

        linesystem = BABYLON.MeshBuilder.CreateLineSystem("linesystem", { lines: measurementGuideLines });
        linesystem.color = new BABYLON.Color3(92 / 255, 218 / 255, 227 / 255);
        linesystem.depth = 5;
    }

    var drawSide = function (pointA, pointB, longestSideLength, averageSideLength, side, additionalPadding) {
        let textPos = JSON.parse(JSON.stringify(pointA));
        let padding = {x: 0, y: 0, z: 0};
        let textPadding = {x: 0, y: 0, z: 0};

        let reverse_multiplier = Engine3DVariables.cameraSettings.reverse ? -1 : 1;
        Object.entries(pointA).forEach(entry => {
            const [key] = entry;
            if (pointA[key] !== pointB[key]) {
                switch (key) {
                    case 'x':
                        padding.z = reverse_multiplier * ((averageSideLength / 25) + additionalPadding);
                        textPadding.z = reverse_multiplier * ((averageSideLength / 25 * 4) + (additionalPadding));
                        break;
                    case 'y':
                    case 'z':
                        padding.x = -(reverse_multiplier * ((averageSideLength / 25)  + additionalPadding));
                        textPadding.x = -(reverse_multiplier * ((averageSideLength / 25 * 4) + additionalPadding));
                        break;
                }
                textPos[key] = (pointB[key] + pointA[key]) / 2;
            }
        });

        let linePoints = [
            new BABYLON.Vector3(pointA.x + padding.x, pointA.y + padding.y, pointA.z + padding.z),
            new BABYLON.Vector3(pointB.x + padding.x, pointB.y + padding.y, pointB.z + padding.z),
        ];

        let planeSize = longestSideLength / 4;
        let fontSize = 175;

        var outputplane = BABYLON.Mesh.CreatePlane("plane", planeSize, scene, false);
        outputplane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
        outputplane.material = new BABYLON.StandardMaterial("outputplane", scene);
        outputplane.position = new BABYLON.Vector3(textPos.x + textPadding.x, textPos.y + textPadding.y, textPos.z + textPadding.z);

        var outputplaneTexture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
        outputplane.material.diffuseTexture = outputplaneTexture;
        outputplane.material.diffuseTexture.hasAlpha = true;
        outputplane.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        outputplane.material.disableLighting = true;

        let dimension = Number(Engine3DVariables.dimensions[side]);
        if (dimension) {
            dimension = Number.isInteger(dimension) ? dimension : parseFloat(dimension.toFixed(2));
        }
        outputplaneTexture.drawText(dimension, null, 512/2, "normal " + fontSize + "px Arial", "#108ab6", "#00000000");

        measurementGuideLines.push(linePoints);
        measurementGuidePlaneText.push(outputplane);
    }

    var getFoldIndex = function( point1, point2 ){
        for ( var index in axisPoints ) {
            var axis = axisPoints[index];
            if ( point1.x == axis[0] && point1.y == axis[1] ) {
                if ( point2.x == axis[2] && point2.y == axis[3] ) {
                    return index;
                }
            }
            else if ( point1.x == axis[2] && point1.y == axis[3] ) {
                if ( point2.x == axis[0] && point2.y == axis[1] ) {
                    return index;
                }
            }
        }
        return false;
    }


    var isFold = function( point1, point2 ) {
        for ( var index in axisPoints ) {
            var axis = axisPoints[index];
            if ( point1.x == axis[0] && point1.y == axis[1] ) {
                if ( point2.x == axis[2] && point2.y == axis[3] ) {
                    return true;
                }
            }
            else if ( point1.x == axis[2] && point1.y == axis[3] ) {
                if ( point2.x == axis[0] && point2.y == axis[1] ) {
                    return true;
                }
            }
        }
        return false;

    }

    var getFoldDirection = function(point1, point2){
        for ( var index in axisPoints ) {
            var axis = axisPoints[index];
            if ( point1.x == axis[0] && point1.y == axis[1] ) {
                if ( point2.x == axis[2] && point2.y == axis[3] ) {
                    return axis[4];
                }
            }
            else if ( point1.x == axis[2] && point1.y == axis[3] ) {
                if ( point2.x == axis[0] && point2.y == axis[1] ) {
                    return axis[4];
                }
            }
        }
        return false;
    }

    var getAngle = function( point1, point2, point3 ) {

        var p1x = point1.x;
        var p1y = point1.y;
        var p2x = point2.x;
        var p2y = point2.y;
        var p3x = point3.x;
        var p3y = point3.y;


        var v1x = p1x - p2x;
        var v1y = p1y - p2y;

        var v2x = p3x - p2x;
        var v2y = p3y - p2y;

        var angle = Math.atan2( v2y, v2x ) - Math.atan2( v1y, v1x );
        return angle;

    }

    var getSlope = function( point1, point2 ) {
        return Math.atan2( (point2.y - point1.y), (point2.x - point1.x) );
    }

    var createSideCoords = function( initial, final, name ) {

        var sideCoord = {
            initial: final,
            final: initial
        };
        sideMeshes[name].push(sideCoord);

    }

    var getCoordOnCorner = function( point1, origin, point3, distance, angle, isOutside = false ) {
        if ( distance > 2 ) {
            //TODO : check with George if it's ok
            distance = 2;
        }
        var coord = {};
        var slope = (getSlope( origin, point1 ) + getSlope( origin, point3 )) / 2;
        coord.x = distance * Math.cos( slope ) + origin.x;
        coord.y = distance * Math.sin( slope ) + origin.y;
        if ( angle < 0 ) {
            isOutside = ! isOutside;
        }
        if ( isOutside ) {
            coord.x = 2 * origin.x - coord.x;
            coord.y = 2 * origin.y - coord.y;
        }
        return coord;
    };

    var getCoordOnLine = function( point1, point2, distance, isOutside = false ) {
        if (distance > 2) {
            //TODO : check with George if it's ok
            distance = 2;
        }
        var coord = {};
        var d = Math.sqrt( Math.pow( point2.x - point1.x, 2 ) + Math.pow( point2.y - point1.y, 2 ) );
        var t = distance / d;
        if ( t < 0 || t > 1 ) {
            // t=0.5;
            // console.log(t);
        }
        coord.x = localRound( (1 - t) * point1.x + t * point2.x );
        coord.y = localRound( (1 - t) * point1.y + t * point2.y );
        if ( isOutside ) {
            coord.x = 2 * point2.x - coord.x;
            coord.y = 2 * point2.y - coord.y;
        }
        return coord;
    };

    var createCurveSide = function(curve, parent, name){

        var aux = {
            x: curve[0].x,
            y: curve [curve.length-1].y,
            z: curve[0].z
        };

        curve.push(aux);
        var curvePoints = [];
        var curve_no_y = [];

        for(var i = 0 ; i < curve.length; i++){

            curvePoints.push(curve[i].x);
            curvePoints.push(curve[i].y);
            curvePoints.push(curve[i].z);

            curve_no_y.push(curve[i].x);
            curve_no_y.push(curve[i].y);
            curve_no_y.push(curve[i].z);
        }

        var w = Math.abs( max_x - min_x );
        var h = Math.abs( max_y - min_y );
        if ( typeof points['svgDim'] !== 'undefined' ) {
            if ( typeof points['svgDim']['width'] !== 'undefined' ) {
                w = points['svgDim']['width'];
            }
        }
        if ( typeof points['svgDim'] !== 'undefined' ) {
            if ( typeof points['svgDim']['height'] !== 'undefined' ) {
                h = points['svgDim']['height'];
            }
        }

        var uv = [];
        var normals = [];
        for ( var i = 0; i < curvePoints.length - 1; i += 3 ) {

            //UVs
            var u = (curvePoints[i] - min_x + parseFloat (points.svgDim.margin)) / w;                  //lungime
            var v = (curvePoints[i + 2] - min_y + parseFloat( points.svgDim.margin )) / h + 1;                //inaltime

            uv.push( u );
            uv.push( - v );
        }          // PUNCTE INDICI UV

        var earcut_points = curve_no_y;
        var indici = earcut( earcut_points, null, 3 );
        indici = [8, 9, 0, 0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 8, 0, 2, 2, 4, 6, 6, 8, 2]; // TODO: hardcoded
        var vertexData = new BABYLON.VertexData();
        BABYLON.VertexData.ComputeNormals( curvePoints, indici, normals );
        vertexData.positions = curvePoints;
        vertexData.indices = indici;
        vertexData.uvs = uv;

        var meshName = new BABYLON.Mesh( scene.meshes[parent].name + "_side_curve", scene );

        vertexData.applyToMesh( meshName );
        meshName.material = CartonMaterial;
        meshName.parent = scene.meshes[parent];
        curveSides[name].push(scene.meshes.length - 1);

    };

    var optimizeModel = function(){
        var offset = 0;
        var parent = 0;
        for(var name in curveSides){
            var toMerge = [];

            for(var index = 0 ; index < curveSides[name].length; index++){
                toMerge.push( scene.meshes[curveSides[name][index] - offset] );
            }
            if(toMerge.length > 0 ) {
                var newMesh = BABYLON.Mesh.MergeMeshes( toMerge, true );
                newMesh.name = name + "_curve_sides_merged";
                newMesh.parent = scene.meshes[parent ++];
                offset += curveSides[name].length;
            }else parent++;
        }

        var string1 = "side_plane_merged";
        var string2 = "curve_sides_merged";
        var index1;
        var index2;
        var first = 0;
        for(var i = 0; i < scene.meshes.length; i++){
            if(scene.meshes[i].name.search(string1) > 0 && first == 0){
                index1 = i;
                first = 1;
            }
            if(scene.meshes[i].name.search(string2) > 0 && first == 1){
                index2 = i;
                break;
            }
        }
    };

    var createAxisPointsAdvanced = function() {


        var k = 0;

        for ( var i = 0; i < points['foldPoints'].length - 1; i += 2 ) {

            axisPoints[k] = [];

            var a = localRound (parseFloat( points['foldPoints'][i][0] ));
            var b = localRound (parseFloat( points['foldPoints'][i][1] ));

            var c = localRound( parseFloat( points['foldPoints'][i + 1][0]));
            var d = localRound( parseFloat( points['foldPoints'][i + 1][1]));

            axisPoints[k].push( a, b );
            axisPoints[k ++].push( c, d );

        }

        for(var i in axisPoints){
            axisPoints[i][4] = "Out";
        }


        for(var name in points['points']){

            var point1 = {
                x: Engine3DVariables.meshes[name].axis.pivot.x,
                y: Engine3DVariables.meshes[name].axis.pivot.y
            };

            var point2 = {
                x : Engine3DVariables.meshes[name].axis.target.x,
                y : Engine3DVariables.meshes[name].axis.target.y
            };

            var index = getFoldIndex(point1, point2);

            if(index !== false) {
                axisPoints[index][4] = Engine3DVariables.meshes[name].fold;
            }
        }
    }

    var createMeshesAdvanced = function() {

        var UVdimension = [];

        for ( var name in points['points'] ) {

            if ( typeof points['points'][name][0] === 'string' ) {
                meshesParents.push( points['points'][name][0] );
                points['points'][name].shift();
            }
            else {
                meshesParents.push( "noParent" );
            }

        }

        //CALCUL UV
        for ( var name in points['points'] ) {
            for ( var i = 0; i < points['points'][name].length - 2; i += 2 ) {
                if ( points['points'][name][i] <= min_x ) {
                    min_x = points['points'][name][i];
                }
                if ( points['points'][name][i] >= max_x ) {
                    max_x = points['points'][name][i];
                }
            }

            for ( var j = 1; j < points['points'][name].length - 1; j += 2 ) {
                if ( points['points'][name][j] <= min_y ) {
                    min_y = points['points'][name][j];
                }
                if ( points['points'][name][j] >= max_y ) {
                    max_y = points['points'][name][j];
                }
            }
        }//  CALCUL MIN MAX X Y

        if ( tmp == 1 ) {
            old_max_x = max_x;
            old_max_y = max_y;
            old_min_x = min_x;
            old_min_y = min_y;

            tmp --;
        }

        UVdimension['p1'] = [];
        UVdimension['p1']['x'] = max_x;
        UVdimension['p1']['y'] = max_y;

        UVdimension['p2'] = [];
        UVdimension['p2']['x'] = min_x;
        UVdimension['p2']['y'] = min_y;

        var w = Math.abs( max_x - min_x );
        var h = Math.abs( max_y - min_y );

        if ( typeof points['svgDim'] !== 'undefined' ) {
            if ( typeof points['svgDim']['width'] !== 'undefined' ) {
                w = points['svgDim']['width'];
            }
        }
        if ( typeof points['svgDim'] !== 'undefined' ) {
            if ( typeof points['svgDim']['height'] !== 'undefined' ) {
                h = points['svgDim']['height'];
            }
        }

        var newPoints = [];

        for ( var name in points['points'] ) {

            name_array.push(name);


            newPoints[name] = [];
            curvePoints[name] = [];
            var currentMesh = points['points'][name];
            var reset = currentMesh.length;
            for ( var index = 0; index < currentMesh.length; index += 2 ) {

                var point1 = {};
                point1.x = currentMesh[index % reset];
                point1.y = currentMesh[(index + 1) % reset];

                var point2 = {};
                point2.x = currentMesh[(index + 2) % reset];
                point2.y = currentMesh[(index + 3) % reset];

                var point3 = {};
                point3.x = currentMesh[(index + 4) % reset];
                point3.y = currentMesh[(index + 5) % reset];


                var ant = isFold( point1, point2 );
                var next = isFold( point2, point3 );
                var angle = getAngle( point1, point2, point3 );

                var insert;
                var bezier;

                if ( ant == true ) {
                    if ( next == true ) {
                        //fold & fold

                        if ( getFoldDirection( point2, point3 ) === "Out" ) {
                            newPoints[name].push( point2.x );
                            newPoints[name].push( point2.y );
                        }
                        else if ( angle < Math.PI ) {
                            //fold & fold & smaller
                            insert = getCoordOnCorner( point1, point2, point3, thickness, angle, false );
                            newPoints[name].push( insert.x );
                            newPoints[name].push( insert.y );
                            bezier = {
                                origin      : point2,
                                control     : {
                                    x : point2.x,
                                    y : thickness,
                                    z : point2.y
                                },
                                destination : insert
                            };
                            curvePoints[name].push( bezier );

                        }
                        else if ( angle > Math.PI ) {
                            //fold & fold & larger
                            insert = getCoordOnCorner( point1, point2, point3, thickness, angle, true );
                            newPoints[name].push( insert.x );
                            newPoints[name].push( insert.y );
                            bezier = {
                                origin      : point2,
                                control     : {
                                    x : point2.x,
                                    y : thickness,
                                    z : point2.y
                                },
                                destination : insert
                            };
                            curvePoints[name].push( bezier );

                        }
                        else {
                            //fold & fold & 180
                            insert = getCoordOnCorner( point1, point2, point3, thickness, angle, false );
                            newPoints[name].push( insert.x );
                            newPoints[name].push( insert.y );
                            bezier = {
                                origin      : point2,
                                control     : {
                                    x : point2.x,
                                    y : thickness,
                                    z : point2.y
                                },
                                destination : insert
                            };
                            curvePoints[name].push( bezier );

                        }
                    }
                    else {
                        //fold & cut

                        if ( getFoldDirection( point1, point2 ) === "Out" ) {
                            newPoints[name].push( point2.x );
                            newPoints[name].push( point2.y );
                        }
                        else if ( angle < Math.PI ) {
                            //fold & cut & smaller
                            insert = getCoordOnLine( point2, point3, thickness );
                            newPoints[name].push( insert.x );
                            newPoints[name].push( insert.y );
                            bezier = {
                                origin      : point2,
                                control     : {
                                    x : point2.x,
                                    y : thickness,
                                    z : point2.y
                                },
                                destination : insert
                            };
                            curvePoints[name].push( bezier );

                        }
                        else if ( angle > Math.PI ) {
                            //fold & cut & larger
                            insert = getCoordOnLine( point2, point3, thickness, false );
                            newPoints[name].push( insert.x );
                            newPoints[name].push( insert.y );
                            bezier = {
                                origin      : point2,
                                control     : {
                                    x : point2.x,
                                    y : thickness,
                                    z : point2.y
                                },
                                destination : insert
                            };
                            curvePoints[name].push( bezier );

                        }
                        else {
                            //fold & cut & 180
                            newPoints[name].push( point2.x );
                            newPoints[name].push( point2.y );
                            bezier = {
                                origin      : point2,
                                control     : {
                                    x : point2.x,
                                    y : thickness,
                                    z : point2.y
                                },
                                destination : point2
                            };
                            curvePoints[name].push( bezier );

                        }
                    }
                }
                else {
                    if ( next == true ) {
                        //cut & fold

                        if ( getFoldDirection( point2, point3 ) === "Out" ) {
                            newPoints[name].push( point2.x );
                            newPoints[name].push( point2.y );
                        }
                        else if ( angle < Math.PI ) {
                            //cut & fold & smaller
                            insert = getCoordOnLine( point2, point1, thickness );
                            newPoints[name].push( insert.x );
                            newPoints[name].push( insert.y );
                            bezier = {
                                origin      : point2,
                                control     : {
                                    x : point2.x,
                                    y : thickness,
                                    z : point2.y
                                },
                                destination : insert
                            };
                            curvePoints[name].push( bezier );

                        }
                        else if ( angle > Math.PI ) {
                            //cut & fold & larger
                            insert = getCoordOnLine( point2, point1, thickness, false );
                            newPoints[name].push( insert.x );
                            newPoints[name].push( insert.y );
                            bezier = {
                                origin      : point2,
                                control     : {
                                    x : point2.x,
                                    y : thickness,
                                    z : point2.y
                                },
                                destination : insert
                            };
                            curvePoints[name].push( bezier );

                        }
                        else {
                            //cut & fold & 180
                            newPoints[name].push( point2.x );
                            newPoints[name].push( point2.y );
                            bezier = {
                                origin      : point2,
                                control     : {
                                    x : point2.x,
                                    y : thickness,
                                    z : point2.y
                                },
                                destination : point2
                            };
                            curvePoints[name].push( bezier );

                        }
                    }
                    else {
                        //cut & cut
                        newPoints[name].push( point2.x );
                        newPoints[name].push( point2.y );
                    }
                }
            }

            newPoints[name].unshift( newPoints[name].pop() );
            newPoints[name].unshift( newPoints[name].pop() );

        }
        var parent = 0;
        for ( var index in newPoints ) {

            var indici = [];
            var puncte = [];
            var uv = [];
            var normals = [];


            for ( var i = 0; i < newPoints[index].length; i += 2 ) {

                //PUNCTE
                puncte.push( newPoints[index][i] );
                puncte.push( thickness );
                puncte.push( newPoints[index][i + 1] );

                //INDICI
                if ( (i + 1) % 2 != 0 ) {
                    indici.push( parseInt( i / 2 ) );
                }

                //UVs
                var u = 1 - (newPoints[index][i] - UVdimension['p2']['x'] + parseFloat( points.svgDim.margin )) / w;                  //lungime
                var v = (newPoints[index][i + 1] - UVdimension['p2']['y'] + parseFloat( points.svgDim.margin )) / h + 1;                //inaltime

                uv.push( u );
                uv.push( - v );
            }          // PUNCTE INDICI UV

            var earcut_points = newPoints[index];
            indici = earcut( earcut_points );

            var vertexData = new BABYLON.VertexData();
            BABYLON.VertexData.ComputeNormals( puncte, indici, normals );
            vertexData.positions = puncte;
            vertexData.indices = indici;
            vertexData.uvs = uv;


            var meshName = new BABYLON.Mesh( name_array[parent++], scene );


            vertexData.applyToMesh( meshName );
            meshName.material = FaceMaterial;

        }
    };

    var createMeshesCopyAdvanced = function() {

        var UVdimension = [];

        UVdimension['p1'] = [];
        UVdimension['p1']['x'] = max_x;
        UVdimension['p1']['y'] = max_y;

        UVdimension['p2'] = [];
        UVdimension['p2']['x'] = min_x;
        UVdimension['p2']['y'] = min_y;

        var w = Math.abs( max_x - min_x );
        var h = Math.abs( max_y - min_y );

        if ( typeof points['svgDim'] !== 'undefined' ) {
            if ( typeof points['svgDim']['width'] !== 'undefined' ) {
                w = points['svgDim']['width'];
            }
        }
        if ( typeof points['svgDim'] !== 'undefined' ) {
            if ( typeof points['svgDim']['height'] !== 'undefined' ) {
                h = points['svgDim']['height'];
            }
        }

        var newPoints = [];

        for ( var name in points['points'] ) {


            newPoints[name] = [];
            sideMeshes[name] = [];
            var currentMesh = points['points'][name];
            var reset = currentMesh.length;
            for ( var index = 0; index < currentMesh.length; index += 2 ) {

                var point1 = {};
                point1.x = currentMesh[index % reset];
                point1.y = currentMesh[(index + 1) % reset];

                var point2 = {};
                point2.x = currentMesh[(index + 2) % reset];
                point2.y = currentMesh[(index + 3) % reset];

                var point3 = {};
                point3.x = currentMesh[(index + 4) % reset];
                point3.y = currentMesh[(index + 5) % reset];


                var ant = isFold( point1, point2 );
                var next = isFold( point2, point3 );
                var angle = getAngle( point1, point2, point3 );

                var insert;
                var bezier;

                if ( ant == true ) {
                    if ( next == true ) {
                        //fold & fold

                        if ( getFoldDirection( point2, point3 ) !== "Out" ) {
                            newPoints[name].push( point2.x );
                            newPoints[name].push( point2.y );
                            createSideCoords( point2, point2, name );
                        }
                        else if ( angle < Math.PI ) {
                            //fold & fold & smaller
                            insert = getCoordOnCorner( point1, point2, point3, thickness, angle, false );
                            newPoints[name].push( insert.x );
                            newPoints[name].push( insert.y );
                            bezier = {
                                origin      : point2,
                                control     : {
                                    x : point2.x,
                                    y : 0,
                                    z : point2.y
                                },
                                destination : insert
                            };
                            curvePoints[name].push(bezier);

                            createSideCoords(insert, point2, name);
                        }
                        else if ( angle > Math.PI ) {
                            //fold & fold & larger
                            insert = getCoordOnCorner( point1, point2, point3, thickness, angle, true );
                            newPoints[name].push( insert.x );
                            newPoints[name].push( insert.y );
                            bezier = {
                                origin      : point2,
                                control     : {
                                    x : point2.x,
                                    y : 0,
                                    z : point2.y
                                },
                                destination : insert
                            };
                            curvePoints[name].push( bezier );

                            createSideCoords( insert, point2, name );
                        }
                        else {
                            //fold & fold & 180
                            insert = getCoordOnCorner( point1, point2, point3, thickness, angle, false );
                            newPoints[name].push( insert.x );
                            newPoints[name].push( insert.y );
                            bezier = {
                                origin      : point2,
                                control     : {
                                    x : point2.x,
                                    y : 0,
                                    z : point2.y
                                },
                                destination : insert
                            };
                            curvePoints[name].push( bezier );

                            createSideCoords( insert, point2, name );
                        }
                    }
                    else {
                        //fold & cut

                        if ( getFoldDirection( point1, point2 ) !== "Out" ) {
                            newPoints[name].push( point2.x );
                            newPoints[name].push( point2.y );
                            createSideCoords( point2, point2, name );
                        }
                        else if ( angle < Math.PI ) {
                            //fold & cut & smaller
                            insert = getCoordOnLine( point2, point3, thickness );
                            newPoints[name].push( insert.x );
                            newPoints[name].push( insert.y );
                            bezier = {
                                origin      : point2,
                                control     : {
                                    x : point2.x,
                                    y : 0,
                                    z : point2.y
                                },
                                destination : insert
                            };
                            curvePoints[name].push( bezier );

                            createSideCoords( insert, point2, name );
                        }
                        else if ( angle > Math.PI ) {
                            //fold & cut & larger
                            insert = getCoordOnLine( point2, point3, thickness, false );
                            newPoints[name].push( insert.x );
                            newPoints[name].push( insert.y );
                            bezier = {
                                origin      : point2,
                                control     : {
                                    x : point2.x,
                                    y : 0,
                                    z : point2.y
                                },
                                destination : insert
                            };
                            curvePoints[name].push( bezier );

                            createSideCoords( insert, point2, name );
                        }
                        else {
                            //fold & cut & 180
                            newPoints[name].push( point2.x );
                            newPoints[name].push( point2.y );
                            bezier = {
                                origin      : point2,
                                control     : {
                                    x : point2.x,
                                    y : 0,
                                    z : point2.y
                                },
                                destination : point2
                            };
                            curvePoints[name].push( bezier );

                            createSideCoords( point2, point2, name );
                        }
                    }
                }
                else {
                    if ( next == true ) {
                        //cut & fold

                        if(getFoldDirection(point2,point3) !== "Out"){
                            newPoints[name].push( point2.x );
                            newPoints[name].push( point2.y );
                            createSideCoords( point2, point2, name );
                        } else if ( angle < Math.PI ) {
                            //cut & fold & smaller
                            insert = getCoordOnLine( point2, point1, thickness );
                            newPoints[name].push( insert.x );
                            newPoints[name].push( insert.y );
                            bezier = {
                                origin      : point2,
                                control     : {
                                    x : point2.x,
                                    y : 0,
                                    z : point2.y
                                },
                                destination : insert
                            };
                            curvePoints[name].push( bezier );

                            createSideCoords( insert, point2, name );
                        }
                        else if ( angle > Math.PI ) {
                            //cut & fold & larger
                            insert = getCoordOnLine( point2, point1, thickness, false );
                            newPoints[name].push( insert.x );
                            newPoints[name].push( insert.y );
                            bezier = {
                                origin      : point2,
                                control     : {
                                    x : point2.x,
                                    y : 0,
                                    z : point2.y
                                },
                                destination : insert
                            };
                            curvePoints[name].push( bezier );

                            createSideCoords( insert, point2, name );
                        }
                        else {
                            //cut & fold & 180
                            newPoints[name].push( point2.x );
                            newPoints[name].push( point2.y );
                            bezier = {
                                origin      : point2,
                                control     : {
                                    x : point2.x,
                                    y : 0,
                                    z : point2.y
                                },
                                destination : point2
                            };
                            curvePoints[name].push( bezier );

                            createSideCoords( point2, point2, name );
                        }
                    }
                    else {
                        //cut & cut
                        newPoints[name].push( point2.x );
                        newPoints[name].push( point2.y );

                        createSideCoords( point2, point2, name );
                    }
                }
            }

            newPoints[name].unshift( newPoints[name].pop() );
            newPoints[name].unshift( newPoints[name].pop() );

        }

        for ( var index in newPoints ) {

            var indici = [];
            var puncte = [];
            var uv = [];
            var normals = [];


            for ( var i = 0; i < newPoints[index].length; i += 2 ) {

                //PUNCTE
                puncte.push( newPoints[index][i] );
                puncte.push( 0 );
                puncte.push( newPoints[index][i + 1] );

                //INDICI
                if ( (i + 1) % 2 != 0 ) {
                    indici.push( parseInt( i / 2 ) );
                }

                //UVs
                var u = (newPoints[index][i] - UVdimension['p2']['x'] + parseFloat( points.svgDim.margin )) / w;                  //lungime
                var v = (newPoints[index][i + 1] - UVdimension['p2']['y'] + parseFloat( points.svgDim.margin )) / h + 1;                //inaltime

                uv.push( u );
                uv.push( - v );
            }
            // PUNCTE INDICI UV

            var earcut_points = newPoints[index];
            indici = earcut( earcut_points );

            var vertexData = new BABYLON.VertexData();
            BABYLON.VertexData.ComputeNormals( puncte, indici, normals );
            vertexData.positions = puncte;
            vertexData.indices = indici;
            vertexData.uvs = uv;


            var meshName = new BABYLON.Mesh( name_array[index] + "_copy", _scene );


            vertexData.applyToMesh( meshName );
            meshName.material = BackMaterial;

            var meshName_vertices = meshName.getTotalVertices();
            var meshName_indices = meshName.getTotalIndices();

            var mesh0_vertices = _scene.meshes[0].getTotalVertices();
            var mesh0_indices = _scene.meshes[0].getTotalIndices();


            var merge = BABYLON.Mesh.MergeMeshes( [_scene.meshes[0], meshName], true );

            var multimat = new BABYLON.MultiMaterial( "multi", _scene );
            multimat.subMaterials.push( FaceMaterial );
            multimat.subMaterials.push( BackMaterial );


            merge.material = multimat;

            merge.subMeshes = [];

            merge.subMeshes.push( new BABYLON.SubMesh( 0, 0, mesh0_vertices, 0, mesh0_indices, merge ) );
            merge.subMeshes.pop();
            merge.subMeshes.push( new BABYLON.SubMesh( 1, mesh0_vertices, meshName_vertices, mesh0_indices, meshName_indices, merge ) );
            merge.subMeshes.pop();


        }
    };

    var createCurveAdvanced = function() {

        var numberOfPoints = 8;
        var w = Math.abs( max_x - min_x );
        var h = Math.abs( max_y - min_y );
        if ( typeof points['svgDim'] !== 'undefined' ) {
            if ( typeof points['svgDim']['width'] !== 'undefined' ) {
                w = points['svgDim']['width'];
            }
        }
        if ( typeof points['svgDim'] !== 'undefined' ) {
            if ( typeof points['svgDim']['height'] !== 'undefined' ) {
                h = points['svgDim']['height'];
            }
        }
        var parent = 0;
        for(var name in curvePoints ){
            curveSides[name] = [];
            if(curvePoints[name].length > 0){
                var reset = curvePoints[name].length;
                for(var parser = 0 ; parser < curvePoints[name].length; parser++){
                    var coords1 = curvePoints[name][parser];
                    var coords2 = curvePoints[name][(parser+1) % reset];

                    if( isFold(coords1.origin, coords2.origin) && reset > 2){

                        if(getFoldDirection( coords1.origin, coords2.origin) === "Out"){

                            var quadraticBezierVectors = BABYLON.Curve3.CreateQuadraticBezier(
                                    new BABYLON.Vector3( coords1.destination.x, 0, coords1.destination.y ),
                                    new BABYLON.Vector3( coords1.control.x, coords1.control.y, coords1.control.z ),
                                    new BABYLON.Vector3( coords1.origin.x, thickness, coords1.origin.y ),

                                    numberOfPoints );
                            var curve1 = quadraticBezierVectors.getPoints();



                            var quadraticBezierVectors2 = BABYLON.Curve3.CreateQuadraticBezier(
                                    new BABYLON.Vector3( coords2.destination.x, 0, coords2.destination.y ),
                                    new BABYLON.Vector3( coords2.control.x, coords2.control.y, coords2.control.z ),
                                    new BABYLON.Vector3( coords2.origin.x, thickness, coords2.origin.y ),

                                    numberOfPoints );

                            var curve2 = quadraticBezierVectors2.getPoints();


                            var finalCurve = [];


                            for ( var i = 0; i < curve1.length; i ++ ) {
                                finalCurve.push (curve1[i].x);
                                finalCurve.push (curve1[i].y);
                                finalCurve.push (curve1[i].z);
                            }
                            for ( var i = 0; i < curve2.length; i ++ ) {
                                finalCurve.push( curve2[i].x );
                                finalCurve.push( curve2[i].y );
                                finalCurve.push( curve2[i].z );
                            }

                            var indici = [];
                            var next = curve1.length;
                            for(var i = 0 ; i < curve1.length-1 ; i++){
                                indici.push (i);
                                indici.push (i+next);
                                indici.push( i + next + 1 );
                                indici.push( i + next + 1 );
                                indici.push( i + 1 );
                                indici.push( i );
                            }

                            var finalCurve_no_y = [];

                            var uv = [];
                            var normals = [];
                            for(var i = 0 ; i < finalCurve.length - 1; i+=3){
                                finalCurve_no_y.push( finalCurve[i]);
                                finalCurve_no_y.push( finalCurve[i+2]);

                                //UVs
                                var u = (finalCurve[i] - min_x + parseFloat( points.svgDim.margin )) / w;                  //lungime
                                var v = (finalCurve[i + 2] - min_y + parseFloat( points.svgDim.margin )) / h + 1;                //inaltime

                                uv.push( u );
                                uv.push( - v );
                            }

                            // PUNCTE INDICI UV

                            var vertexData = new BABYLON.VertexData();
                            BABYLON.VertexData.ComputeNormals( finalCurve, indici, normals );
                            vertexData.positions = finalCurve;
                            vertexData.indices = indici;
                            vertexData.uvs = uv;


                            var meshName = new BABYLON.Mesh( scene.meshes[parent].name + "_curve", scene );


                            vertexData.applyToMesh( meshName );
                            meshName.material = BackMaterial;
                            meshName.parent = scene.meshes[parent];


                            createCurveSide(curve1, parent, name);
                            createCurveSide(curve2, parent, name);

                        }else
                            if ( getFoldDirection( coords1.origin, coords2.origin ) === "In" ){
                                var quadraticBezierVectors = BABYLON.Curve3.CreateQuadraticBezier(
                                        new BABYLON.Vector3( coords1.destination.x, thickness, coords1.destination.y ),
                                        new BABYLON.Vector3( coords1.origin.x, thickness, coords1.origin.y ),
                                        new BABYLON.Vector3( coords1.origin.x, 0, coords1.origin.y ),

                                        numberOfPoints );
                                var curve1 = quadraticBezierVectors.getPoints();


                                var quadraticBezierVectors2 = BABYLON.Curve3.CreateQuadraticBezier(
                                        new BABYLON.Vector3( coords2.destination.x, thickness, coords2.destination.y ),
                                        new BABYLON.Vector3( coords2.origin.x, thickness, coords2.origin.y ),
                                        new BABYLON.Vector3( coords2.origin.x, 0, coords2.origin.y ),

                                        numberOfPoints );

                                var curve2 = quadraticBezierVectors2.getPoints();


                                var finalCurve = [];


                                for ( var i = 0; i < curve1.length; i ++ ) {
                                    finalCurve.push( curve1[i].x );
                                    finalCurve.push( curve1[i].y );
                                    finalCurve.push( curve1[i].z );
                                }
                                for ( var i = 0; i < curve2.length; i ++ ) {
                                    finalCurve.push( curve2[i].x );
                                    finalCurve.push( curve2[i].y );
                                    finalCurve.push( curve2[i].z );
                                }

                                var indici = [];
                                var next = curve1.length;
                                for ( var i = 0; i < curve1.length - 1; i ++ ) {
                                    indici.push( i );
                                    indici.push( i + next );
                                    indici.push( i + next + 1 );
                                    indici.push( i + next + 1 );
                                    indici.push( i + 1 );
                                    indici.push( i );
                                }

                                var finalCurve_no_y = [];

                                var uv = [];
                                var normals = [];
                                for ( var i = 0; i < finalCurve.length - 1; i += 3 ) {
                                    finalCurve_no_y.push( finalCurve[i] );
                                    finalCurve_no_y.push( finalCurve[i + 2] );

                                    //UVs
                                    var u = (finalCurve[i] - min_x + parseFloat( points.svgDim.margin )) / w;                  //lungime
                                    var v = (finalCurve[i + 2] - min_y + parseFloat( points.svgDim.margin )) / h + 1;                //inaltime

                                    uv.push( u );
                                    uv.push( - v );
                                }

                                // PUNCTE INDICI UV

                                var vertexData = new BABYLON.VertexData();
                                BABYLON.VertexData.ComputeNormals( finalCurve, indici, normals );
                                vertexData.positions = finalCurve;
                                vertexData.indices = indici;
                                vertexData.uvs = uv;


                                var meshName = new BABYLON.Mesh( scene.meshes[parent].name + "_curve", scene );


                                vertexData.applyToMesh( meshName );
                                meshName.material = FaceMaterial;
                                meshName.parent = scene.meshes[parent];


                                createCurveSide( curve1, parent, name );
                                createCurveSide( curve2, parent, name );
                        }

                    }else if( isFold( coords1.origin, coords2.origin) && reset === 2){

                        if ( getFoldDirection( coords1.origin, coords2.origin ) === "Out" ) {

                            var quadraticBezierVectors = BABYLON.Curve3.CreateQuadraticBezier(
                                    new BABYLON.Vector3( coords1.destination.x, 0, coords1.destination.y ),
                                    new BABYLON.Vector3( coords1.control.x, coords1.control.y, coords1.control.z ),
                                    new BABYLON.Vector3( coords1.origin.x, thickness, coords1.origin.y ),

                                    numberOfPoints );
                            var curve1 = quadraticBezierVectors.getPoints();


                            var quadraticBezierVectors2 = BABYLON.Curve3.CreateQuadraticBezier(
                                    new BABYLON.Vector3( coords2.destination.x, 0, coords2.destination.y ),
                                    new BABYLON.Vector3( coords2.control.x, coords2.control.y, coords2.control.z ),
                                    new BABYLON.Vector3( coords2.origin.x, thickness, coords2.origin.y ),

                                    numberOfPoints );

                            var curve2 = quadraticBezierVectors2.getPoints();


                            var finalCurve = [];

                            for ( var i = 0; i < curve1.length; i ++ ) {
                                finalCurve.push( curve1[i].x );
                                finalCurve.push( curve1[i].y );
                                finalCurve.push( curve1[i].z );
                            }
                            for ( var i = 0; i < curve2.length; i ++ ) {
                                finalCurve.push( curve2[i].x );
                                finalCurve.push( curve2[i].y );
                                finalCurve.push( curve2[i].z );
                            }

                            var indici = [];
                            var next = curve1.length;
                            for ( var i = 0; i < curve1.length - 1; i ++ ) {
                                indici.push( i );
                                indici.push( i + next );
                                indici.push( i + next + 1 );
                                indici.push( i + next + 1 );
                                indici.push( i + 1 );
                                indici.push( i );
                            }

                            var finalCurve_no_y = [];

                            var uv = [];
                            var normals = [];
                            for ( var i = 0; i < finalCurve.length - 1; i += 3 ) {
                                finalCurve_no_y.push( finalCurve[i] );
                                finalCurve_no_y.push( finalCurve[i + 2] );

                                //UVs
                                var u = (finalCurve[i] - min_x + parseFloat( points.svgDim.margin )) / w;                  //lungime
                                var v = (finalCurve[i + 2] - min_y + parseFloat( points.svgDim.margin )) / h + 1;                //inaltime

                                uv.push( u );
                                uv.push( - v );
                            }

                            // PUNCTE INDICI UV

                            var vertexData = new BABYLON.VertexData();
                            BABYLON.VertexData.ComputeNormals( finalCurve, indici, normals );
                            vertexData.positions = finalCurve;
                            vertexData.indices = indici;
                            vertexData.uvs = uv;


                            var meshName = new BABYLON.Mesh( scene.meshes[parent].name + "_curve", scene );


                            vertexData.applyToMesh( meshName );
                            meshName.material = BackMaterial;
                            meshName.parent = scene.meshes[parent];

                            createCurveSide( curve1, parent, name );
                            createCurveSide( curve2, parent, name );


                        }
                        else if ( getFoldDirection( coords1.origin, coords2.origin ) === "In" ) {
                            var quadraticBezierVectors = BABYLON.Curve3.CreateQuadraticBezier(
                                    new BABYLON.Vector3( coords1.destination.x, thickness, coords1.destination.y ),
                                    new BABYLON.Vector3( coords1.origin.x, thickness, coords1.origin.y ),
                                    new BABYLON.Vector3( coords1.origin.x, 0, coords1.origin.y ),

                                    numberOfPoints );
                            var curve1 = quadraticBezierVectors.getPoints();


                            var quadraticBezierVectors2 = BABYLON.Curve3.CreateQuadraticBezier(
                                    new BABYLON.Vector3( coords2.destination.x, thickness, coords2.destination.y ),
                                    new BABYLON.Vector3( coords2.origin.x, thickness, coords2.origin.y ),
                                    new BABYLON.Vector3( coords2.origin.x, 0, coords2.origin.y ),

                                    numberOfPoints );

                            var curve2 = quadraticBezierVectors2.getPoints();


                            var finalCurve = [];


                            for ( var i = 0; i < curve1.length; i ++ ) {
                                finalCurve.push( curve1[i].x );
                                finalCurve.push( curve1[i].y );
                                finalCurve.push( curve1[i].z );
                            }
                            for ( var i = 0; i < curve2.length; i ++ ) {
                                finalCurve.push( curve2[i].x );
                                finalCurve.push( curve2[i].y );
                                finalCurve.push( curve2[i].z );
                            }

                            var indici = [];
                            var next = curve1.length;
                            for ( var i = 0; i < curve1.length - 1; i ++ ) {
                                indici.push( i );
                                indici.push( i + next );
                                indici.push( i + next + 1 );
                                indici.push( i + next + 1 );
                                indici.push( i + 1 );
                                indici.push( i );
                            }

                            var finalCurve_no_y = [];

                            var uv = [];
                            var normals = [];
                            for ( var i = 0; i < finalCurve.length - 1; i += 3 ) {
                                finalCurve_no_y.push( finalCurve[i] );
                                finalCurve_no_y.push( finalCurve[i + 2] );

                                //UVs
                                var u = (finalCurve[i] - min_x + parseFloat( points.svgDim.margin )) / w;                  //lungime
                                var v = (finalCurve[i + 2] - min_y + parseFloat( points.svgDim.margin )) / h + 1;                //inaltime

                                uv.push( u );
                                uv.push( - v );
                            }

                            // PUNCTE INDICI UV

                            var vertexData = new BABYLON.VertexData();
                            BABYLON.VertexData.ComputeNormals( finalCurve, indici, normals );
                            vertexData.positions = finalCurve;
                            vertexData.indices = indici;
                            vertexData.uvs = uv;

                            var meshName = new BABYLON.Mesh( scene.meshes[parent].name + "_curve", scene );

                            vertexData.applyToMesh( meshName );
                            meshName.material = FaceMaterial;
                            meshName.parent = scene.meshes[parent];

                            createCurveSide( curve1, parent, name );
                            createCurveSide( curve2, parent, name );
                        }
                        break;
                    }
                }
            }
            parent++;
        }
    };

    var createParentsAdvanced = function() {

        var parents_index = [];

        for ( var name in points['points'] ) {
            if ( typeof (points['points'][name][0]) != 'string' ) {
                points['points'][name].unshift( 'noParent' );
            }
            parents_index.push( points['points'][name][0] );
        }

        var copy_;
        // PARENTS FOR EACH MESH
        for ( var pars = 0; pars < name_array.length; pars ++ ) {
            if ( meshesParents[pars] != 'noParent' ) {
                for ( var index in _scene.meshes ) {


                    if ( meshesParents[pars] == _scene.meshes[index].name.replace( "_merged", "" ) ) {
                        copy_ = _scene.meshes[index];
                        break;
                    }
                }
                _scene.meshes[pars].parent = copy_;
            }
        }
    };

    var createPivotAxisAdvanced = function() {

        for ( var name in points['points'] ) {

            if ( typeof points['points'][name][0] === 'string' ) {
                points['points'][name].shift();
            }

        }

        for ( var index = 0; index < name_array.length; index ++ ) {

            var name = _scene.meshes[index].name.replace( "_merged", "" );

            var pivotx = points["axis"][name]["pivot"]['x'];
            var pivoty = points["axis"][name]["pivot"]['y'];


            var vx_ = points["axis"][name]["target"]['x'];
            var vz_ = points["axis"][name]["target"]['y'];

            var vx = vx_ - pivotx;
            var vz = vz_ - pivoty;

            var mv = Math.sqrt( Math.pow( vx, 2 ) + Math.pow( vz, 2 ) );//magnitude
            var quaternion = [vx / mv, 0, vz / mv];

            Engine3DVariables.meshes[name].axis.quaternion = [];
            Engine3DVariables.meshes[name].axis.quaternion[0] = quaternion[0];
            Engine3DVariables.meshes[name].axis.quaternion[1] = 0;
            Engine3DVariables.meshes[name].axis.quaternion[2] = quaternion[2];


            if ( Engine3DVariables.meshes[name].fold == "Out" ) {
                window.scene.meshes[index].setPivotMatrix( BABYLON.Matrix.Translation( - pivotx, - thickness, - pivoty ), true );
            }
            else {
                window.scene.meshes[index].setPivotMatrix( BABYLON.Matrix.Translation( - pivotx, 0, - pivoty ), true );
            }

            _scene.meshes[index].name = name;
        }
    };

    var createSidesAdvanced = function () {

    }

    var createSidesAdvanced = function() {

        var k = 0;
        var toMerge = [];
        var w = Math.abs( max_x - min_x );
        var h = Math.abs( max_y - min_y );
        if ( typeof points['svgDim'] !== 'undefined' ) {
            if ( typeof points['svgDim']['width'] !== 'undefined' ) {
                w = points['svgDim']['width'];
            }
        }
        if ( typeof points['svgDim'] !== 'undefined' ) {
            if ( typeof points['svgDim']['height'] !== 'undefined' ) {
                h = points['svgDim']['height'];
            }
        }

        for(var name in sideMeshes) {

            var sidePoints = [];
            var reset = sideMeshes[name].length;
            for(var index = 0 ; index < sideMeshes[name].length ; index++){

                var point1 = sideMeshes[name][index % reset];
                var point2 = sideMeshes[name][(index + 1) % reset];

                if(!isFold(point1.initial, point2.initial)){
                    sidePoints.push( point1.final.x);
                    sidePoints.push(0);
                    sidePoints.push( point1.final.y); //z

                    sidePoints.push( point1.final.x );
                    sidePoints.push( thickness );
                    sidePoints.push( point1.final.y ); //z

                    sidePoints.push( point2.final.x );
                    sidePoints.push( thickness );
                    sidePoints.push( point2.final.y ); //z

                    sidePoints.push( point2.final.x );
                    sidePoints.push( thickness );
                    sidePoints.push( point2.final.y ); //z

                    sidePoints.push( point2.final.x );
                    sidePoints.push( 0 );
                    sidePoints.push( point2.final.y ); //z

                    sidePoints.push( point1.final.x );
                    sidePoints.push( 0 );
                    sidePoints.push( point1.final.y ); //z


                    var uv = [];
                    var normals = [];
                    for ( var i = 0; i < sidePoints.length - 1; i += 3 ) {

                        //UVs
                        var u = (sidePoints[i] - min_x + parseFloat( points.svgDim.margin )) / w;                  //lungime
                        var v = (sidePoints[i + 2] - min_y + parseFloat( points.svgDim.margin )) / h + 1;                //inaltime

                        uv.push( u );
                        uv.push( - v );
                    }          // PUNCTE INDICI UV

                    var earcut_points = sidePoints;
                    var indici = earcut( earcut_points, null, 3 );
                    indici = [4, 0, 1, 4, 1, 3]; // TODO: hardcoded
                    var vertexData = new BABYLON.VertexData();
                    BABYLON.VertexData.ComputeNormals( sidePoints, indici, normals );
                    vertexData.positions = sidePoints;
                    vertexData.indices = indici;
                    vertexData.uvs = uv;


                    var meshName = new BABYLON.Mesh( scene.meshes[k].name + "_side_plane", scene );


                    vertexData.applyToMesh( meshName );
                    meshName.material = CartonMaterial;
                    meshName.parent = scene.meshes[k];
                    sidePoints = [];

                    toMerge.push(meshName);


                }
            }
            if(toMerge.length > 0 ) {
                var newMesh = BABYLON.Mesh.MergeMeshes( toMerge, true );
                toMerge = [];
                newMesh.parent = scene.meshes[k];
            }
            toMerge = [];
            k++;
        }

    };

    var updateMeshesAdvanced = function( result ) {

        points = result.points_only;
        prevPoints = points;

        while ( _scene.meshes.length != 0 ) {
            _scene.meshes[0].dispose();
        }

        meshesParents = [];
        curves_count = 0;
        axisPoints = []
        puncte_finale_sus = [];
        puncte_finale_jos = [];
        puncte_finale_sides = [];
        name_array = [];
        curve_parent = [];
        uvsCurve = [];
        toBuild_no_y = [];


        name_array = [];
        axisPoints = [];
        uvsCurve = [];

        min_x = Infinity;
        min_y = Infinity;
        max_x = - Infinity;
        max_y = - Infinity;

        createAxisPointsAdvanced();

        createMeshesAdvanced();

        createMeshesCopyAdvanced();

        createCurveAdvanced();

        createParentsAdvanced();

        createPivotAxisAdvanced();

        createSidesAdvanced();

        optimizeModel();

    };


    function MyLoadingScreen ( text ) {
        //init the loader
        this.loadingUIText = text;
    }

    MyLoadingScreen.prototype.displayLoadingUI = function() {
        //alert(this.loadingUIText);
        return;
    };

    MyLoadingScreen.prototype.hideLoadingUI = function() {
        //alert("Loaded!");
        return;
    };

    function Engine3D ( element, formElement, variables ) {

        this.element = $( element );
        this.formElement = $( formElement );
        this.data = variables.close_data;
        this.close_data = variables.close_data;
        this.meshes = variables.meshes;
        this.cameraSettings = variables.cameraSettings;
        this.animations = variables.animations;
        this.meshNames = variables.meshNames;
        this.animationButtons = $( '.animation-button' );
        this.flipButton = $( '.flip-button' );
        this.babylon = null;
        this.paramsStorage = {};
        this.reloadStorage = {};
        this.working = 0;
        var maxStage = 0;
        var minStage = 0;
        var stages = Object.keys( Engine3DVariables.animations );
        for ( var stage in stages ) {

            var tmp = stages[stage].split( " " );
            stage = parseInt( tmp[1] );
            if ( stage > maxStage ) {
                maxStage = stage;
            }
            if ( stage < minStage ) {
                minStage = stage;
            }
        }
        this.animation = {
            'status'   : 0,
            'state'    : 'next',
            'stage'    : 0,
            'maxstage' : maxStage,
            'minstage' : minStage
        };
        this.previousList = {};
        this.animValues = [];
    }

    Engine3D.prototype = {
        constructor          : Engine3D,
        loading              : function( flag ) {
            loaded = ! flag;
            var loading = $( '#loadingMask' );
            var body = $( 'body' );
            if ( flag ) {
                body.addClass( 'loading' );
                loading.show();
                
            }
            else {
                body.removeClass( 'loading' );
                loading.hide();

                if ( ! Object.keys( this.paramsStorage ).length == 0 ) {
                    this.changeParams( this.paramsStorage );
                    this.paramsStorage = {};
                }
                setTimeout(function () {
                    if (onMessageStorage.length !== 0) {
                        while (onMessageStorage.length > 0) {
                            let message = onMessageStorage.shift();
                            window.postMessage(message, "*");
                        }
                    }
                }, 500);
            }
        },
        loadModel            : function() {
            this.babylon = new BabylonModel( this.element.get( 0 ), this );
            this.initForm();
            this.babylon.startScene( () => {
                this.babylon.initScene(() => {
                    this.babylon.changeCameraTarget();
                    if (use_animation_buttons) {
                        this.initAnimationButtons();
                    } else {
                        this.initAnimationSlider();
                    }
                    this.loading( false );
                    // add entry delay
                    setTimeout(() => {
                        var open_btn = document.getElementById('animation_open');
                        open_btn && open_btn.click();
                    }, 1000);
                });
                this.babylon.initGlassMat( "Glass" );
                // this.babylon.changeCameraTarget(); //MOVED TO INIT CAMERA AS CALLBACK FOR MODEL SIZE CALCULATION
                this.babylon.changeInitialTexture();
                this.executeAnimation( this.animation.stage, "init", 1 );
                this.babylon.testHardwareScaling(window.scene);
                // this.setPickable();
            } );
        },
        setActiveControl: function( animationStage ) {
            if (use_animation_buttons) {
                $('.animation-btn').removeClass('active');
                var closedStage = 0;
                var openStage = open_animation_stage;
                var flatStage = Object.keys(Engine3DVariables.animations).length - 1;

                if (animationStage === closedStage) {
                    var close_btn = document.getElementById('animation_close');
                    close_btn.classList.add('active');
                } else if (animationStage === openStage) {
                    var open_btn = document.getElementById('animation_open');
                    open_btn.classList.add('active');
                } else if (animationStage === flatStage) {
                    var flat_btn = document.getElementById('animation_flat');
                    flat_btn.classList.add('active');
                }
            } else {
                var animationSlider = document.getElementById("AnimationSlider");
                animationSlider.value = animationStage;
            }
        },
        changeAnimationState : function( state, initial ) {
            if ( animation_running ) {

                return 0;
            }

            this.animation.state = state;
            var tmp = this.animation.stage;
            var previousStage = this.animation.stage;
            var init = 0;

            if ( typeof (initial) != 'undefined' && initial )
                init = 0;

            if ( init )
                this.data = this.close_data;
            if ( state == 'next' ) {
                tmp ++;
                if ( tmp > this.animation.maxstage )
                    return;
                this.animation.stage = tmp;
            }
            if ( state == 'previous' ) {
                tmp --;
                if ( tmp < this.animation.minstage )
                    return;
                this.animation.stage = tmp;
            }

            this.executeAnimation( this.animation.stage, previousStage, 0 );
            if ( init )
                this.importMeshes();


        },
        executeAnimation: function( stage, previousStage, noAnimation ) {

            if ( animation_running ) {
                return 0;
            }
            var reverse = (stage < previousStage);
            if ( ! reverse ) {
                var list = this.getModelAnimation( stage, this.animation.minstage );
            }
            else {
                var list = this.getModelAnimation( stage + 1, this.animation.minstage );
            }

            if ( previousStage == "init" ) {
                for ( var index in Engine3DVariables.meshNames ) {
                    var mesh = scene.getMeshByName( Engine3DVariables.meshNames[index] );
                    this.previousList[Engine3DVariables.meshNames[index]] = {};
                    this.previousList[Engine3DVariables.meshNames[index]]['position'] = {};
                    this.previousList[Engine3DVariables.meshNames[index]]['rotation'] = {};
                    this.previousList[Engine3DVariables.meshNames[index]]['position']['x'] = mesh.position.x;
                    this.previousList[Engine3DVariables.meshNames[index]]['position']['y'] = mesh.position.y;
                    this.previousList[Engine3DVariables.meshNames[index]]['position']['z'] = mesh.position.z;
                    this.previousList[Engine3DVariables.meshNames[index]]['rotation']['end'] = "0";
                    this.previousList[Engine3DVariables.meshNames[index]]['rotation']['lastSeen'] = "0.0";
                }
                previousStage = stage - 1;
                var first = 1;
                for ( var stageTmp in Engine3DVariables.animations ) {
                    var stageInt = stageTmp.split( " " );
                    stageInt = parseInt( stageInt[1] );
                    if ( typeof this.animValues[stageInt] == "undefined" )
                        this.animValues[stageInt] = [];
                    for ( var stepTmp in Engine3DVariables.animations[stageTmp] ) {
                        var stepInt = stepTmp.split( " " );
                        stepInt = parseInt( stepInt[1] );
                        if ( typeof this.animValues[stageInt][stepInt] == "undefined" ) {
                            this.animValues[stageInt][stepInt] = [];
                            this.animValues[stageInt][stepInt]['Rotation'] = [];
                            this.animValues[stageInt][stepInt]['Position'] = [];
                        }
                        var valRot = Engine3DVariables.animations[stageTmp][stepTmp]['Rotation'];
                        var valPos = Engine3DVariables.animations[stageTmp][stepTmp]['Position'];
                        for ( index in Engine3DVariables.meshNames ) {

                            var name = Engine3DVariables.meshNames[index];
                            if ( typeof this.animValues[stageInt][stepInt]['Rotation'][name] == "undefined" )
                                this.animValues[stageInt][stepInt]['Rotation'][name] = [];

                            if ( typeof this.animValues[stageInt][stepInt]['Position'][name] == "undefined" )
                                this.animValues[stageInt][stepInt]['Position'][name] = [];

                            var lastSeen = {};
                            lastSeen = {
                                stage : stageInt.toString(),
                                step  : stepInt.toString()
                            };

                            var lastSeenPos = {};
                            lastSeenPos = {
                                stage : stageInt.toString(),
                                step  : stepInt.toString()
                            };

                            if ( first ) {
                                if ( typeof valRot[name] == 'undefined' ) {
                                    lastSeen.value = "0";
                                }
                                else {
                                    lastSeen.value = valRot[name];
                                }
                            }
                            else {
                                if ( typeof valRot[name] == 'undefined' ) {
                                    var split = this.previousList[name]['rotation']['lastSeen'].split( "." );
                                    var tmpstage = parseInt( split[0] );
                                    var tmpstep = parseInt( split[1] );
                                    lastSeen.value = this.animValues[tmpstage][tmpstep]['Rotation'][name]['end'];
                                }
                                else {
                                    lastSeen.value = valRot[name];
                                }
                            }
                            this.animValues[stageInt][stepInt]['Rotation'][name]['end'] = lastSeen.value;
                            this.previousList[name]['rotation']['lastSeen'] = lastSeen.stage + "." + lastSeen.step;

                            if ( first ) {
                                if ( typeof valPos != 'undefined' ) {
                                    if ( typeof valPos[name] == 'undefined' ) {
                                        lastSeenPos.value = Engine3DVariables.meshNames[index]['position'];
                                    }
                                    else {
                                        lastSeenPos.value = valPos[name];
                                    }
                                }
                            }
                            else {
                                if ( typeof valPos != 'undefined' ) {
                                    if ( typeof valPos[name] == 'undefined' ) {
                                        var split = this.previousList[name]['position']['lastSeen'].split( "." );
                                        var tmpstage = parseInt( split[0] );
                                        var tmpstep = parseInt( split[1] );
                                        lastSeenPos.value = this.animValues[tmpstage][tmpstep]['Position'][name];
                                    }
                                    else {
                                        lastSeenPos.value = valPos[name];
                                    }
                                }
                                else {
                                    var split = this.previousList[name]['position']['lastSeen'].split( "." );
                                    var tmpstage = parseInt( split[0] );
                                    var tmpstep = parseInt( split[1] );
                                    lastSeenPos.value = this.animValues[tmpstage][tmpstep]["Position"][name];
                                }
                            }
                            if ( typeof lastSeenPos.value == 'undefined' && (first == 1) ) {
                                lastSeenPos.value = {
                                    "x" : this.previousList[Engine3DVariables.meshNames[index]]["position"]["x"].toString(),
                                    "y" : this.previousList[Engine3DVariables.meshNames[index]]["position"]["y"].toString(),
                                    "z" : this.previousList[Engine3DVariables.meshNames[index]]["position"]["z"].toString()
                                }
                            }
                            this.animValues[stageInt][stepInt]['Position'][name] = lastSeenPos.value;
                            this.previousList[name]['position']['lastSeen'] = lastSeenPos.stage + "." + lastSeenPos.step;
                        }
                        first = 0;
                    }
                }
            }

            this.babylon.animation( stage, this.animValues, {reverse : reverse, noAnimation : noAnimation} );
        },
        getModelAnimation    : function( stage, minstage ) {
            var result = {};
            var strStage = "Stage " + stage;
            $.each( Engine3DVariables.animations[strStage], (function( result, stage ) {
                return function( step, data ) {
                    var step = step.split( " " );
                    step = parseInt( step[1] );
                    result[step] = {};
                    if ( data.hasOwnProperty( 'Rotation' ) ) {
                        var rotation = data['Rotation'];
                        for ( name in rotation ) {
                            if ( stage < minstage ) {
                                result[step][name] = {
                                    "stage"       : "0",
                                    "noAnimation" : 1,
                                    "end"         : "0"
                                }
                            }
                            else {
                                if ( typeof (result[step][name]) == "undefined" ) {
                                    result[step][name] = {};
                                }
                                result[step][name]['rotation'] = {};
                                result[step][name]['rotation']['end'] = rotation[name];
                            }
                        }
                    }
                    if ( data.hasOwnProperty( 'Position' ) ) {
                        var position = data['Position'];
                        for ( name in position ) {
                            if ( stage < minstage ) {
                                result[step][name] = {
                                    "stage"       : "0",
                                    "noAnimation" : 1,
                                    "x"           : "0",
                                    "y"           : "0",
                                    "z"           : "0"
                                }
                            }
                            else {
                                if ( typeof (result[step][name]) == "undefined" ) {
                                    result[step][name] = {};
                                }
                                result[step][name]['position'] = {};
                                result[step][name]['position']['x'] = position[name]['x'];
                                result[step][name]['position']['y'] = position[name]['y'];
                                result[step][name]['position']['z'] = position[name]['z'];
                            }
                        }
                    }
                }
            })( result, stage ) );
            return result;
        },
        flipMesh             : function( state ) {
            this.babylon.flipMesh( this.animation );
        },
        initForm             : function() {
            this.formElement.submit( (function( that ) {
                return function( e ) {
                    e.preventDefault();
                    that.changeParams( $( this ).serializeArray() );
                };
            })( this ) );
        },
        reloadModel          : function( params ) {
            if (!params && this.reloadStorage) {
                params = this.reloadStorage;
            }
            this.loading( true );
            var that = this;
            if ( ! that.working ) {
                that.working = 1;
                var data = params;
                var success = (function( that, params ) {
                    return function( result ) {

                        if ( result.hasOwnProperty( 'stats' ) && result.stats == 'fail' )
                            return;
                        that.close_data = result.close_data;
                        that.meshes = result.meshes;
                        that.cameraTarget = result.cameraTarget;
                        Engine3DVariables.thickness = result.thickness;

                        Engine3DVariables.cameraTarget = result.cameraTarget;
                        variables = result.variables;

                        that.data = that.close_data;

                        if ( STANDARD_MODEL == true )
                            updateMeshesStandard( result );
                        else if ( STANDARD_MODEL == false )
                            updateMeshesAdvanced( result );


                        // that.babylon.changeCameraTarget();
                        that.executeAnimation(that.animation.stage, that.animation.stage-1, 1);
                        that.babylon.initLights();
                        // that.setPickable();

                    }
                })( that, params );
                var fail = (function( that ) {
                    return function( xhr, status, errorThrown ) {
                    }
                })( that );
                var always = (function( that ) {
                    return function() {
                        that.working = 0;
                        that.loading( false );
                    }
                })( that );
                that.getModelData( data, success, fail, always );
            }
        },
        changeParams         : function( params ) {
            if ( ! loaded ) {
                this.paramsStorage = params;
            }
            else {
                this.reloadStorage = params;
                this.loading( true );
                var that = this;
                if ( ! that.working ) {
                    that.working = 1;
                    var data = params;
                    var success = (function( that, params ) {
                        return function( result ) {

                            if ( result.hasOwnProperty( 'stats' ) && result.stats == 'fail' )
                                return;
                            that.close_data = result.close_data;
                            that.meshes = result.meshes;
                            that.cameraTarget = result.cameraTarget;
                            Engine3DVariables.thickness = result.thickness;
                            Engine3DVariables.cameraTarget = result.cameraTarget;
                            thickness = parseFloat( result.thickness );
                            variables = result.variables;

                            that.data = that.close_data;

                            // that.importMeshes();

                            if ( params.outsideTexture ) {

                                var path = texturesUrl;
                                if ( ! isProof ) {
                                    path += params.outsideTexture;
                                }
                                else {
                                    path = params.outsideTexture;
                                }
                                var outsideMat = window.scene.getMaterialByName( "BackMaterial" );
                                outsideMat.diffuseTexture = new BABYLON.Texture( path, window.scene );
                            }

                            if ( params.insideTexture ) {
                                var path = texturesUrl;
                                path += params.insideTexture;
                                var insideMat = window.scene.getMaterialByName( "FaceMaterial" );
                                insideMat.diffuseTexture = new BABYLON.Texture( path, window.scene );
                            }

                            if ( STANDARD_MODEL == true )
                                updateMeshesStandard( result );
                            else if ( STANDARD_MODEL == false )
                                updateMeshesAdvanced( result );


                            updateCamera();

                            let light = scene.getLightByID("Hemi1");
                            if (light) {
                                let target = getCameraTarget();
                                light.position = new BABYLON.Vector3( target.x, 0, target.z );
                            }
                            // that.babylon.changeCameraTarget();
                            that.executeAnimation( that.animation.stage, that.animation.stage - 1, 1 );
                            that.babylon.initLights();


                        }
                    })( that, params );
                    var fail = (function( that ) {
                        return function( xhr, status, errorThrown ) {
                        }
                    })( that );
                    var always = (function( that ) {
                        return function() {
                            that.working = 0;
                            that.loading( false );
                        }
                    })( that );
                    that.getModelData( data, success, fail, always );
                }
            }
        },
        initAnimationSlider : function() {
            var animationSlider = document.getElementById("AnimationSlider");
            animationSlider.max = this.animation.maxstage;
            animationSlider.min = 0;
            animationSlider.value = 0;
            var previousValue = 0;
            var _this = this;

            animationSlider.onclick = animationSlider.ontouchstart = animationSlider.onmousedown = ()=>{
                window.animationDuration = 300;
                PanelSelector.setDefaultCameraPosition();
                PanelSelector.removeAnimationListener();
            }
            animationSlider.onchange = function () {
                _this.babylon.multiSequenceAnimation(previousValue * 1, this.value * 1, _this.animValues, {});
                previousValue = this.value;
                current_stage = this.value;
                animationSlider.disabled = true;
            }

            this.animationButtons.off( 'click' ).on( 'click', (function( that ) {
                return function() {
                    var _self = $( this );
                    if ( _self.closest( '.loading' ).length )
                        return;
                    var state = _self.data( 'state' );
                    that.changeAnimationState( state );
                }
            })( this ) )
        },
        initAnimationButtons : function() {
            var _this = this;
            var closed_stage = this.animation.minstage;
            var open_stage = open_animation_stage;
            var flat_stage = this.animation.maxstage;

            var close_btn = document.getElementById('animation_close');
            var open_btn = document.getElementById('animation_open');
            var flat_btn = document.getElementById('animation_flat');

            window.setAnimationStage = function (stage) {
                _this.babylon.multiSequenceAnimation(_this.animation.stage * 1, stage * 1, _this.animValues, {});
                _this.animation.stage = stage;
                current_stage = stage;
            }

            var animationButtonClickHandler = function(stage_number, type) {
                return function (e) {
                    if (e.currentTarget.classList.contains('active')) {
                        return;
                    }

                    $('.animation-btn').removeClass('active').prop('disabled', true);
                    e.currentTarget.classList.add('active');
                    window.setAnimationStage(stage_number);
                    window.top.postMessage({
                        'isAnimating': true,
                        'stage': stage_number,
                        'click': true,
                        'type': type
                    }, "*");
                }
            }
            $(document).on("animationfinished", () => {
                window.top.postMessage({'isAnimating': false, 'stage': current_stage}, "*");
            });
            close_btn.addEventListener('click', animationButtonClickHandler(closed_stage, 'close-lid'));
            open_btn.addEventListener('click', animationButtonClickHandler(open_stage, 'open-lid'));
            if (flat_btn) {
                flat_btn.addEventListener('click', animationButtonClickHandler(flat_stage, 'flat'));
            }

            if (typeof pdp_widget != 'undefined' && pdp_widget) {
                open_btn.click();
            }
        },
        getModelData: function( data, success, fail, always ) {

            data['return_type'] = 'json';
            $.ajax( {
                url      : Engine3DVariables.getDataUrl,
                data     : data,
                type     : "POST",
                dataType : "json",
            } )
                    .done( function( json ) {
                        if ( typeof (success) == 'function' ) {
                            cachedModelData = json;
                            success( json );
                        }
                    } )
                    .fail( function( xhr, status, errorThrown ) {
                        if ( typeof (fail) == 'function' )
                            fail( xhr, status, errorThrown );
                    } )
                    .always( function( data ) {
                        if ( typeof (always) == 'function' )
                            always( data );
                    } );
        },
        // setPickable          : function() {
        //     for ( var i = 0; i < scene.meshes.length; i ++ ) {
        //         if ( scene.meshes[i].name != "ground" && scene.meshes[i].name.search( "_merged" ) == - 1 && scene.meshes[i].name.search( "_curveWithUV" ) == - 1 ) {
        //             scene.meshes[i].isPickable = true;
        //         }
        //         else scene.meshes[i].isPickable = false;
        //     }
        //     var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI( "UI" );
        //     if ( meshTextBox instanceof BABYLON.GUI.TextBlock ) {
        //         //do nothing;
        //     }
        //     else {
        //         meshTextBox = new BABYLON.GUI.TextBlock();
        //         meshTextBox.text = "Mesh name";
        //         meshTextBox.color = "#2140AA";
        //         meshTextBox.fontSize = 24;
        //         meshTextBox.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        //         meshTextBox.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        //         meshTextBox.top = 10;
        //         meshTextBox.left = 10;
        //         advancedTexture.addControl( meshTextBox );
        //
        //         scene.onPointerDown = function( evt, pickResult ) {
        //             if ( pickResult.hit ) {
        //                 meshTextBox.text = pickResult.pickedMesh.name;
        //                 console.log( pickResult.pickedMesh );
        //             }
        //         };
        //     }
        // }
    };

    var model = new Engine3D( '#renderCanvas', '#modelSizeForm', Engine3DVariables );

    const initChangeModelDetails = function() {
        const container = $( "#modelDetails" );
        const checkboxElement = container.find( "#modelDetailsOption" );

        checkboxElement.off( "change" ).on( "change", ( event ) => {
            const val = checkboxElement.prop( "checked" )
            STANDARD_MODEL = ! val;
            model.reloadModel();
        } )
    };

    window.addEventListener( "DOMContentLoaded", function() {
        model.loadModel();
        initChangeModelDetails();
    });

    let animateCameraPosition = function (position) {
        let current_position = arcCamera.position;
        let new_position = new BABYLON.Vector3(position.x, position.y, position.z);

        let ease = new BABYLON.CubicEase();
        ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        BABYLON.Animation.CreateAndStartAnimation('animateCameraPos', cameraFocusController, 'position', 30, 120, current_position, new_position, 0, ease);
    }

    let enableMeasurementGuides = function () {
        if (!Engine3DVariables.enableMeasurementGuides) return;

        for (var index in measurementGuidePlaneText) {
            measurementGuidePlaneText[index].setEnabled(true);
        }
        linesystem.setEnabled(true);
    }

    let disableMeasurementGuides = function () {
        if (!Engine3DVariables.enableMeasurementGuides) return;
        
        for (var index in measurementGuidePlaneText) {
            measurementGuidePlaneText[index].setEnabled(false);
        }
        linesystem.setEnabled(false);
    }

    var OnMessage = function( e ) {
        if ( ! loaded ) {
            onMessageStorage.push(e.data);
        }
        else {
            if ( e.data.length ) {
                var _data = jQuery.parseJSON( e.data );
                if ( _data.texture ) {
                    for ( var j in _data.texture ) {
                       if (typeof( _data.lamination) != 'undefined' && _data.lamination.length) {

						$.lamination = new Image();
						$.lamination.src = _data.lamination[0];

						$.lamination.onload = function () {
                                var _rand = Math.random();
                                var _time = Date.now();
                                var _tmpIndex = _data.texture[j][0].split( '.' );
                                var x = new BABYLON.Texture( 'data:image_' + _rand + '_' + _time + 'jpeg', window.scene, undefined, undefined, undefined, function() {
                                    window.scene.multiMaterials[_tmpIndex[0]].subMaterials[_tmpIndex[1]].specularTexture = x;
							}, undefined, _data.lamination[0]);


                            }
                        }
                        else {
                            var _tmpIndex = _data.texture[j][0].split( '.' );
                            window.scene.multiMaterials[_tmpIndex[0]].subMaterials[_tmpIndex[1]].specularTexture = null;
                            window.parent.$( '.btn_refresh_refinement_bump' ).removeClass( 'disabled' );
                        }
					if (typeof( _data.bump) != 'undefined' && _data.bump.length) {

						$.bump = new Image();
						$.bump.src = _data.bump[0];

						$.bump.onload = function () {
                                var _rand = Math.random();
                                var _time = Date.now();

                                var _tmpIndex = _data.texture[j][0].split( '.' );
                                var x = new BABYLON.Texture( 'data:image_' + _rand + '_' + _time + 'jpeg', window.scene, undefined, undefined, undefined, function() {
                                    window.scene.multiMaterials[_tmpIndex[0]].subMaterials[_tmpIndex[1]].bumpTexture = x;
							}, undefined, _data.bump[0]);


                            }
                        }
                        else {
                            var _tmpIndex = _data.texture[j][0].split( '.' );
                            window.scene.multiMaterials[_tmpIndex[0]].subMaterials[_tmpIndex[1]].bumpTexture = null;

                        }
                        if ( typeof (_data.image) != 'undefined' && _data.image.length ) {
                            $.image = new Image();
                            $.image.src = _data.image[_data.texture[j][1] - 1];
                            $.image.onload = function() {
                                var _rand = Math.random();
                                var _time = Date.now();

                                if ( _data.texture[j][0].indexOf( '.' ) >= 0 ) {
                                    var _tmpIndex = _data.texture[j][0].split( '.' );
                                    var x = new BABYLON.Texture( 'data:image_' + _rand + '_' + _time + 'jpeg', window.scene, undefined, undefined, undefined, function() {
                                        window.scene.multiMaterials[_tmpIndex[0]].subMaterials[_tmpIndex[1]].diffuseTexture = x;
                                    }, undefined, _data.image[_data.texture[j][1] - 1] );
                                }
                                else {
                                    var x = new BABYLON.Texture( 'data:image_' + _rand + '_' + _time + 'jpeg', window.scene, undefined, undefined, undefined, function() {
                                        window.scene.meshes[_data.texture[j][0]].material.diffuseTexture = x;
                                    }, undefined, _data.image[_data.texture[j][1] - 1] );
                                }
                            }
                        }
                    }
                }
                if ( _data.changeDimension ) {
                    model.changeParams( _data.changeDimension );
                }
                if ( _data.reloadModel ) {
                    model.reloadModel( _data.reloadModel );
                }
                if ( _data.texture_upload ) {
                    for ( var j in _data.texture_upload ) {
                        if ( _data.texture_upload[j][0].indexOf( '.' ) >= 0 ) {
                            var _tmpIndex = _data.texture_upload[j][0].split( '.' );
                            window.scene.multiMaterials[_tmpIndex[0]].subMaterials[_tmpIndex[1]].diffuseTexture = new BABYLON.Texture( _data.image[_data.texture_upload[j][1] - 1], window.scene );
                        }
                        else {
                            window.scene.multiMaterials[_data.texture_upload[j][0]].diffuseTexture = new BABYLON.Texture( _data.image[_data.texture_upload[j][1] - 1], window.scene );
                            window.scene.multiMaterials[_data.texture_upload[j][0]].emissiveTexture = new BABYLON.Texture( _data.image[_data.texture_upload[j][1] - 1], window.scene );
                        }
                    }
                }
                if (_data.animation_click) {
                    if( _data.animation_click == "forward" ) {
                        document.getElementById("AnimationClose").click();
                    }
                    else if( _data.animation_click == "backward" ) {
                        document.getElementById("AnimationOpen").click();
                    }
                }
               
                if (_data.set_3d_screenshot_stage) {
                    let animationStage = _data.animation_stage ? _data.animation_stage : 0;
                    current_stage = animationStage;
                    model.setActiveControl(animationStage);
                    window.stopPanelAnimation().then(() => {
                        PanelSelector.setDefaultTarget();
                        PanelSelector.removeAnimationListener();
                        scene.activeCamera.alpha = _data.camera ? parseFloat(_data.camera.x) : Math.PI / 1.5;
                        scene.activeCamera.beta = _data.camera ? parseFloat(_data.camera.y) : Math.PI / 2.5;
                        scene.activeCamera.radius = _data.camera ? parseFloat(_data.camera.z) : onload_radius / 1.5;
                        animation_sequence_active = false;
                        model.babylon.multiSequenceAnimation((animationStage * 1), (animationStage * 1), model.animValues, { noAnimation: 1 });
                        disableMeasurementGuides();
                        this.scene.onAfterRenderObservable.addOnce(async () => {
                            model.babylon.engine.flushFramebuffer();
                                
                            BABYLON.Tools.CreateScreenshotUsingRenderTarget(model.babylon.engine, arcCamera, { width: 500, height: 500 }, function (data) {
                                e.source.postMessage(data, e.origin);
                                scene.activeCamera.radius = onload_radius;
                                setTimeout(function () {
                                    enableMeasurementGuides();
                                }, 100);
                            });
                        });
                    });
                }
                
                if (_data.default_3d_data) {
                    let animationStage = _data.default_3d_data.animation_stage ? _data.default_3d_data.animation_stage : 0;
                    current_stage = animationStage;
                    if (use_animation_buttons) {
                        $('.animation-btn').removeClass('active');
                        var closed_stage = 0;
                        var open_stage = open_animation_stage;
                        var flat_stage = Object.keys(Engine3DVariables.animations).length - 1;

                        if (animationStage === closed_stage) {
                            var close_btn = document.getElementById('animation_close');
                            close_btn.classList.add('active');
                        } else if (animationStage === open_stage) {
                            var open_btn = document.getElementById('animation_open');
                            open_btn.classList.add('active');
                        } else if (animationStage === flat_stage) {
                            var flat_btn = document.getElementById('animation_flat');
                            flat_btn.classList.add('active');
                        }
                    } else {
                        var animationSlider = document.getElementById("AnimationSlider");
                        animationSlider.value = animationStage;
                    }

                    let camera_x = _data.default_3d_data.camera.x ? _data.default_3d_data.camera.x : -3.5;
                    let camera_y = _data.default_3d_data.camera.y ? _data.default_3d_data.camera.y : 325;
                    let camera_z = _data.default_3d_data.camera.z ? _data.default_3d_data.camera.z : 1136.76;

                    let camera_position = new BABYLON.Vector3(camera_x, camera_y, camera_z);
                    arcCamera.setPosition(camera_position);
                    model.babylon.multiSequenceAnimation((animationStage * 1), (animationStage * 1), model.animValues, { noAnimation: 1 });
                    animation_sequence_active = false;
                }

                if (_data.hide_animation_controls) {
                    document.querySelector('#animationsActions').classList.add('hide');
                    document.querySelector('#renderCanvas').classList.add('full-preview');
                }
                
                if (_data.hasOwnProperty('hide_animation_controls') && !_data.hide_animation_controls) {
                    document.querySelector('#animationsActions').classList.remove('hide');
                    document.querySelector('#renderCanvas').classList.remove('full-preview');
                }
              
                if (_data.disable_rotation) {
                    disableRotation = true;
                }
                
                if (_data.hasOwnProperty('disable_rotation') && !_data.disable_rotation) {
                    disableRotation = false;
                }

                if (_data.reset_animation) {
                    model.babylon.multiSequenceAnimation(0, 0, model.animValues, { noAnimation: 1 });
                    current_stage = 0;
                    if (use_animation_buttons) {
                        $('.animation-btn').removeClass('active');
                        var close_btn = document.getElementById('animation_close');
                        close_btn.classList.add('active');
                    } else {
                        var animationSlider = document.getElementById("AnimationSlider");
                        if (animationSlider.value != 0) {
                            animationSlider.value = 0;
                        }
                    }
                    animation_sequence_active = false;
                    if (onload_radius != null) {
                        arcCamera.radius = onload_radius;
                    }
                }

                if (_data.reset_camera) {
                    let original = new BABYLON.Vector3(-3.504608798639083, 324.9767497193353, 1136.7475151126378);
                    arcCamera.setPosition(original);
                }
    
                if (_data.get_camera) {
                    console.log('camera pos', arcCamera.position);
                }

                if (_data.download_snapshot) {
                    disableMeasurementGuides();
                    BABYLON.Tools.CreateScreenshotUsingRenderTarget(scene.getEngine(), scene.activeCamera, 400);
                    setTimeout(function () {
                        enableMeasurementGuides();
                    }, 100);
                }
                
                if (_data.messageIdentifier == 'focus-panel') {
                    try {
                        PanelSelector.setPanelToFocus(_data.meshID, _data.inside);
                    } catch {
                        PanelSelector.setDefaultCameraPosition();
                    }
                }
                
                if (_data.messageIdentifier == 'hover-panel') {
                    if (_data.meshID) {
                        PanelSelector.highlightPanel(PanelSelector.getMeshFromID(_data.meshID));
                    } else {
                        PanelSelector.removeMeshHighlight();
                    }
                }
                
                if (_data.hasOwnProperty('enablePanelSelector')) {
                    PanelSelector.enableHandlers(_data.enablePanelSelector);
                }

                if (_data.hasOwnProperty('animation_stage')) {
                    if(_data.animation_stage == "close") {
                        var close_btn = document.getElementById('animation_close');
                        close_btn && close_btn.click();
                    } else if(_data.animation_stage == "open") {
                        var open_btn = document.getElementById('animation_open');
                        open_btn && open_btn.click();
                    }
                }

                if (_data.threshold_multiplier) {
                    const threshold_multiplier = _data.threshold_multiplier;
                    const model_width = model_max_x - model_min_x;
                    const model_height = model_max_y - model_min_y;

                    if (model_height > model_width) {
                        arcCamera.radius = model_height * threshold_multiplier;
                    } else {
                        arcCamera.radius = model_width * threshold_multiplier;
                    }
                }
            }
        }
    };

    if ( window.addEventListener ) {  // all browsers except IE before version 9
        window.addEventListener( "message", OnMessage, false );
    }
    else {
        if ( window.attachEvent ) {   // IE before version 9
            window.attachEvent( "onmessage", OnMessage );
        }
    }
}
else {
    document.body.classList.add( "webGLDisabled" );
}
