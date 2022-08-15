<template>
    <div class="home">
        <!-- <div class="mxcad" ref="charts"></div> -->
        <div id="inset"></div>
    </div>
</template>

<script>

import * as THREE from 'three';

// 使用Stats面板，用于展示FPS等性能数据，便于后期调试分析问题
import Stats from '../../utils/stats.module.js';

// lil-gui 是 three.js社区中非常流行的 UI 库，主要作用，获取一个对象和该对象上的属性名，
// 并根据属性的类型自动生成一个界面组件来操作该属性，使用它后，我们可以通过界面组件来控制场景中的物体，提高调试效率
import { GUI } from '../../utils/lil-gui.module.min.js';

// 轨迹球控件，最常用的控件，可以使用鼠标轻松的移动、平移，缩放场景
import { TrackballControls } from '../../utils/TrackballControls.js';

// NRRD文件加载模块
import { NRRDLoader } from '../../utils/NRRDLoader.js';

// VTK文件加载模块
import { VTKLoader } from '../../utils/VTKLoader.js';

let container, stats, camera, controls, scene, renderer;
    
export default {
    name: 'home',
    components: {
        
    },
    data () {
        return {
            url:require('@/models/I.nrrd'),
            vtk:require('@/models/liver.vtk'),
            nrrd:'https://threejs.org/examples/models/nrrd/I.nrrd'
        }
    },
    methods: {
        init(){
            this.$nextTick(() => {
                
                // 初始化相机
                camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 1e10 );
				camera.position.z = 300;
                // 初始化场景
				scene = new THREE.Scene();
                // 把相机加入到场景之中
				scene.add( camera );
				// 半球光光源可以为室外场景创建更加自然的光照
				const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x000000, 1 );
				scene.add( hemiLight );

                // 方向光
				const dirLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
				dirLight.position.set( 200, 200, 200 );
				scene.add( dirLight );

                let _this = this;
                // 加载数据 ...
                new NRRDLoader().load( this.url, function ( volume ) {

                    const geometry = new THREE.BoxGeometry( volume.xLength, volume.yLength, volume.zLength );
					const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

                    const cube = new THREE.Mesh( geometry, material );
					cube.visible = false;
					const box = new THREE.BoxHelper( cube );
					scene.add( box );
					box.applyMatrix4( volume.matrix );
					scene.add( cube );

                    //z 刨面
					const sliceZ = volume.extractSlice( 'z', Math.floor( volume.RASDimensions[ 2 ] / 4 ) );
					scene.add( sliceZ.mesh );

					//y 刨面
					const sliceY = volume.extractSlice( 'y', Math.floor( volume.RASDimensions[ 1 ] / 2 ) );
					scene.add( sliceY.mesh );

					//x 刨面
					const sliceX = volume.extractSlice( 'x', Math.floor( volume.RASDimensions[ 0 ] / 2 ) );
					scene.add( sliceX.mesh );

                    gui.add( sliceX, 'index', 0, volume.RASDimensions[ 0 ], 1 ).name( 'indexX' ).onChange( function () {

						sliceX.repaint.call( sliceX );

					} );
					gui.add( sliceY, 'index', 0, volume.RASDimensions[ 1 ], 1 ).name( 'indexY' ).onChange( function () {

						sliceY.repaint.call( sliceY );

					} );
					gui.add( sliceZ, 'index', 0, volume.RASDimensions[ 2 ], 1 ).name( 'indexZ' ).onChange( function () {

						sliceZ.repaint.call( sliceZ );

					} );

					gui.add( volume, 'lowerThreshold', volume.min, volume.max, 1 ).name( 'Lower Threshold' ).onChange( function () {

						volume.repaintAllSlices();

					} );
					gui.add( volume, 'upperThreshold', volume.min, volume.max, 1 ).name( 'Upper Threshold' ).onChange( function () {

						volume.repaintAllSlices();

					} );
					gui.add( volume, 'windowLow', volume.min, volume.max, 1 ).name( 'Window Low' ).onChange( function () {

						volume.repaintAllSlices();

					} );
					gui.add( volume, 'windowHigh', volume.min, volume.max, 1 ).name( 'Window High' ).onChange( function () {

						volume.repaintAllSlices();

					} );

                });

                const vtkmaterial = new THREE.MeshLambertMaterial( { wireframe: false, side: THREE.DoubleSide, color: 0xff0000 } );

                const vtkloader = new VTKLoader();
                vtkloader.load( this.vtk, function ( geometry ) {

                    geometry.computeVertexNormals();

                    const mesh = new THREE.Mesh( geometry, vtkmaterial );
                    scene.add( mesh );
                    const visibilityControl = {
                        visible: true
                    };
                    gui.add( visibilityControl, 'visible' ).name( 'Model Visible' ).onChange( function () {
                        mesh.visible = visibilityControl.visible;
                        renderer.render( scene, camera );
                    } );

                } );
                // 渲染

                renderer = new THREE.WebGLRenderer();
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize( window.innerWidth, window.innerHeight );

                container = document.createElement( 'div' );
                document.body.appendChild( container );
                container.appendChild( renderer.domElement );

                controls = new TrackballControls( camera, renderer.domElement );
                controls.minDistance = 100;
                controls.maxDistance = 500;
                controls.rotateSpeed = 5.0;
                controls.zoomSpeed = 5;
                controls.panSpeed = 2;

                stats = new Stats();
                container.appendChild( stats.dom );

                const gui = new GUI();

                this.animate();
            })
            window.addEventListener( 'resize', this.onWindowResize );
        },
        onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( window.innerWidth, window.innerHeight );

            controls.handleResize();

        },
		animate() {
            requestAnimationFrame( this.animate );
            controls.update();
            renderer.render( scene, camera );
            stats.update();
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
