var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    } 

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <globals>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <globals> out of order");

            //Parse globals block
            if ((error = this.parseGlobals(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }
        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {

        var children = viewsNode.children;

        this.views = [];
        var numViews = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of views.
        for (var i = 0; i < children.length; i++) {

            // Storing views information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of view
            if (children[i].nodeName != "perspective" && children[i].nodeName != "ortho") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["from", "to"]);
                attributeTypes.push(...["position", "position"]);
            }

            // Get id of the current view.
            var viewID = this.reader.getString(children[i], 'id');
            if (viewID == null)
                return "no ID defined for view";

            // Checks for repeated IDs.
            if (this.views[viewID] != null)
                return "ID must be unique for each view (conflict: ID = " + viewID + ")";

    
            grandChildren = children[i].children;
            // Specifications for the current view.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates3D(grandChildren[attributeIndex], "view position for ID" + viewID);
                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "view " + attributeNames[i] + " undefined for ID = " + viewID;
            }

            // Gets the additional attributes of the ortho view
            if (children[i].nodeName == "ortho") {
                var upIndex = nodeNames.indexOf("up");

                // Retrieves the up for ortho.
                var upView = [];
                if (upIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[upIndex], "up for ortho for ID " + viewID);
                    if (!Array.isArray(aux))
                        return aux;

                    upView = aux;
                }
                else
                    return "up for ortho undefined for ID = " + viewID;

                global.push(...[upView]);
            }

            console.log(global[0]);
            var camera = new CGFcamera(this.reader.getFloat(children[i],'angle'), this.reader.getFloat(children[i],'near'), this.reader.getFloat(children[i],'far'), global[0], global[1]);
            console.log(camera);
            this.views[viewID] = camera;
            numViews++;
        }

        if (numViews == 0)
            return "at least one view must be defined";

        this.log("Parsed views");
        return null;
    }

    /**
     * Parses the <globals> node.
     * @param {globals block element} globalsNode
     */
    parseGlobals(globalsNode) {

        var children = globalsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed globals");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular","attenuation"]);
                attributeTypes.push(...["position", "color", "color", "color","attenuationType"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }
            console.log("nodeNames");
            console.log(nodeNames);
            for (var j = 0; j < attributeNames.length; j++) {
                console.log(attributeNames[j]);
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else if (attributeTypes[j]=="attenuationType")
                        var aux = this.parseAttenuation(grandChildren[attributeIndex], "light attenuation for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[j] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        console.log(this.lights);
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        var children = texturesNode.children;
        this.textures = [];
        
        // Any number of textures.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id and URL of the current texture.
            var textureID = this.reader.getString(children[i], 'id');
            var textureURL = this.reader.getString(children[i], 'file');
            if (textureURL == null)
                return "no url defined for texture";
            if (textureID == null)
                return "no ID defined for texture";

            // Checks for repeated IDs and URLs.
            if (this.textures[textureURL] != null)
                return "url must be unique for each texture (conflict: url = " + textureURL + ")";
            if (this.textures[textureID] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureID + ")";
            
                        
                var texture = new CGFtexture(this.scene, textureURL);

            this.textures[textureID] = texture;
        }
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";
            
            grandChildren=children[i].children;

            for(let j=0; j<grandChildren.length;j++){
                nodeNames.push(grandChildren[j].nodeName);
            }
            var materialEmissionIndex = nodeNames.indexOf("emission");
            var materialAmbientIndex = nodeNames.indexOf("ambient");
            var materialDiffuseIndex = nodeNames.indexOf("diffuse");
            var materialSpecularIndex = nodeNames.indexOf("specular");

            var material = new CGFappearance(this.scene);

            material.setAmbient(this.reader.getFloat(grandChildren[materialAmbientIndex],'r'), this.reader.getFloat(grandChildren[materialAmbientIndex],'g'), this.reader.getFloat(grandChildren[materialAmbientIndex],'b'), this.reader.getFloat(grandChildren[materialAmbientIndex],'a'));
            material.setDiffuse(this.reader.getFloat(grandChildren[materialDiffuseIndex],'r'), this.reader.getFloat(grandChildren[materialDiffuseIndex],'g'), this.reader.getFloat(grandChildren[materialDiffuseIndex],'b'), this.reader.getFloat(grandChildren[materialDiffuseIndex],'a'));
            material.setSpecular(this.reader.getFloat(grandChildren[materialSpecularIndex],'r'), this.reader.getFloat(grandChildren[materialSpecularIndex],'g'), this.reader.getFloat(grandChildren[materialSpecularIndex],'b'), this.reader.getFloat(grandChildren[materialSpecularIndex],'a'));
            material.setEmission(this.reader.getFloat(grandChildren[materialEmissionIndex],'r'), this.reader.getFloat(grandChildren[materialSpecularIndex],'g'), this.reader.getFloat(grandChildren[materialSpecularIndex],'b'),this.reader.getFloat(grandChildren[materialSpecularIndex],'a'));
            material.setShininess(this.reader.getFloat(children[i],'shininess'));

            this.materials[materialID] = material;
        }

        //this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':                        
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "scale transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);                        
                        break;
                    case 'rotate':
                        switch(this.reader.getString(grandChildren[j], 'axis')){
                            case 'x':     
                                transfMatrix = mat4.rotateX( transfMatrix, transfMatrix, (this.reader.getFloat(grandChildren[j],'angle')*Math.PI)/180 );
                                break;
                            case 'y':     
                                transfMatrix = mat4.rotateY( transfMatrix, transfMatrix, (this.reader.getFloat(grandChildren[j],'angle')*Math.PI)/180 );
                                break;
                            case 'z':     
                                transfMatrix = mat4.rotateZ( transfMatrix, transfMatrix, (this.reader.getFloat(grandChildren[j],'angle')*Math.PI)/180 );
                                break;
                        }
                       
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            }
            else if (primitiveType == 'triangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;
                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z2
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;
                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3)))
                    return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

                // z3
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;
                var triangle = new MyTriangle(this.scene, primitiveId, x1, x2, x3, y1, y2, y3, z1, z2, z3);

                this.primitives[primitiveId] = triangle;
            }
            else if(primitiveType == 'cylinder') {
                 // base
                 var base = this.reader.getFloat(grandChildren[0], 'base');
                 if (!(base != null && !isNaN(base)))
                     return "unable to parse base of the primitive coordinates for ID = " + primitiveId;
 
                 // top
                 var top = this.reader.getFloat(grandChildren[0], 'top');
                 if (!(top != null && !isNaN(top)))
                     return "unable to parse top of the primitive coordinates for ID = " + primitiveId;
 
                 // height
                 var height = this.reader.getFloat(grandChildren[0], 'height');
                 if (!(height != null && !isNaN(height)))
                     return "unable to parse height of the primitive coordinates for ID = " + primitiveId;
 
                 // slices
                 var slices = this.reader.getFloat(grandChildren[0], 'slices');
                 if (!(slices != null && !isNaN(slices)))
                     return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                //stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var cylinder = new MyCylinder(this.scene, primitiveId, base, top, height, slices, stacks);
                
                this.primitives[primitiveId] = cylinder;
            }
            else if(primitiveType == 'sphere') {
                // radius
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

               //stacks
               var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
               if (!(stacks != null && !isNaN(stacks)))
                   return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

               var sphere = new MySphere(this.scene, primitiveId, radius, slices, stacks);
               
               this.primitives[primitiveId] = sphere;
            }
            else if(primitiveType == 'torus') {
                // inner
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner)))
                    return "unable to parse inner of the primitive coordinates for ID = " + primitiveId;

                // outer
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer)))
                    return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

               //stacks
               var loops = this.reader.getFloat(grandChildren[0], 'loops');
               if (!(loops != null && !isNaN(loops)))
                   return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;

               var torus = new MyTorus(this.scene, primitiveId, inner, outer, slices, loops);
               
               this.primitives[primitiveId] = torus;
           }
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children;
        this.components = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");

            // Transformations
            var transfMatrix = mat4.create();
            var mult;
            var transChildren= children[i].children[transformationIndex].children;
            for (let j=0; j<transChildren.length; j++){
                switch (transChildren[j].nodeName) {
                    case 'transformationref':
                        var transref=this.reader.getString(transChildren[j],'id');
                        if (this.transformations[transref]==undefined)
                            return "the transformation with the id " + transref + " is not referenced.";
                        mat4.multiply(transfMatrix, transfMatrix, this.transformations[transref]);
                        break;
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(transChildren[j], "translate transformation");
                        if (!Array.isArray(coordinates))
                            return coordinates;
                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':                        
                        var coordinates = this.parseCoordinates3D(transChildren[j], "scale transformation");
                        if (!Array.isArray(coordinates))
                            return coordinates;
                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);                        
                        break;
                    case 'rotate':
                        switch(this.reader.getString(transChildren[j], 'axis')){
                            case 'x':     
                                transfMatrix = mat4.rotateX( transfMatrix, transfMatrix, (this.reader.getFloat(transChildren[j],'angle')*Math.PI)/180 );
                                break;
                            case 'y':     
                                transfMatrix = mat4.rotateY( transfMatrix, transfMatrix, (this.reader.getFloat(transChildren[j],'angle')*Math.PI)/180 );
                                break;
                            case 'z':     
                                transfMatrix = mat4.rotateZ( transfMatrix, transfMatrix, (this.reader.getFloat(transChildren[j],'angle')*Math.PI)/180 );
                                break;
                        }  
                }
            }

            // Materials
            var materials=[];
            var childrens=children[i].children[materialsIndex].children;
            for(let j=0; j<childrens.length;j++)
            {
                var matref=this.reader.getString(childrens[j], 'id');
                if (matref!="inherit" && this.materials[matref]==undefined)
                {
                    this.onXMLMinorError("the material with the id " + matref + " in the component " + componentID + " is not referenced. The material will be replaced by inherit.");
                    matref="inherit";
                }
                materials.push(matref);
            }

            // Texture
            var texture=this.reader.getString(children[i].children[textureIndex], 'id');
            var length_s=1;
            var length_t=1;
            if (texture!="inherit" && texture!="none" && this.textures[texture]==undefined)
            {
                this.onXMLMinorError("the texture with the id " + texture + " in the component " + componentID + " is not referenced. The texture will be replaced by none.");
                texture="none";
            }
            else if (texture!="inherit" && texture!="none"){
                length_s=this.reader.getFloat(children[i].children[textureIndex], 'length_s');
                length_t=this.reader.getFloat(children[i].children[textureIndex], 'length_t');
            }

            // Children
            var childrens=children[i].children[childrenIndex].children;
            var childrenPrimitives = [];
            var childrenComponents = [];
            for(let j=0; j<childrens.length;j++){
                if(childrens[j].nodeName=="primitiveref"){
                    var primref=this.reader.getString(childrens[j], 'id');
                    if (this.primitives[primref]==undefined)
                        return "primitive with id " + primref + " in component " + componentID + " is not referenced.";
                    childrenPrimitives.push(primref);
                }
                else if(childrens[j].nodeName=="componentref"){
                    childrenComponents.push(this.reader.getString(childrens[j], 'id'));
                }
            }

            this.components[componentID] = new MyComponent(this.scene, componentID, transfMatrix, materials, texture, length_s, length_t, childrenPrimitives, childrenComponents);
        }
        for (var key in this.components){
            for (let j=0; j<this.components[key].childrenComponents.length; j++)
            {
                var child=this.components[key].childrenComponents[j];
                if (this.components[child] == undefined)
                    return "child component with id " + child + " in component " + this.components[key].id + " is not referenced.";
            }
        }
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Parse the attenuation components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseAttenuation(node, messageError) {
        var attenuation = [];

        // constant
        var constant = this.reader.getFloat(node, 'constant');
        if (!(constant != null && !isNaN(constant) && constant >= 0 && constant <= 1))
            return "unable to parse constant component of the " + messageError;

        // linear
        var linear = this.reader.getFloat(node, 'linear');
        if (!(linear != null && !isNaN(linear) && linear >= 0 && linear <= 1))
            return "unable to parse linear component of the " + messageError;

        // quadratic
        var quadratic = this.reader.getFloat(node, 'quadratic');
        if (!(quadratic != null && !isNaN(quadratic) && quadratic >= 0 && quadratic <= 1))
            return "unable to parse quadratic component of the " + messageError;

        attenuation.push(...[constant,linear, quadratic]);

        return attenuation;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    checkKeys(gui) {
        if (gui.isKeyPressed("KeyM")) {
            for (var key in this.components){
                this.components[key].incrementMaterialNumber();
            }
        }
    }

    processNode(id, transformation_matrix, material, texture, length_s, length_t){
        if (this.primitives[id] != null)
        {   
            var mat = new CGFappearance(this.scene);
            mat=this.materials[material];

            var old_texCoords=this.primitives[id].texCoords;
            if (texture=="none")
                mat.setTexture(null);
            else{
                this.primitives[id].changeTexCoords(length_s, length_t);
                mat.setTexture(this.textures[texture]);
                mat.setTextureWrap('REPEAT', 'REPEAT');
            }            
            mat.apply();

            if (texture=="paintingTexture")
                console.log(this.primitives[id].texCoords);

            this.scene.pushMatrix();
            this.scene.multMatrix(transformation_matrix);
            this.primitives[id].display();
            this.scene.popMatrix();
            
            this.primitives[id].texCoords=old_texCoords; 
        }
        else
        {
            var component=this.components[id];

            var material_c=component.getCurrentMaterial();
            if (material_c=='inherit')
                material_c=material;

            var texture_c = component.texture;
            if (texture_c=="inherit")
                texture_c=texture;
            else{
                length_s=component.length_s;
                length_t=component.length_t;
            }

            var mult = mat4.create();
            mat4.multiply(mult, transformation_matrix, component.transformation_matrix);

            for (let i=0; i<component.childrenComponents.length; i++)
            {
                var childIndex = component.childrenComponents[i];
                var child = this.components[childIndex];
                this.processNode(child.id, mult, material_c, texture_c, length_s, length_t);
            }    

            for (let i=0; i<component.childrenPrimitives.length; i++){
                this.processNode(component.childrenPrimitives[i], mult, material_c, texture_c, length_s, length_t);
            }
        }
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        var transMatrix = mat4.create();
        this.processNode(this.idRoot, transMatrix, null, 'none')
    }
}