<template>
    <div class="home">
        <!-- <div class="mxcad" ref="charts"></div> -->
        <div @click="choose" ref="geoVolume"></div>
        <div v-cloak id="name" style="position: absolute;color: #f09c3b;font-size: 18px;" v-if="bool" :style="{left:left + 180+'px',top:top -24+ 'px'}">
            <span>{{ ModelName }}</span>
        </div>
        <div v-cloak style="position: absolute;pointer-events:none;" v-if="bool" :style="{left:left + 'px',top:top + 'px'}">
            <img :src="arrowLine" alt="" width="250">
        </div>
    </div>
</template>

<script>

import * as THREE from 'three';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper';

// import dataWork from '../../models/gongzuomianData.js';

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
            arrowLine:require('../../assets/img/arrowLine.png'),
            bool: false,
            top:100,
            left:100,
            MeshArr:[],
            currentModel:null,
            ModelName:'地质层'
        }
    },
    methods: {
        init(){
            this.$nextTick(() => {
                
                container = this.$refs.geoVolume; //document.createElement( 'div' );
				// document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.z = 95;
                camera.position.y = 30;

				// 场景
				scene = new THREE.Scene();

                //环境光
				const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.8 );
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
                let material = new THREE.MeshLambertMaterial({
                    // map: texture1,
                    color: 0xff0000, 
                    side:THREE.DoubleSide,
                    opacity:0.6,
                    // wireframe:true,
                    // transparent:true,
                });
                texture1.wrapS = THREE.RepeatWrapping;
                texture1.wrapT = THREE.RepeatWrapping;
                // uv两个方向纹理重复数量
                texture1.repeat.set(100, 1000);

                // 工作面
                let dataWor = [...dataWork.data[0].SurfaceData, ...dataWork.data[1].SurfaceData];
                // let dataWor = dataWork.data[0].SurfaceData;
                // console.log(dataWor);
                let dataW = [
                    {"工作面":"24201","角点编号":"0","角点坐标Y":"37444763.4280","角点坐标X":"4312746.2766","角点深度":"1140.9890","备注":"0"},
                    {"工作面":"24201","角点编号":"2","角点坐标Y":"37444763.4200","角点坐标X":"4314430.1358","角点深度":"1141.0080","备注":"1"},
                    {"工作面":"24201","角点编号":"3","角点坐标Y":"37444478.0300","角点坐标X":"4314430.7289","角点深度":"1141.9790","备注":"1"},
                    {"工作面":"24201","角点编号":"5","角点坐标Y":"37444478.0300","角点坐标X":"4314318.6509","角点深度":"1140.1500","备注":"2"},
                    {"工作面":"24201","角点编号":"6","角点坐标Y":"37444478.0330","角点坐标X":"4312918.9658","角点深度":"1139.9980","备注":"2"},
                    {"工作面":"24201","角点编号":"7","角点坐标Y":"37444478.0301","角点坐标X":"4312768.5012","角点深度":"1140.9980","备注":"2"},
                    {"工作面":"24201","角点编号":"8","角点坐标Y":"37444478.0300","角点坐标X":"4312746.2745","角点深度":"1140.9980","备注":"2"},
                    {"工作面":"24201","角点编号":"10","角点坐标Y":"37444536.8542","角点坐标X":"4312746.5160","角点深度":"1140.9980","备注":"3"},
                    {"工作面":"24201","角点编号":"11","角点坐标Y":"37444596.0420","角点坐标X":"4312746.5140","角点深度":"1140.9980","备注":"3"},
                    {"工作面":"24201","角点编号":"12","角点坐标Y":"37444656.3885","角点坐标X":"4312746.5140","角点深度":"1140.9980","备注":"3"},
                    {"工作面":"24201","角点编号":"13","角点坐标Y":"37444716.2330","角点坐标X":"4312746.5130","角点深度":"1140.9980","备注":"3"}
                ]
                let newData = [];
                let pointArr = [];
                // 假设煤层厚度为20
                for(var i=0;i<dataWor.length;i++){
                    let a = [(dataWor[i]['X'] - 0),(dataWor[i]['Y'] - 0),(dataWor[i]['Z'] - 0)];
                    // let b = [(dataWor[1].SurfaceData[i]['X'] - 0),(dataWor[1].SurfaceData[i]['Y'] - 0),(dataWor[1].SurfaceData[i]['Z'] - 0)];
                    // let b = [(dataW[i]['角点坐标Y'] - 0),(dataW[i]['角点坐标X'] - 0),(dataW[i]['角点深度'] - 0 - 60)];
                    // newData = [...newData, ...a, ...b]
                    newData = [...newData, ...a]
                }
                // console.log(newData);
                // for(var i=0;i<15;i++){
                //     let Vector3Arr = [(dataW[i]['角点坐标Y'] - 0),(dataW[i]['角点坐标X'] - 0),(dataW[i]['角点深度'] - 0)];
                //     pointArr = [...pointArr,...Vector3Arr]
                // }
                // console.log(pointArr);
                var geometryWork = new THREE.BufferGeometry();

                
                var verticesWork = new Float32Array( newData );
                geometryWork.addAttribute( 'position', new THREE.BufferAttribute( verticesWork, 3 ) );
                if(!geometryWork.hasAttribute('normal')) {
                    //生成法向量
                    geometryWork.computeVertexNormals();
                    geometryWork.shading = THREE.SmoothShading;
                    geometryWork.normalizeNormals();
                }
                
                var indexArray = [];
                let nums = (newData.length/3) - 215;
                for(var i=0;i<nums;i++){
                    if(i%2 == 0){
                        indexArray.push(i);
                        indexArray.push(i+1);
                        indexArray.push(i + 214)

                        indexArray.push(i+1);
                        indexArray.push(i + 214 + 1);
                        indexArray.push(i+214);
                    }else{
                        if(i != 213 && (i - 213)%214 != 0){
                            indexArray.push(i);
                            indexArray.push(i + 1);
                            indexArray.push(i + 214)

                            indexArray.push(i+1);
                            indexArray.push(i + 214 + 1);
                            indexArray.push(i + 214);
                        }
                    }
                }
                let numst = (newData.length/3);
                for(var i=0;i<numst;i++){
                    // 侧面1网格数据
                    if(i < 213){
                        indexArray.push(i);
                        indexArray.push(i + numst/2)
                        indexArray.push(i + numst/2 + 1);

                        indexArray.push(i);
                        indexArray.push(i + numst/2 + 1)
                        indexArray.push(i+1);
                    }
                    // 侧面2网格数据
                    if( i < 4707 && i > 4493){
                        indexArray.push(i);
                        indexArray.push(i + numst/2)
                        indexArray.push(i + numst/2 + 1);

                        indexArray.push(i);
                        indexArray.push(i + numst/2 + 1)
                        indexArray.push(i+1);
                    }
                    // 侧面3网格数据
                    if( i%214 == 0 && i < (numst/2 - 214)){
                        indexArray.push(i);
                        indexArray.push(numst/2 + i + 214);
                        indexArray.push(numst/2 + i);

                        indexArray.push(i);
                        indexArray.push(i + 214)
                        indexArray.push(numst/2 + i + 214);
                    }
                    // 侧面4网格数据
                    if( i%214 == 0 && i < (numst/2 - 214)){
                        indexArray.push(i + 213);
                        indexArray.push(numst/2 + i + 214 + 213);
                        indexArray.push(numst/2 + i + 213);

                        indexArray.push(i + 213);
                        indexArray.push(i + 214 + 213)
                        indexArray.push(numst/2 + i + 214 + 213);
                    }
                }
                console.log(indexArray);
                // let nums = newData.length/3;
                // for(var i=0;i<nums;i++){
                //     for(var m=i;m<nums;m++){
                //         if(m < (nums - 1)){
                //             indexArray.push(i)
                //             indexArray.push(m+1);
                //             if((m+1) == (nums - 1)){
                //                 indexArray.push(i+1);
                //             }else{
                //                 indexArray.push(m+2);
                //             }
                //         }
                //     }
                // }
                // // console.log(indexArray);
                
                const indexsf = new Uint16Array(indexArray);
                geometryWork.index = new THREE.BufferAttribute(indexsf, 1);
                // 顶点法向量
                let normalsnums = (newData.length/3);
                console.log(normalsnums);
                let normalsArray = [];
                for(var i=0;i<normalsnums;i++){
                    normalsArray.push(0);
                    normalsArray.push(0);
                    normalsArray.push(1)
                    // if(i > 4707){
                    //     normalsArray.push(1);
                    //     normalsArray.push(1);
                    //     normalsArray.push(1)
                    // }else{
                    //     normalsArray.push(-1);
                    //     normalsArray.push(-1);
                    //     normalsArray.push(-1)
                    // }
                }
                
                var normals = new Float32Array(normalsArray);
                // var normals = new Float32Array([
                //     0, 1, 0, //顶点1法向量
                //     0, 0, 1, //顶点2法向量
                //     0, 0, 1, //顶点3法向量

                //     0, -1, 0, //顶点4法向量
                //     0, 1, 0, //顶点5法向量
                //     0, 1, 0, //顶点6法向量
                // ]);
                // geometryWork.normal = new THREE.BufferAttribute(normals, 3);
                // geometryWork.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );

                console.log(geometryWork);
                // geometryWork.faces.push(new THREE.Face3(0, 1, 2));
                var materialWork = new THREE.MeshPhysicalMaterial( { 
                    map: texture1, 
                    // color: 0xff0000, 
                    // wireframe:true,
                    opacity:0.6,
                    // transparent:true,
                    // flatShading : true,
                    shading: THREE.FlatShading, //THREE.SmoothShading
                    side: THREE.DoubleSide //两面可见 
                } );
                geometryWork.center();//模型居中展示
                var meshWork = new THREE.Mesh( geometryWork, materialWork );
                meshWork.scale.set(0.1, 0.1, 0.1);
                // let positionX = 0 - (dataWor[0]['X'] - 0)*0.1 - 100;
                // let positionY = 0 - (dataWor[0]['Y'] - 0)*0.1 - 10;
                // let positionZ = 0 - ((dataWor[0]['Z'] - 0)*0.1);
                // meshWork.position.set(positionY, positionZ, positionX);
                // meshWork.rotation.z = -0.5*Math.PI;
                meshWork.rotation.x = 1.5*Math.PI;
                // meshWork.rotation.y = -0.5*Math.PI;
                // meshWork.position.set( positionX, positionY, positionZ);
                // meshWork.position.y = 6;
                // geometryWork.computeBoundingBox()
                scene.add( meshWork );
                // const helper = new VertexNormalsHelper( meshWork, 20, 0x00ff00, 1 );
                // scene.add( helper );

                // 绘制第二个工作面
                var geometryWork1 = new THREE.BufferGeometry();
                var verticesWork1 = new Float32Array( newData );
                geometryWork1.addAttribute( 'position', new THREE.BufferAttribute( verticesWork1, 3 ) );
                if(!geometryWork1.hasAttribute('normal')) {
                    //生成法向量
                    geometryWork1.computeVertexNormals();
                    geometryWork1.shading = THREE.SmoothShading;
                    geometryWork1.normalizeNormals();
                }
                geometryWork1.index = new THREE.BufferAttribute(indexsf, 1);
                var materialWork1 = new THREE.MeshPhysicalMaterial( { 
                    // map: texture1, 
                    color: 0x993333, 
                    // wireframe:true,
                    // opacity:0.6,
                    // transparent:true,
                    // flatShading : true,
                    shading: THREE.FlatShading, //THREE.SmoothShading
                    side: THREE.DoubleSide //两面可见 
                } );
                geometryWork1.center();//模型居中展示
                var meshWork1 = new THREE.Mesh( geometryWork1, materialWork1 );
                meshWork1.scale.set(0.1, 0.1, 0.1);
                meshWork1.rotation.x = 1.5*Math.PI;
                meshWork1.position.y = 3;
                scene.add( meshWork1 );

                // 绘制第三个工作面
                var geometryWork2 = new THREE.BufferGeometry();
                var verticesWork2 = new Float32Array( newData );
                geometryWork2.addAttribute( 'position', new THREE.BufferAttribute( verticesWork2, 3 ) );
                if(!geometryWork2.hasAttribute('normal')) {
                    //生成法向量
                    geometryWork2.computeVertexNormals();
                    geometryWork2.shading = THREE.SmoothShading;
                    geometryWork2.normalizeNormals();
                }
                geometryWork2.index = new THREE.BufferAttribute(indexsf, 1);
                var materialWork2 = new THREE.MeshPhysicalMaterial( { 
                    // map: texture1, 
                    color: 0x66ffff, 
                    // wireframe:true,
                    // opacity:0.6,
                    // transparent:true,
                    // flatShading : true,
                    shading: THREE.FlatShading, //THREE.SmoothShading
                    side: THREE.DoubleSide //两面可见 
                } );
                geometryWork2.center();//模型居中展示
                var meshWork2 = new THREE.Mesh( geometryWork2, materialWork2 );
                meshWork2.scale.set(0.1, 0.1, 0.1);
                meshWork2.rotation.x = 1.5*Math.PI;
                meshWork2.position.y = 6;
                scene.add( meshWork2 );

                // 绘制第四个工作面
                var geometryWork3 = new THREE.BufferGeometry();
                var verticesWork3 = new Float32Array( newData );
                geometryWork3.addAttribute( 'position', new THREE.BufferAttribute( verticesWork3, 3 ) );
                if(!geometryWork3.hasAttribute('normal')) {
                    //生成法向量
                    geometryWork3.computeVertexNormals();
                    geometryWork3.shading = THREE.SmoothShading;
                    geometryWork3.normalizeNormals();
                }
                geometryWork3.index = new THREE.BufferAttribute(indexsf, 1);
                var materialWork3 = new THREE.MeshPhysicalMaterial( { 
                    // map: texture1, 
                    color: 0x996600, 
                    // wireframe:true,
                    // opacity:0.6,
                    // transparent:true,
                    // flatShading : true,
                    shading: THREE.FlatShading, //THREE.SmoothShading
                    side: THREE.DoubleSide //两面可见 
                } );
                geometryWork3.center();//模型居中展示
                var meshWork3 = new THREE.Mesh( geometryWork3, materialWork3 );
                meshWork3.scale.set(0.1, 0.1, 0.1);
                meshWork3.rotation.x = 1.5*Math.PI;
                meshWork3.position.y = 9;
                scene.add( meshWork3 );

                // 绘制第5个工作面
                var geometryWork4 = new THREE.BufferGeometry();
                var verticesWork4 = new Float32Array( newData );
                geometryWork4.addAttribute( 'position', new THREE.BufferAttribute( verticesWork4, 3 ) );
                if(!geometryWork4.hasAttribute('normal')) {
                    //生成法向量
                    geometryWork4.computeVertexNormals();
                    geometryWork4.shading = THREE.SmoothShading;
                    geometryWork4.normalizeNormals();
                }
                geometryWork4.index = new THREE.BufferAttribute(indexsf, 1);
                var materialWork4 = new THREE.MeshPhysicalMaterial( { 
                    // map: texture1, 
                    color: 0xffff00, 
                    // wireframe:true,
                    // opacity:0.6,
                    // transparent:true,
                    // flatShading : true,
                    shading: THREE.FlatShading, //THREE.SmoothShading
                    side: THREE.DoubleSide //两面可见 
                } );
                geometryWork4.center();//模型居中展示
                var meshWork4 = new THREE.Mesh( geometryWork4, materialWork4 );
                meshWork4.scale.set(0.1, 0.1, 0.1);
                meshWork4.rotation.x = 1.5*Math.PI;
                meshWork4.position.y = 12;
                scene.add( meshWork4 );

                // 绘制第6个工作面
                var geometryWork5 = new THREE.BufferGeometry();
                var verticesWork5 = new Float32Array( newData );
                geometryWork5.addAttribute( 'position', new THREE.BufferAttribute( verticesWork5, 3 ) );
                if(!geometryWork5.hasAttribute('normal')) {
                    //生成法向量
                    geometryWork5.computeVertexNormals();
                    geometryWork5.shading = THREE.SmoothShading;
                    geometryWork5.normalizeNormals();
                }
                geometryWork5.index = new THREE.BufferAttribute(indexsf, 1);
                var materialWork5 = new THREE.MeshPhysicalMaterial( { 
                    // map: texture1, 
                    color: 0x006699, 
                    // wireframe:true,
                    // opacity:0.6,
                    // transparent:true,
                    // flatShading : true,
                    shading: THREE.FlatShading, //THREE.SmoothShading
                    side: THREE.DoubleSide //两面可见 
                } );
                geometryWork5.center();//模型居中展示
                var meshWork5 = new THREE.Mesh( geometryWork5, materialWork5 );
                meshWork5.scale.set(0.1, 0.1, 0.1);
                meshWork5.rotation.x = 1.5*Math.PI;
                meshWork5.position.y = 15;
                scene.add( meshWork5 );

                // 绘制第7个工作面
                var geometryWork6 = new THREE.BufferGeometry();
                var verticesWork6 = new Float32Array( newData );
                geometryWork6.addAttribute( 'position', new THREE.BufferAttribute( verticesWork6, 3 ) );
                if(!geometryWork6.hasAttribute('normal')) {
                    //生成法向量
                    geometryWork6.computeVertexNormals();
                    geometryWork6.shading = THREE.SmoothShading;
                    geometryWork6.normalizeNormals();
                }
                geometryWork6.index = new THREE.BufferAttribute(indexsf, 1);
                var materialWork6 = new THREE.MeshPhysicalMaterial( { 
                    // map: texture1, 
                    color: 0xcc00ff, 
                    // wireframe:true,
                    // opacity:0.6,
                    // transparent:true,
                    // flatShading : true,
                    shading: THREE.FlatShading, //THREE.SmoothShading
                    side: THREE.DoubleSide //两面可见 
                } );
                geometryWork6.center();//模型居中展示
                var meshWork6 = new THREE.Mesh( geometryWork6, materialWork6 );
                meshWork6.scale.set(0.1, 0.1, 0.1);
                meshWork6.rotation.x = 1.5*Math.PI;
                meshWork6.position.y = 18;
                scene.add( meshWork6 );

                // 绘制第8个工作面
                var geometryWork7 = new THREE.BufferGeometry();
                var verticesWork7 = new Float32Array( newData );
                geometryWork7.addAttribute( 'position', new THREE.BufferAttribute( verticesWork7, 3 ) );
                if(!geometryWork7.hasAttribute('normal')) {
                    //生成法向量
                    geometryWork7.computeVertexNormals();
                    geometryWork7.shading = THREE.SmoothShading;
                    geometryWork7.normalizeNormals();
                }
                geometryWork7.index = new THREE.BufferAttribute(indexsf, 1);
                var materialWork7 = new THREE.MeshPhysicalMaterial( { 
                    // map: texture1, 
                    color: 0x330000, 
                    // wireframe:true,
                    // opacity:0.6,
                    // transparent:true,
                    // flatShading : true,
                    shading: THREE.FlatShading, //THREE.SmoothShading
                    side: THREE.DoubleSide //两面可见 
                } );
                geometryWork7.center();//模型居中展示
                var meshWork7 = new THREE.Mesh( geometryWork7, materialWork7 );
                meshWork7.scale.set(0.1, 0.1, 0.1);
                meshWork7.rotation.x = 1.5*Math.PI;
                meshWork7.position.y = 21;
                scene.add( meshWork7 );


                //绘制线条
                const materialLine = new THREE.LineBasicMaterial( { color: 0x0000ff } );
                const points = [];
                for(var i=0;i<dataW.length;i++){
                    points.push( new THREE.Vector3( (dataW[i]['角点坐标Y'] - 0), (dataW[i]['角点坐标X'] - 0), (dataW[i]['角点深度'] - 0) ) );
                }
                // points.push( new THREE.Vector3( (dataW[0]['角点坐标Y'] - 0), (dataW[0]['角点坐标X'] - 0), (dataW[0]['角点深度'] - 0) ) );
                // points.push( new THREE.Vector3( (dataW[1]['角点坐标Y'] - 0), (dataW[1]['角点坐标X'] - 0), (dataW[1]['角点深度'] - 0) ) );
                const geometryLine = new THREE.BufferGeometry().setFromPoints( points );
                const line = new THREE.Line( geometryLine, materialLine );
                let positionX1 = 0 - (dataW[0]['角点坐标Y'] - 0)*0.1 + 15;
                let positionY1 = 0 - (dataW[0]['角点坐标X'] - 0)*0.1 - 75;
                let positionZ1 = ((dataW[0]['角点深度'] - 0)*0.1);
                line.scale.set(0.1, 0.1, 0.1);
                line.rotation.x = Math.PI/2
                line.position.set( positionX1, positionZ1, positionY1);
                // line.position.set( positionX1, positionY1, positionZ1);
                // scene.add(line);

                // console.log(scene);
                

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
        choose(event){
            var Sx=event.clientX-200;
            var Sy=event.clientY-60;
            var x=(Sx/(window.innerWidth-200))*2-1;
            var y=-(Sy/(window.innerHeight-60))*2+1;
            // 创建光线投射
            var raycaster=new THREE.Raycaster();
            // 将光线定向到相机的方向
            raycaster.setFromCamera(
                new THREE.Vector2(x,y),
                camera
            );
            for(var i=4;i<scene.children.length;i++){
                if(scene.children[i].type==='Mesh'){
                    this.MeshArr.push(scene.children[i]);
                }
            }
            var Arr=[];
            this.MeshArr.forEach(function(Mesh){
                if(Mesh.material.visible===true){
                    Arr.push(Mesh)
                }
            });
            var intersects=raycaster.intersectObjects(Arr);
            if(intersects.length>0){
                // if(vm.currentModel){
                //     vm.currentModel.traverse(function(object){
                //         if(object.type==='Mesh'){
                //             object.material.color.copy(object.material.selfColor)
                //         }
                //     })
                // }
                this.currentModel=intersects[0].object;
                this.currentModel.material.color.set(0x409EFF);
                this.ModelName= this.currentModel.parent.name;
                scene.updateMatrixWorld(true);
                var worldPosition=new THREE.Vector3();
                this.currentModel.getWorldPosition(worldPosition);
                var standardVector=worldPosition.project(camera);
                var a=(window.innerWidth-200)/2;
                var b=(window.innerHeight-60)/2;
                this.left=Math.round(standardVector.x*a+a)+200;
                this.top=Math.round(-standardVector.y*b+b)-140+60;
                this.bool=true;
            }else{
                this.bool=false;
                if(this.currentModel){
                    this.currentModel.traverse(function(object){
                        if(object.type==='Mesh'){
                            object.material.color.copy(object.material.selfColor)
                        }
                    })
                }
            }
            render()
        }
    },
    created() {
        // this.init();
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
