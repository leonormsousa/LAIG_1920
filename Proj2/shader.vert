#version 300 es
precision highp float;

in vec3 aVertexPosition;

in vec2 aTextureCoord;

out vec2 vTextureCoord;

void main() {
    vTextureCoord=aTextureCoord;
    vTextureCoord.y=1.0-vTextureCoord.y;
	gl_Position = vec4(aVertexPosition, 1.0);
}
