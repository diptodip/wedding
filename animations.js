import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
let scene,  
  renderer,
  camera,
  model1,
  model2,
  neck,
  waist,
  mixer1,
  mixer2,
  dance1,
  dance2,
  clock = new THREE.Clock(),
  loaderAnim = document.getElementById('js-loader');

let percent = 0;
const textPath1 = document.querySelector("#text-path1");
const textPath2 = document.querySelector("#text-path2");
const h = document.documentElement, 
      b = document.body,
      st = 'scrollTop',
      sh = 'scrollHeight';

function init() {
  const YAOYAO = 'fortnite_yaoyao.glb';
  const GUAGUA = 'hiphop_guagua2.glb';
  const canvas = document.querySelector('#c');
  const backgroundColor = 0xe8ddda;
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 30 
  camera.position.x = 0;
  camera.position.y = -3;
  var loader = new GLTFLoader();
  loader.load(
    YAOYAO,
    function(gltf) {
      model1 = gltf.scene;
      let fileAnimations = gltf.animations;
      scene.add(model1);
      mixer1 = new THREE.AnimationMixer(model1);
      let danceAnim1 = THREE.AnimationClip.findByName(fileAnimations, 'Animation');
      let trimmedDanceAnim1 = THREE.AnimationUtils.subclip(danceAnim1, "Animation", 0, 200, 30.0);
      dance1 = mixer1.clipAction(trimmedDanceAnim1);
      dance1.play();
      model1.traverse(o => {
        if (o.isMesh) {
          o.receiveShadow = true;
        }
      });
      model1.scale.set(7, 7, 7);
      model1.position.y = -11;
      model1.position.x = 4;
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  loader.load(
    GUAGUA,
    function(gltf) {
      model2 = gltf.scene;
      model2.singleSided = false;
      let fileAnimations = gltf.animations;
      scene.add(model2);
      mixer2 = new THREE.AnimationMixer(model2);
      let danceAnim2 = THREE.AnimationClip.findByName(fileAnimations, 'Animation');
      let trimmedDanceAnim2 = THREE.AnimationUtils.subclip(danceAnim2, "Animation", 1, 200, 30.0);
      dance2 = mixer2.clipAction(trimmedDanceAnim2);
      dance2.play();
      model2.traverse(o => {
        if (o.isMesh) {
          o.receiveShadow = false;
          o.material.side = THREE.DoubleSide;
        }
      });
      model2.scale.set(0.07054, 0.07054, 0.07054);
      model2.position.y = -11;
      model2.position.x = -4;
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  loaderAnim.remove();
  let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);
  let d = 8.25 * 3;
  let dirLight = new THREE.DirectionalLight(0xffcccc, 0.94);
  dirLight.position.set(0, 12, 8);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 1500;
  dirLight.shadow.camera.left = d * -1;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = d * -1;
  scene.add(dirLight);
  let backLight = new THREE.DirectionalLight(0x00ccff, 0.94);
  backLight.position.set(0, -12, 8);
  backLight.castShadow = true;
  backLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  backLight.shadow.camera.near = 0.1;
  backLight.shadow.camera.far = 1500;
  backLight.shadow.camera.left = d * -1;
  backLight.shadow.camera.right = d;
  backLight.shadow.camera.top = d;
  backLight.shadow.camera.bottom = d * -1;
  scene.add(backLight);
  let coneGeometry1 = new THREE.ConeGeometry(4, 24, 64);
  let spotLightMaterial = new VolumetricSpotLightMaterial(0);
  let spotLight1 = new THREE.Mesh(coneGeometry1, spotLightMaterial);
  spotLight1.position.x = 0;
  scene.add(spotLight1);
  let floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
  let floorMaterial = new THREE.ShadowMaterial();
  floorMaterial.opacity = 0.2;
  let floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -0.5 * Math.PI;
  floor.receiveShadow = true;
  floor.position.y = -11;
  scene.add(floor);
  const fontLoader = new FontLoader();
  const font = fontLoader.load(
    "/noto_sans.json",
    function(font) { 
      const text = "囍";
      const size = 3;
      let textGeometry = new TextGeometry( text, {
    		font: font,
    		size: size,
    		depth: 0.5,
    		curveSegments: 10,
    		bevelEnabled: true,
    		bevelThickness: 0.5,
    		bevelSize: 0.1,
    		bevelOffset: 0,
    		bevelSegments: 1
    	} );
      let textMaterial = new THREE.MeshPhongMaterial({ color: 0xee3e3f, shininess: 100 }); // 0xf2ce2e
      let header = new THREE.Mesh(textGeometry, textMaterial);
      header.position.x = -size * 0.7;
      header.position.y = -size;
      header.position.z = -size;
      header.castShadow = true;
      header.receiveShadow = true;
      scene.add(header);
    },
    function(xhr) { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
    function(err) { console.log(err); }
  );
}

init();

function update() {
  let delta = clock.getDelta();
  if ((mixer1 != null) && (mixer2 != null)) {
    mixer1.update(delta);
    mixer2.update(delta);
  }
  percent += delta;
  percent = percent % 35.0;
  textPath1.setAttribute("startOffset", (-percent * 80) + 1200);
  textPath2.setAttribute("startOffset", (-percent * 80) + 1900);
  if (resizeSurface(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  renderer.render(scene, camera);
  requestAnimationFrame(update);
}

update();

function resizeSurface(renderer) {
  const canvas = renderer.domElement;
  let width = window.innerWidth;
  let height = window.innerHeight;
  let canvasPixelWidth = canvas.width / window.devicePixelRatio;
  let canvasPixelHeight = canvas.height / window.devicePixelRatio;

  const needResize =
    canvasPixelWidth !== width || canvasPixelHeight !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function VolumetricSpotLightMaterial(x) {
	var vertexShader	= [
		'varying vec3 vNormal;',
		'varying vec3 vWorldPosition;',
		
		'void main(){',
			'// compute intensity',
			'vNormal		= normalize( normalMatrix * normal );',

			'vec4 worldPosition	= modelMatrix * vec4( position, 1.0 );',
			'vWorldPosition		= worldPosition.xyz;',

			'// set gl_Position',
			'gl_Position	= projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
		'}',
	].join('\n');
	var fragmentShader = [
		'varying vec3		vNormal;',
		'varying vec3		vWorldPosition;',

		'uniform vec3		lightColor;',

		'uniform vec3		spotPosition;',

		'uniform float		attenuation;',
		'uniform float		anglePower;',
		'uniform float    strength;',

		'void main(){',
			'float intensity;',
			'intensity	= distance(vWorldPosition, spotPosition) / attenuation;',
			'intensity	= 1.0 - clamp(intensity, 0.0, 1.0);',
			'vec3 normal	= vec3(vNormal.x, vNormal.y, abs(vNormal.z));',
			'float angleIntensity	= pow( dot(normal, vec3(0.0, 0.0, 1.0)), anglePower );',
			'intensity	= strength * intensity * angleIntensity;',		
			'gl_FragColor	= vec4( lightColor, intensity);',
		'}',
	].join('\n');
	var material	= new THREE.ShaderMaterial({
		uniforms: { 
			attenuation	: {
				type	: "f",
				value	: 10.0
			},
			anglePower	: {
				type	: "f",
				value	: 0.5
			},
			strength	: {
				type	: "f",
				value	: 1.0
			},
			spotPosition		: {
				type	: "v3",
				value	: new THREE.Vector3(x, 0, -3)
			},
			lightColor	: {
				type	: "c",
				value	: new THREE.Vector3(1.0, 0.98, 0.83)
			},
		},
		vertexShader	: vertexShader,
		fragmentShader	: fragmentShader,
		// blending	: THREE.AdditiveBlending,
		transparent	: true,
		depthWrite	: false,
	});
	return material;
}
