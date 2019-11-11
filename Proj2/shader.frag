#version 300 es
precision highp float;

in vec2 vTextureCoord;

uniform sampler2D uSampler;

out vec4 fragColor;

void main() {
    vec4 color=texture(uSampler, vTextureCoord);
    vec2 middlePoint = vec2(0.5, 0.5);
    float dist = 1.0 - distance(middlePoint, vTextureCoord) * sqrt(2.0)/2.0;
	fragColor =  vec4(color.rgb * dist, 1.0);
    //fragColor =  color;
}