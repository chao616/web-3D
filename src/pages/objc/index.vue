<template>
    <div class="home">
        <!-- <div class="mxcad" ref="charts"></div> -->
        <div id="inset"></div>
    </div>
</template>

<script>

import * as THREE from 'three';

// 轨迹球控件，最常用的控件，可以使用鼠标轻松的移动、平移，缩放场景
import { OrbitControls } from '../../utils/OrbitControls.js';

// obj文件加载模块
import { OBJLoader } from '../../utils/OBJLoader.js';

// import { GUI } from '../../utils/lil-gui.module.min.js';

let container, camera, scene, renderer;

let object;
    
export default {
    name: 'home',
    components: {
        
    },
    data () {
        return {
            obj:require('@/models/Cerberus.obj'),
            uv: require('@/assets/img/uv_grid_opengl.jpg'),
            url: '/fileurl/dgscgl/materialProcurement/basicData/pointSelect/GetFile?name=hllb'
            //https://threejs.org/examples/models/obj/male02/male02.obj http://192.168.123.202:7071/dgscgl/materialProcurement/basicData/pointSelect/GetFile
        }
    },
    methods: {
        init(){
            this.$nextTick(() => {
                
                container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.z = 250;
                camera.position.y = 60;

				// 场景
				scene = new THREE.Scene();

                //环境光
				const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
				scene.add( ambientLight );

                // 创建坐标轴
                var axes = new THREE.AxesHelper(100);
                axes.position.y = 0
                // axes.position.x = -54
                scene.add(axes);

                // 创建网格
                const grid = new THREE.GridHelper( 600, 20, 0xffffff, 0xffffff );
				grid.material.opacity = 0.3;
				grid.material.transparent = true;
                grid.position.y = 0
				scene.add( grid );

                //点光源
				const pointLight = new THREE.PointLight( 0xffffff, 0.8 );
				camera.add( pointLight );
				scene.add( camera );

                const manager = new THREE.LoadingManager( loadModel );

                // 纹理
				const textureLoader = new THREE.TextureLoader( manager );
				const texture = textureLoader.load( this.uv );

                function loadModel() {
					// object.traverse( function ( child ) {
					// 	if ( child.isMesh ) child.material.map = texture;
					// } );
					object.position.y = 5;
                    console.log("444",object.children[0].geometry.center());
                    console.log("111",object.children[0].geometry.boundingBox.max.x,"ininn",object.children[0].geometry.boundingBox.min.x);
                    console.log("222",object.children[0].geometry.boundingBox.max.y,"ininn",object.children[0].geometry.boundingBox.min.y);
                    console.log("333",object.children[0].geometry.boundingBox.max.z,"ininn",object.children[0].geometry.boundingBox.min.z);
                    object.scale.set(0.15, 0.01, 0.01);
					scene.add( object );
				}

                // model
				function onProgress( xhr ) {
					if ( xhr.lengthComputable ) {
						const percentComplete = xhr.loaded / xhr.total * 100;
						console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );
					}
				}

                function onError() {
                    console.log( '模型加载失败！' );
                }

				const loader = new OBJLoader( manager );
				loader.load( this.url, function ( obj ) {
                    console.log(obj);
					object = obj;

				}, onProgress, onError );

                renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
                // renderer.setClearColor(0x00ff00, 0);
				container.appendChild( renderer.domElement );

                const controls = new OrbitControls( camera, renderer.domElement );
				controls.enablePan = false;

                this.animate();
            })
            window.addEventListener( 'resize', this.onWindowResize );
        },
        onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( window.innerWidth, window.innerHeight );
        },
		animate() {
            requestAnimationFrame( this.animate );
			this.render();
        },
        render() {
            renderer.render( scene, camera );
        }
    },
    created() {
        this.init();
    }
}
</script>

<style scoped>
    .mxcad {
        width: 100%;
        height: calc(100vh);
        margin: 0 auto;
        /* background: aquamarine; */
    }
</style>
