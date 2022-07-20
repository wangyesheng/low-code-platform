import {gray, grayArray, default as wasmInit} from './data_connection_tec_visable';

const defaultRampColors = {
  0.0: '#f01301',
  0.1: '#0525FB',
  0.2: '#0097FC',
  0.3: '#04FBF3',
  0.4: '#00FF89',
  0.6: '#4EFF00',
  0.7: '#BEFF00',
  0.8: '#FEEB00',
  0.9: '#FF7D00',
  1.0: '#FC0A00'
};
// 两种着色器
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_TextCoord;
  varying vec2 v_TexCoord;
  void main(){
    // 进行插值计算
    v_TexCoord = a_TextCoord;
    gl_Position = a_Position;
  }
`;

const FSHADER_SOURCE = `
  // 片元着色器中一定要声明精度
  precision mediump float;
  varying vec2 v_TexCoord;
  uniform sampler2D u_Sampler;
  uniform sampler2D u_color_ramp;
  // 求平均
  vec4 calculate(vec4 color, vec2 v_TexCoord){
    vec4 tempColor = color;
    if(v_TexCoord.x != 0.0 && v_TexCoord.y != 0.0){
      vec4 left = texture2D(u_Sampler, floor(v_TexCoord * 200.0 + vec2(-1.0, 0.0)) / 200.0);
      vec4 right = texture2D(u_Sampler, floor(v_TexCoord * 200.0 + vec2(1.0, 0.0)) / 200.0);
      vec4 top = texture2D(u_Sampler, floor(v_TexCoord * 200.0 + vec2(0.0, 1.0)) / 200.0);
      vec4 bottom = texture2D(u_Sampler, floor(v_TexCoord * 200.0 + vec2(0.0, -1.0)) / 200.0);
      // tempColor.rg = 1.0 * (left.rg + right.rg + top.rg + tempColor.rg + bottom.rg) / 5.0;
      tempColor = 1.0 * (left + right + top + tempColor + bottom) / 5.0;
    }

    return tempColor;
  }

  void main(){
    vec4 color = texture2D(u_Sampler, v_TexCoord);
    float val = color.r;
    gl_FragColor = texture2D(u_color_ramp, vec2(val, 0.5));
    //color = calculate(color, v_TexCoord);

    // gl_FragColor = color;
  }
`;
let gl = null;

/**
 *
 * @param tec {[[float,float],[float,float]]} 二维数组
 * @param max 热力图数据范围最大
 * @param min 热力图数据范围最小
 * @param rampColors { {
 *   0.0: '#0000FF',
 *   0.1: '#0525FB',
 *   0.2: '#0097FC',
 *   0.3: '#04FBF3',
 *   0.4: '#00FF89',
 *   0.6: '#4EFF00',
 *   0.7: '#BEFF00',
 *   0.8: '#FEEB00',
 *   0.9: '#FF7D00',
 *   1.0: '#FC0A00'
 * }}热力图色值表
 * @returns {Promise<*>}
 */
export async function genHeatmap(tec, max = 100.0, min = 0.0, rampColors=defaultRampColors) {
  const canvas = document.createElement('canvas');
  // canvas.width = 2000;
  // canvas.height = 2000;

  gl = canvas.getContext('webgl');

  // webgl 程序
  const programme = gl.createProgram();

  // 初始化着色器
  initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE, programme);

  // 发送数据
  sendData("a_Position", 2, [-1, 1, -1, -1, 1, -1, 1, 1], gl, programme);

  sendData("a_TextCoord", 2, [0, 1, 0, 0, 1, 0, 1, 1], gl, programme);

  // 加载图片
  return await loadImage(canvas, gl, programme, tec, max, min, rampColors);
}

// 初始化着色器
function initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE, programe) {
  // 创建 shader
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  // 绑定资源
  gl.shaderSource(vertexShader, VSHADER_SOURCE);
  // 编译着色器
  gl.compileShader(vertexShader);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER, FSHADER_SOURCE);
  gl.shaderSource(fragmentShader, FSHADER_SOURCE);
  gl.compileShader(fragmentShader);

  // 常规流程
  gl.attachShader(programe, vertexShader);
  gl.attachShader(programe, fragmentShader);
  gl.linkProgram(programe);
  gl.useProgram(programe);
}

// 发送数据到 GPU
function sendData(name, size, arr, gl, programe) {
  // 获取地址空间
  const variate = gl.getAttribLocation(programe, name);
  if (variate < 0) {
    console.log(`Failed to get the location of ${name}`);
    return;
  }
  const variates = new Float32Array(arr);
  // 1. 创建缓存区
  const buffer = gl.createBuffer();
  if (!buffer) {
    console.log("Failed to create buffer");
  }
  // 2. 绑定缓存区
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // 3. 向缓冲区中添加数据
  gl.bufferData(gl.ARRAY_BUFFER, variates, gl.STATIC_DRAW);
  // 4. 将缓冲区与 glsl 中变量绑定
  gl.vertexAttribPointer(variate, size, gl.FLOAT, false, 0, 0);
  // 5. 开始传输
  gl.enableVertexAttribArray(variate);
}

async function loadImage(canvas, gl, programe, tec, max = 100.0, min = 0.0, rampColors=defaultRampColors){
  return new Promise(((resolve, reject) => {
    wasmInit().then(() => {
      let base64data;
      if (Array.isArray(tec)) {
        base64data = grayArray(tec, max, min);
      } else {
        base64data = gray(tec, max, min);
      }
      // console.log(base64data)
      // 初始化 Image
      const image = new Image();
      // 通过 loader 加载图像路径
      image.src = base64data;

      // 设置回调函数
      image.onload = ()=>{
        const texture = gl.createTexture();

        let colorRamp = getColorRamp(rampColors);
        var colorRampTexture = createTexture(gl, gl.LINEAR, colorRamp, 256, 1);
        gl.activeTexture(gl.TEXTURE0 + 1);
        gl.bindTexture(gl.TEXTURE_2D, colorRampTexture);
        // y 轴反转
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        // 激活 0 号纹理单元
        gl.activeTexture(gl.TEXTURE0);
        // 绑定 texture
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // 图像处理, 一定要有, 用来将图片宽高扩展到 2 的幂
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);// 配置纹理参数
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        // 配置图片
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image); // 配置纹理图像
        // 传输图片
        const u_Sampler = gl.getUniformLocation(programe, "u_Texure");
        gl.uniform1i(u_Sampler, 0);

        //获取Color坐标点
        var u_color_ramp = gl.getUniformLocation(programe, "u_color_ramp");
        gl.uniform1i(u_color_ramp, 1);
        // 刷新颜色
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // 清除
        gl.clear(gl.COLOR_BUFFER_BIT);
        // 画图形
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        resolve(canvas.toDataURL("image/png"))
      }
    })
  }))

}


function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);

  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader));
  }

  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const program = gl.createProgram();

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
  }

  const wrapper = {program: program};

  const numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (let i = 0; i < numAttributes; i++) {
    const attribute = gl.getActiveAttrib(program, i);
    wrapper[attribute.name] = gl.getAttribLocation(program, attribute.name);
  }
  const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < numUniforms; i++) {
    const uniform = gl.getActiveUniform(program, i);
    wrapper[uniform.name] = gl.getUniformLocation(program, uniform.name);
  }

  return wrapper;
}

function createTexture(gl, filter, data, width, height) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  if (data instanceof Uint8Array) {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
  } else {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
  }
  gl.bindTexture(gl.TEXTURE_2D, null);
  return texture;
}

function bindTexture(gl, texture, unit) {
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
}

function createBuffer(gl, data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  return buffer;
}

function bindAttribute(gl, buffer, attribute, numComponents) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(attribute);
  gl.vertexAttribPointer(attribute, numComponents, gl.FLOAT, false, 0, 0);
}

function bindFramebuffer(gl, framebuffer, texture) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  if (texture) {
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  }
}

function getColorRamp(colors) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 256;
  canvas.height = 1;

  const gradient = ctx.createLinearGradient(0, 0, 256, 0);
  for (const stop in colors) {
    gradient.addColorStop(+stop, colors[stop]);
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 1);
  // document.body.append(canvas)

  return new Uint8Array(ctx.getImageData(0, 0, 256, 1).data);
}
