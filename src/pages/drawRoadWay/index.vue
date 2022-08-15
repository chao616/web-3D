<template>
    <div class="home">
        <!-- <div class="mxcad" ref="charts"></div> -->
        <div id="inset"></div>
        <div class="viewHelper" id="viewHelper"></div>
    </div>
</template>

<script>

import * as THREE from 'three';

import data from '../../models/xiangdao.js';

//控制器，最常用的控件，可以使用鼠标轻松旋转，缩放场景
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 几何体拖动控件
import { DragControls } from 'three/examples/jsm/controls/DragControls';
// 轨迹球控件
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'; 
//可视化平移控件
import { TransformControls } from "three/examples/jsm/controls/TransformControls"; 
//右下角视角指示器
import { ViewHelper } from 'three/examples/jsm/helpers/ViewHelper'

//合并多个mesh网格
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils'


let container, camera, scene, renderer, viewHelper, controls;

    
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
                
                container = document.getElementById( 'inset' );

				camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.z = 1000;
                camera.position.y = 500;

				// 场景
				scene = new THREE.Scene();

                //环境光
				const ambientLight = new THREE.AmbientLight( 0x888888, 0.9 );
				scene.add( ambientLight );

                // 创建坐标轴
                var axes = new THREE.AxesHelper(100);
                axes.position.y = 0
                // axes.position.x = -54
                scene.add(axes);

                // 箭头
                const dirX = new THREE.Vector3( 1, 0, 0 ).normalize();
                const originX = new THREE.Vector3( -300, 0, 300 );
                const arrowHelperX = new THREE.ArrowHelper( dirX, originX, 50, 0xff0000 );
                scene.add( arrowHelperX );

                const dirY = new THREE.Vector3( 0, 1, 0 ).normalize();
                const originY = new THREE.Vector3( -300, 0, 300 );
                const arrowHelperY = new THREE.ArrowHelper( dirY, originY, 50, 0x33CC00 );
                scene.add( arrowHelperY );

                const dirZ = new THREE.Vector3( 0, 0, -1 ).normalize();
                const originZ = new THREE.Vector3( -300, 0, 300 );
                const arrowHelperZ = new THREE.ArrowHelper( dirZ, originZ, 50, 0x3366FF );
                scene.add( arrowHelperZ );

                // 创建网格
                // const grid = new THREE.GridHelper( 600, 20, 0xffffff, 0xffffff );
                const grid = new THREE.GridHelper( 600, 20, 0x00ff00, 0x000000 );
				grid.material.opacity = 0.3;
				grid.material.transparent = true;
                grid.position.y = 0
				scene.add( grid );

                //添加三维坐标示意图
                viewHelper = new ViewHelper(camera, container);


                //点光源
				const pointLight = new THREE.PointLight( 0xffffff, 1.2 );
				camera.add( pointLight );
				scene.add( camera );

                // 创建纹理加载器实例
                let loader = new THREE.TextureLoader();
                // 加载所需要的纹理图片
                let texture1 = loader.load(this.texture1)
                let material = new THREE.MeshLambertMaterial({
                    // map: texture1, 
                    color: 0x666666, 
                    side:THREE.DoubleSide,
                    opacity:0.6,
                    // wireframe:true,
                    // transparent:true,
                });
                texture1.wrapS = THREE.RepeatWrapping;
                texture1.wrapT = THREE.RepeatWrapping;
                // uv两个方向纹理重复数量
                texture1.repeat.set(1, 10);

                // 绘制一个面
                let p1 = new THREE.Vector2( -6, 6 );
                let p2 = new THREE.Vector2( 6, 6 );
                let p3 = new THREE.Vector2( 6, -6 );
                let p4 = new THREE.Vector2( -6, -6 );
                let pts = [p1, p2, p3, p4];
                
                const shape = new THREE.Shape(pts);
                // shape.moveTo( -50, 50 );
                // shape.bezierCurveTo( 25, 25, 20, 0, 0, 0 );

                // 掏空中间
                let pc1 = new THREE.Vector2( -5, 5 );
                let pc2 = new THREE.Vector2( 5, 5 );
                let pc3 = new THREE.Vector2( 5, -5 );
                let pc4 = new THREE.Vector2( -5, -5 );
                let pcts = [pc1, pc2, pc3, pc4];
                const hole = new THREE.Path(pcts);
                shape.holes.push(hole)

                // 轨迹
                const randomPoints = [];
                for ( let i = 0; i < 12; i ++ ) {
					randomPoints.push( new THREE.Vector3( ( i - 4.5 ) * 50, THREE.MathUtils.randFloat( - 50, 50 ), THREE.MathUtils.randFloat( - 50, 50 ) ) );
				}
                // console.log(randomPoints);
                // const randomSpline = new THREE.CatmullRomCurve3( randomPoints );

                // 新建一个组
                const group = new THREE.Group();

                // 将你的要合并的多个geometry放入到该数组
                let geometryArray = []; 
                // 将你的要赋值的多个material放入到该数组
                let materialArray = []; 
                

                let lineId = data.appSettings.RoadwayGraph.Edges.EdgeItem;
                // console.log(lineId);
                let pointList = data.appSettings.RoadwayGraph.Vertexes.VertexItem
                
                for(var i=0;i<lineId.length;i++){
                    let Vector3Arr = [];
                    let nr = lineId[i].VertexList.Vertex;
                    for(var n=0;n<nr.length;n++){
                        let id = nr[n]['-ID'];
                        let arr = [...pointList];
                        let newData = arr.filter(item => item['-ID'] == id);
                        let point = new THREE.Vector3(newData[0]['-X'] - 0, newData[0]['-Y'] - 0, newData[0]['-Z'] - 0);
                        Vector3Arr.push(point);
                    }
                    // console.log(Vector3Arr);
                    var path = new THREE.CatmullRomCurve3(Vector3Arr);

                    var extrudeSettings = {
                        // depth: 200,
                        steps: 1,
                        extrudePath: path,
                        bevelEnabled: false,
                        // bevelThickness: 2,
                        // bevelSize: 4,
                        // bevelSegments: 1
                    };

                    const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

                    

                    // var mesh = new THREE.Mesh( geometry, material );

                    // 取第一个点的坐标，然后通过坐标计算模型相对于网格坐标的偏移量（需要乘以缩放系数），然后减去网格对应的尺寸（可以适当调整），z轴不需要减
                    // mesh.scale.set(0.1, 0.1, 0.1);
                    // let centerX = 0 - parseInt(pointList[0]['-X']*0.1 - (600/4)); 
                    // let centerY = 0 - parseInt(pointList[0]['-Y']*0.1 - (600/4));
                    // let centerZ = 0 - parseInt(pointList[0]['-Z']*0.1);
                    // // mesh.position.set( -375170, -43930, 0 );
                    // mesh.position.set(centerY, centerZ, centerX);

                    // mesh.rotation.z = -0.5*Math.PI;
                    // mesh.rotation.x = -0.5*Math.PI;
                    // group.add( mesh );
                    geometryArray.push(geometry);
                    materialArray.push(material);
                }

                // 合并多个几何体
                const mergedGeometries = mergeBufferGeometries(geometryArray, true);
                var mesh = new THREE.Mesh( mergedGeometries, materialArray );
                // console.log(mesh);
                mesh.scale.set(0.1, 0.1, 0.1);
                mesh.rotation.z = -0.5*Math.PI;
                mesh.rotation.x = -0.5*Math.PI;
                mergedGeometries.center();//模型居中展示

                scene.add( mesh );

                //生成法向量
                // if(!geometry.hasAttribute('normal')) {
                //     geometry.computeVertexNormals();
                //     geometry.shading = THREE.SmoothShading;
                //     geometry.normalizeNormals();
                // }
                


                renderer = new THREE.WebGLRenderer({
                    //增加下面两个属性，可以抗锯齿
                    antialias:true,
                    alpha:true,
                    logarithmicDepthBuffer:true
                });

                //告诉渲染器需要阴影效果
                renderer.shadowMap.enabled = true;
                // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
                renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
                renderer.setClearColor(0x00ff00, 0);
                renderer.autoClear = false;
				container.appendChild( renderer.domElement );

                controls = new OrbitControls( camera, renderer.domElement );
                // 启用或禁用摄像机平移，默认为true
				// controls.enablePan = false;

                // 添加平移控件
				var transformControls = new TransformControls(camera, renderer.domElement);
                transformControls.addEventListener( 'dragging-changed', function ( event ) {
					controls.enabled = ! event.value;
				} );
				scene.add(transformControls);

                // 初始化拖拽控件
                var objects = [];//被拖动对象必须为一个数组
                objects.push(mesh);
				var dragControls = new DragControls(objects, camera, renderer.domElement);
				// // 鼠标进入模型
				dragControls.addEventListener('hoveron', function(event) {
					// 让变换控件对象和选中的对象绑定
					transformControls.attach(event.object);
				});
                // // 鼠标离开模型
                // dragControls.addEventListener('hoveroff',function(event){ 
                //     controls.enabled = true //启动orbitControls 控制器
                // })
				// 开始拖拽
				dragControls.addEventListener('dragstart', function(event) {
					controls.enabled = false;
				});
				// 拖拽结束
				dragControls.addEventListener('dragend', function(event) {
					controls.enabled = true;
				});

                // const controls = new EditorControls( camera, container.dom );
                // controls.addEventListener( 'change', function () {

                //     signals.cameraChanged.dispatch( camera );
                //     signals.refreshSidebarObject3D.dispatch( camera );

                // } );
                // viewHelper.controls = controls;

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
            controls.update();
			this.render();
        },
        render() {
            renderer.clear();
            renderer.render( scene, camera );
            viewHelper.render(renderer);
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
