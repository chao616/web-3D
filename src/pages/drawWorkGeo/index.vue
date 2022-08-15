<template>
    <div class="home">
        <!-- <div class="mxcad" ref="charts"></div> -->
        <div id="inset"></div>
    </div>
</template>

<script>

import * as THREE from 'three';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper';

import dataWork from '../../models/dizhitiDataBig.js';
import dataWork1 from '../../models/dizhitiDataBig1.js';
import dataSide from '../../models/dizhiticemianDataBig.js';

// 轨迹球控件，最常用的控件，可以使用鼠标轻松的移动、平移，缩放场景
import { OrbitControls } from '../../utils/OrbitControls.js';


let container, camera, scene, renderer;

    
export default {
    name: 'home',
    components: {
        
    },
    data () {
        return {
            texture1:require('../../assets/img/texture1.png'),
        }
    },
    methods: {
        init(){
            this.$nextTick(() => {
                
                container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.z = 95;
                camera.position.y = 30;

				// 场景
				scene = new THREE.Scene();

                //环境光
				const ambientLight = new THREE.AmbientLight( 0x666666, 0.6 );
				scene.add( ambientLight );

                // 创建坐标轴
                var axes = new THREE.AxesHelper(100);
                axes.position.y = 0
                // axes.position.x = -54
                scene.add(axes);

                // 创建网格
                // const grid = new THREE.GridHelper( 600, 20, 0xffffff, 0xffffff );
                const grid = new THREE.GridHelper( 600, 20, 0x00ff00, 0x000000 );
				grid.material.opacity = 0.3;
				grid.material.transparent = true;
                grid.position.y = 0
				scene.add( grid );

                //点光源
				const pointLight = new THREE.PointLight( 0xffffff, 2 );
                // pointLight.castShadow = true;
				camera.add( pointLight );
				scene.add( camera );

                // 创建纹理加载器实例
                let loader = new THREE.TextureLoader();
                // 加载所需要的纹理图片
                let texture1 = loader.load(this.texture1)
                texture1.wrapS = THREE.RepeatWrapping;
                texture1.wrapT = THREE.RepeatWrapping;
                // uv两个方向纹理重复数量
                texture1.repeat.set(100, 1000);

                // 工作面1
                let dataWor = [...dataWork.data];
                let newData = [];
                // let pointArr = [];
                // for(var i=0;i<dataWor.length;i++){
                //     let a = [(dataWor[i]['x'] - 0),(dataWor[i]['y'] - 0),(dataWor[i]['z'] - 0)];
                //     newData = [...newData, ...a]
                // }
                var geometryWork = new THREE.BufferGeometry();

                
                var verticesWork = new Float32Array( dataWor );
                geometryWork.addAttribute( 'position', new THREE.BufferAttribute( verticesWork, 3 ) );
                if(!geometryWork.hasAttribute('normal')) {
                    //生成法向量
                    geometryWork.computeVertexNormals();
                    geometryWork.shading = THREE.SmoothShading;
                    geometryWork.normalizeNormals();
                }
                var materialWork = new THREE.MeshPhysicalMaterial( { 
                    // map: texture1, 
                    color: 0x333333, 
                    // wireframe:true,
                    opacity:0.6,
                    // transparent:true,
                    // flatShading : true,
                    shading: THREE.FlatShading, //THREE.SmoothShading
                    side: THREE.DoubleSide //两面可见 
                } );
                geometryWork.center();//模型居中展示
                var meshWork = new THREE.Mesh( geometryWork, materialWork );
                meshWork.scale.set(0.01, 0.01, 0.05);
                meshWork.rotation.x = 1.5*Math.PI;
                scene.add( meshWork );
                // const helper = new VertexNormalsHelper( meshWork, 20, 0x00ff00, 1 );
                // scene.add( helper );

                // 工作面2
                let dataWor2 = [...dataWork1.data];
                let newData2 = [];
                // for(var i=0;i<dataWor2.length;i++){
                //     let a = [(dataWor2[i]['x'] - 0),(dataWor2[i]['y'] - 0),(dataWor2[i]['z'] - 0)];
                //     newData2 = [...newData2, ...a]
                // }
                var geometryWork2 = new THREE.BufferGeometry();

                
                var verticesWork2 = new Float32Array( dataWor2 );
                geometryWork2.addAttribute( 'position', new THREE.BufferAttribute( verticesWork2, 3 ) );
                if(!geometryWork2.hasAttribute('normal')) {
                    //生成法向量
                    geometryWork2.computeVertexNormals();
                    geometryWork2.shading = THREE.SmoothShading;
                    geometryWork2.normalizeNormals();
                }
                var materialWork2 = new THREE.MeshPhysicalMaterial( { 
                    // map: texture1, 
                    color: 0x333333, 
                    // wireframe:true,
                    opacity:0.6,
                    // transparent:true,
                    // flatShading : true,
                    shading: THREE.FlatShading, //THREE.SmoothShading
                    side: THREE.DoubleSide //两面可见 
                } );
                geometryWork2.center();//模型居中展示
                var meshWork2 = new THREE.Mesh( geometryWork2, materialWork2 );
                meshWork2.scale.set(0.01, 0.01, 0.05);
                meshWork2.rotation.x = 1.5*Math.PI;
                scene.add( meshWork2 );

                // 侧面
                let dataSideWor = [...dataSide.data];
                // let newDataSide = [];
                // for(var i=0;i<dataSideWor.length;i++){
                //     let a = [(dataSideWor[i]['x'] - 0),(dataSideWor[i]['y'] - 0),(dataSideWor[i]['z'] - 0)];
                //     newDataSide = [...newDataSide, ...a]
                // }
                var geometryWorkSide = new THREE.BufferGeometry();
                var verticesWorkSide = new Float32Array( dataSideWor );
                geometryWorkSide.addAttribute( 'position', new THREE.BufferAttribute( verticesWorkSide, 3 ) );
                if(!geometryWorkSide.hasAttribute('normal')) {
                    //生成法向量
                    geometryWorkSide.computeVertexNormals();
                    geometryWorkSide.shading = THREE.SmoothShading;
                    geometryWorkSide.normalizeNormals();
                }
                var materialWorkSide = new THREE.MeshPhysicalMaterial( { 
                    // map: texture1, 
                    color: 0x333333, 
                    // wireframe:true,
                    opacity:0.6,
                    // transparent:true,
                    // flatShading : true,
                    shading: THREE.FlatShading, //THREE.SmoothShading
                    side: THREE.DoubleSide //两面可见 
                } );
                geometryWorkSide.center();//模型居中展示
                var meshWorkSide = new THREE.Mesh( geometryWorkSide, materialWorkSide );
                meshWorkSide.scale.set(0.01, 0.01, 0.05);
                meshWorkSide.rotation.x = 1.5*Math.PI;
                scene.add( meshWorkSide );


                renderer = new THREE.WebGLRenderer({
                    //增加下面两个属性，可以抗锯齿
                    antialias:true,
                    alpha:true,
                    logarithmicDepthBuffer:true
                });
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
                renderer.setClearColor(0x00ff00, 0);
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
        },
        // 随机生成16进制颜色
        getColor(){
            var color = "#";
            //一个十六进制的值的数组
            var array = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
            //得到6个随机数
            for (var i = 0; i < 6; i++) {
                var num = parseInt(Math.random()*16);
                color += array[num];
            }
            return color;
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
