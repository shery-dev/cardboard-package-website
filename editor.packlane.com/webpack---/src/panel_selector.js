const $ = jQuery;
// global properties
let enable_panel_selector = false;
let selected_panel;
let default_alpha;
let default_beta;
let default_radius;
let default_target;
let previous_animation = null;
let animation_active = false;
let blink_mesh_animator = {};
let previous_mesh_outline = null;
let previous_mesh_highlight = null;

// animation properties
const speed_ratio = 4;
const loop_mode = false;
const from_frame = 0;
const to_frame = 100;

var PanelSelector = function() {
    return this;
};
PanelSelector.prototype.engine3DModel = null;
PanelSelector.prototype.initPanelSelector = function(engine_3d_model) {
    if (!window.Engine3DVariables.preview) return;

    let preview_config = window.Engine3DVariables.preview.three_d;
    var slider = document.getElementById("AnimationSlider");
    let scene = window.scene;
    let arc_camera = scene.activeCamera;
    let bounding_box_renderer = scene.getBoundingBoxRenderer();
    default_alpha = arc_camera.alpha;
    default_beta = arc_camera.beta;
    default_radius = arc_camera.radius;
    default_target = arc_camera.target.clone();
    
    $(slider).on("change", () => {
        animation_active = true;
    });
    $(document).on("animationfinished", () => {
        animation_active = false;
    });
    bounding_box_renderer.backColor = new BABYLON.Color3.FromHexString(preview_config.outlineColor);
    bounding_box_renderer.frontColor = bounding_box_renderer.backColor;
    bounding_box_renderer.showBackLines = true;

    scene.onPointerObservable.add(function (evt) {
        var result = window.scene.pick(window.scene.pointerX, window.scene.pointerY, null, null, window.scene.activeCamera);
        let mesh = result.pickedMesh;
        
        if (mesh && mesh.name != 'ground') {
            window.top.postMessage({ "three_d_focus": result.pickedMesh.name });
        }

    },BABYLON.PointerEventTypes.POINTERTAP);

    PanelSelector.engine3DModel = engine_3d_model;
}

PanelSelector.prototype.setDefaultCameraPosition = function() {
    if (!enable_panel_selector) {
        return;
    }
    let engine_3d_variables = window.Engine3DVariables;
    animateCameraTo({
        id: engine_3d_variables.cameraSettings.cameraCenter,
        target: default_target,
        alpha: default_alpha,
        beta: default_beta,
        radius: default_radius,
        disableEdgesBlink: true
    });
}

PanelSelector.prototype.removeAnimationListener = function() {
    $(document).off("animationfinished", waitAnimationToFinish);
}

PanelSelector.prototype.highlightPanel = function(mesh) {
    if (!window.Engine3DVariables.preview) return;

    let is_mesh_child = String(mesh.name).match(/(_merged_)/);
    let is_highlighted = mesh && previous_mesh_highlight && mesh.name == previous_mesh_highlight.name;
    let preview_config = window.Engine3DVariables.preview.three_d;
    if (is_highlighted ||
        animation_active || !enable_panel_selector ||
        is_mesh_child) {
        return;
    } else if (!mesh) {
        PanelSelector.removeMeshHighlight();
        return;
    }
    PanelSelector.removeMeshHighlight();
    let scene = window.scene;
    let mesh_cl = mesh.clone();
    let sub_materials = mesh.material.subMaterials;

    // animation properties
    const speed_ratio = parseFloat(preview_config.highlightSpeedRatio);
    const loop_mode = false;
    const from_frame = 0;
    const to_frame = 100;

    mesh_cl.material = mesh.material.clone();
    mesh_cl.receiveShadows = false;
    previous_mesh_highlight = mesh_cl;
    previous_mesh_highlight.name = mesh.name;
    if (sub_materials) {
        sub_materials.forEach((org_material, idx) => {
            let material = org_material.clone();
            let color = new BABYLON.Color3.FromHexString(preview_config.highlightColor);
            mesh_cl.material.subMaterials[idx] = material;
            material.diffuseColor = color;
            material.diffuseTexture = null;
            material.specularColor = color;
            material.emissiveColor = color;
            material.disableLighting = true;
            material.animations = [
                createAnimation({
                    property: 'alpha',
                    from: 0,
                    to: parseFloat(preview_config.highlightAlpha)
                })
            ];
            scene.beginAnimation(material, from_frame, to_frame, loop_mode, speed_ratio);
        });
    }
}

PanelSelector.prototype.removeMeshHighlight = function() {
    if (previous_mesh_highlight) {
        previous_mesh_highlight.dispose();
        previous_mesh_highlight = null;
    }
}

PanelSelector.prototype.removeMeshOutline = function() {
    if (previous_mesh_outline) {
        previous_mesh_outline.dispose();
        previous_mesh_outline = null;
    }
}

PanelSelector.prototype.getActiveView = function (mesh, side, selected_stage) {
    let panel_data = Engine3DVariables.panelData;
    let panel_key = Object.keys(panel_data).find((key) => {
        return "mesh" + panel_data[key].mesh == mesh
    });
    selected_stage = parseInt(selected_stage);
    let lowest_diff = 0,
        closest_stage = selected_stage,
        value = null,
        is_default = false;

    try {
        Object.keys(panel_data[panel_key].activeView[side])
            .sort((a, b) => a - b)
            .forEach((stage, idx) => {
                let diff = Math.abs(stage - selected_stage);

                if (!idx || diff < lowest_diff) {
                    is_default = Boolean(diff);
                    closest_stage = stage;
                    lowest_diff = diff;
                }
            });
        
        value = panel_data[panel_key].activeView[side][closest_stage];
        value.default = is_default;
        value.stage = closest_stage;
    } catch {
        return null;
    }

    return value;
}

PanelSelector.prototype.setPanelToFocus = function(mesh_id, side) {
    if (!enable_panel_selector) {
        return;
    }
    let preview_config = window.Engine3DVariables.preview.three_d;
    let active_view = PanelSelector.getActiveView(
        mesh_id, 
        side == 0 ? 'outside' : 'inside', 
        current_stage
    );
    let arc_camera = scene.activeCamera;

    $(document).off("animationfinished", waitAnimationToFinish);
    PanelSelector.removeMeshHighlight();

    if (!mesh_id || !active_view) {
        PanelSelector.setDefaultCameraPosition();
        PanelSelector.removeMeshOutline();
        return;
    }
    
    const camera_position = {
        alpha: active_view.alpha,
        beta: active_view.beta,
        radius: arc_camera.radius,
        id: mesh_id
    };

    if (active_view.default) {
        window.animationDuration = parseFloat(preview_config.foldAnimationInterval);
        waitAnimationToFinish = (event) => {
            PanelSelector.setCameraPositionTo(camera_position);
            $(this).off(event);
        }

        if (window.stopPanelAnimation && current_stage != active_view.stage) {
            window.stopPanelAnimation();
            window.setAnimationStage(active_view.stage);
            PanelSelector.engine3DModel.setActiveControl(active_view.stage);
        } else {
            PanelSelector.setCameraPositionTo(camera_position);
        }
    } else {
        PanelSelector.setCameraPositionTo(camera_position);
    }

    $(document).on("animationfinished", waitAnimationToFinish);
}

PanelSelector.prototype.getMeshFromID = function(mesh_id) {
    let scene = window.scene;

    for (var index in scene.meshes) {
        if (scene.meshes[index].name == mesh_id) {
            return scene.meshes[index];
        }
    }

    return null;
}

PanelSelector.prototype.enableHandlers = function(value = true) {
    if (!window.Engine3DVariables.preview) return;
    
    let scene = window.scene;
    let ground = scene.getMeshByName('ground');
    let preview_config = window.Engine3DVariables.preview.three_d;
    if (value) {
        window.animationDuration = parseFloat(preview_config.selectPanelAnimationInterval);
        ground.isPickable = false;
    } else {
        window.animationDuration = parseFloat(preview_config.defaultAnimationInterval);
        ground.isPickable = true;
    }
    
    enable_panel_selector = value;
}

PanelSelector.prototype.setDefaultTarget = function() {
    let scene = window.scene;
    let arc_camera = scene.activeCamera;
    if (default_target) {
        arc_camera.setTarget(default_target.clone());
    }
}

PanelSelector.prototype.setCameraPositionTo = function({id, alpha, beta, radius}) {
    let scene = window.scene;
    let arc_camera = scene.activeCamera;
    let mesh = PanelSelector.getMeshFromID(id);

    arc_camera.animations = [
        createAnimation({
            property: "radius",
            from: arc_camera.radius,
            to: radius,
        }),
        createAnimation({
            property: "alpha",
            from: arc_camera.alpha,
            to: rotateTowards(arc_camera.alpha, alpha),
        }),
        createAnimation({
            property: "beta",
            from: arc_camera.beta,
            to: rotateTowards(arc_camera.beta, beta),
        })
    ];

    if (previous_animation) {
        previous_animation.stop();
    }

    let anim = scene.beginAnimation(arc_camera, from_frame, to_frame, loop_mode, speed_ratio);
    anim.onAnimationEnd = () => {
        blinkMeshOutline(mesh);
    }
    previous_animation = anim;
    return anim;
}

var PanelSelector = new PanelSelector();

function blinkMeshOutline(mesh) {
    let bounding_box_renderer = window.scene.getBoundingBoxRenderer();
    if (!enable_panel_selector) {
        return;
    }
    if (mesh && previous_mesh_outline && mesh.name == previous_mesh_outline.name) {
        return;
    }
    let preview_config = window.Engine3DVariables.preview.three_d;
    let keys = ['r', 'g', 'b'];
    let start_color = new BABYLON.Color3(1,1,1),
        end_color = new BABYLON.Color3.FromHexString(preview_config.outlineColor),
        animate = {};
    let mesh_cl = mesh.clone();
    let element_animator = blink_mesh_animator;
    PanelSelector.removeMeshOutline();
    mesh_cl.renderingGroupId = 2;
    mesh_cl.visibility = 0.0001;
    mesh_cl.showBoundingBox = true;
    mesh_cl.receiveShadows = false;
    previous_mesh_outline = mesh_cl;
    previous_mesh_outline.name = mesh.name;
    Object.assign(element_animator, start_color);
    for (var key of keys) {
        animate[key] = end_color[key];
    }
    $(element_animator).stop();
    $(element_animator).animate(animate, {
        duration: 100,
        step: () => {
            let { r, g, b } = element_animator;
            let color = new BABYLON.Color3(r, g, b);
            bounding_box_renderer.backColor = color;
            bounding_box_renderer.frontColor = color;
        },
        complete: () => {
            for (var key of keys) {
                animate[key] = start_color[key];
            }
            $(element_animator).animate(animate, {
                duration: 100,
                step: () => {
                    let { r, g, b } = element_animator;
                    let color = new BABYLON.Color3(r, g, b);
                    bounding_box_renderer.backColor = color;
                    bounding_box_renderer.frontColor = color;
                },
                complete: () => {
                    // remove after
                    mesh_cl.dispose();
                }
            });
        }
    });
}

function createAnimation({ property, from, to }) {
    const fps = 60;
    const ease = new BABYLON.CubicEase();
    ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

    const animation = BABYLON.Animation.CreateAnimation(
        property,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        fps,
        ease
    );
    animation.setKeys([
        {
            frame: 0,
            value: from,
        },
        {
            frame: 100,
            value: to,
        },
    ]);

    return animation;
}

function degToRadians(deg) {
    return deg * (Math.PI / 180);
}

function radiansToDeg(rad) {
    return rad * (180 / Math.PI);
}

function rotateTowards(current_angle, dest_angle) {
    var angle = radiansToDeg(current_angle);
    var dest_angle = radiansToDeg(dest_angle);
    let new_angle = dest_angle;
    let angle_diff;

    if (angle <= -1 && dest_angle >= 0) {
        new_angle = dest_angle - 360;
    } else if (angle >= 0 && dest_angle <= -1) {
        new_angle = 360 + dest_angle;
    }

    angle_diff = angle - new_angle;

    // When rotation angle is greater than 180, rotate the other way
    if (Math.abs(angle_diff) >= 180) {
        new_angle = dest_angle;
    }

    return degToRadians(new_angle);
}

function calculateCameraRadius(mesh) {
    let scene = window.scene;
    let engine = scene.getEngine();
    let arc_camera = scene.activeCamera;
    let center = mesh.getBoundingInfo().boundingBox.centerWorld;
    var size = mesh.getBoundingInfo().boundingBox.extendSizeWorld;
    var max_size = Math.max(size.x, size.z);
    var ratio = engine.getAspectRatio(arc_camera);
    var h = max_size / (Math.tan(arc_camera.fov / 2) * ratio);
    let radius = center.z + max_size * .9;

    return Math.max(h, radius);
}

function animateCameraTo({ id, alpha, beta, radius, disableEdgesBlink, target}) {
    let scene = window.scene;
    let mesh = PanelSelector.getMeshFromID(id);
    let center = mesh.getBoundingInfo().boundingBox.centerWorld;
    let arc_camera = scene.activeCamera;

    alpha = alpha == undefined ? 0 : alpha;
    beta = beta == undefined ? 0 : beta;
    radius = radius != undefined ? radius : calculateCameraRadius(mesh);

    arc_camera.animations = [
        createAnimation({
            property: "target.x",
            from: arc_camera.target.x,
            to: target ? target.x : center.x,
        }),
        createAnimation({
            property: "target.y",
            from: arc_camera.target.y,
            to: target ? target.y : center.y,
        }),
        createAnimation({
            property: "target.z",
            from: arc_camera.target.z,
            to: target ? target.z : center.z,
        }),
        createAnimation({
            property: "radius",
            from: arc_camera.radius,
            to: radius,
        }),
        createAnimation({
            property: "alpha",
            from: arc_camera.alpha,
            to: rotateTowards(arc_camera.alpha, alpha),
        }),
        createAnimation({
            property: "beta",
            from: arc_camera.beta,
            to: rotateTowards(arc_camera.beta, beta),
        })
    ];

    if (previous_animation) {
        previous_animation.stop();
    }

    let anim = scene.beginAnimation(arc_camera, from_frame, to_frame, loop_mode, speed_ratio);
    previous_animation = anim;
    anim.onAnimationEnd = () => {
        blinkMeshOutline(mesh);
    }
    mesh.refreshBoundingInfo();
    return anim;
}

let waitAnimationToFinish = function () {
    let panel = selected_panel;
    animateCameraTo(panel);
}

function getMeshActiveView(mesh_id) {
    let panels = Engine3DVariables.panelData;

    for (var key in panels) {
        if ('mesh' + panels[key].mesh == mesh_id) {
            return panels[key].activeView;
        }
    }
    return {};
}

// deepFind used to find value using path
function deepFind(path, dict) {
    let temp;

    for (var i = 0; i < path.length; i++) {
        let key = path[i];
        temp = !temp ? dict[key] : temp[key];

        if (!temp && i != path.length - 1) {
            return undefined;
        }
    }

    return temp;
}

export { PanelSelector };