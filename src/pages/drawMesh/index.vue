<template>
    <div class="home">
        <!-- <div class="mxcad" ref="charts"></div> -->
        <div id="inset"></div>
    </div>
</template>

<script>

import * as THREE from 'three';

import data from '../../models/xiangdao.js';
import dataWork from '../../models/gongzuomian.js';

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

				camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.z = 40;
                camera.position.y = 20;

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
                // const grid = new THREE.GridHelper( 600, 20, 0xffffff, 0xffffff );
                const grid = new THREE.GridHelper( 600, 20, 0x00ff00, 0x000000 );
				grid.material.opacity = 0.3;
				grid.material.transparent = true;
                grid.position.y = 0
				scene.add( grid );


                //点光源
				const pointLight = new THREE.PointLight( 0xffffff, 0.4 );
				camera.add( pointLight );
				scene.add( camera );

                // 创建纹理加载器实例
                let loader = new THREE.TextureLoader();
                // 加载所需要的纹理图片
                let texture1 = loader.load(this.texture1)
                let material = new THREE.MeshLambertMaterial({
                    // map: texture1, 
                    color: 0x333333, 
                    side:THREE.DoubleSide,
                    opacity:0.6,
                    // wireframe:true,
                    // transparent:true,
                });
                texture1.wrapS = THREE.RepeatWrapping;
                texture1.wrapT = THREE.RepeatWrapping;
                // uv两个方向纹理重复数量
                texture1.repeat.set(1, 1000);

                // var geometry = new THREE.BoxGeometry(); //声明一个几何体对象Geometry
                // // 顶点坐标
                // var vertices = [
                //     new THREE.Vector3(500, 0, 0), 
                //     new THREE.Vector3(0, 700, 0),
                //     new THREE.Vector3(800, 700, 0),
                // ]
                
                // //顶点坐标添加到geometry对象
                // geometry.vertices = vertices;

                // console.log(data.appSettings.RoadwayGraph.Vertexes.VertexItem);
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
                    var geometry = new THREE.TubeGeometry(path, 1, 8, 8);
                    var mesh = new THREE.Mesh( geometry, material );

                    // 取第一个点的坐标，然后通过坐标计算模型相对于网格坐标的偏移量（需要乘以缩放系数），然后减去网格对应的尺寸（可以适当调整），z轴不需要减
                    mesh.scale.set(0.01, 0.01, 0.01);
                    let centerX = 0 - parseInt(pointList[0]['-X']*0.01 - (600/5*0.1)); 
                    let centerY = 0 - parseInt(pointList[0]['-Y']*0.01 - (600/4*0.1));
                    let centerZ = 0 - parseInt(pointList[0]['-Z']*0.01);
                    // mesh.position.set( -375170, -43930, 0 );
                    mesh.position.set(centerY, centerZ, centerX);
                    mesh.rotation.z = -0.5*Math.PI;
                    mesh.rotation.x = -0.5*Math.PI;

                    scene.add( mesh );
                }
                // console.log(Vector3Arr);
                // var path = new THREE.CatmullRomCurve3([
                //     new THREE.Vector3(0, 0, 0),
                //     new THREE.Vector3(37518499.637423, 4393985.543494, 899.572205),
                //     new THREE.Vector3(37518499.186883, 4393960.163074, 899.016113),
                //     new THREE.Vector3(37518289.042469, 4393983.514361, 896.932373),
                //     new THREE.Vector3(37518287.732322, 4393958.561145, 896.281372),
                //     new THREE.Vector3(37518306.786114, 4393983.685325, 897.600952),
                //     new THREE.Vector3(37518306.604054, 4393958.704113, 896.955750),
                // ]);
               

                // var material = new THREE.MeshBasicMaterial( { 
                //     color: 0x00ff00,
                //     opacity:0.3,
                //     transparent:true,
                //     // wireframe:true,
                // } );
				// var mesh = new THREE.Mesh( geometry, material );

                // mesh.scale.set(0.1, 0.1, 0.1);
                // mesh.position.x = -720;
                // mesh.position.y = 100;
                // mesh.position.z = -50;
                // mesh.rotation.x = Math.PI/2

                // scene.add( mesh );


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
