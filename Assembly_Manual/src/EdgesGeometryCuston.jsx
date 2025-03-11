import * as THREE from 'three';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/controls/OrbitControls.js';

export default function EdgesGeometryCustom(geometry, thresholdAngle) {

    let g = new THREE.BufferGeometry();

    g.type = 'EdgesGeometry';

    g.parameters = {
        thresholdAngle: thresholdAngle
    };

    thresholdAngle = (thresholdAngle !== undefined) ? thresholdAngle : 1;

    // buffer

    const vertices = [];
    const control0 = [];
    const control1 = [];
    const direction = [];
    const collapse = [];

    // helper variables

    const thresholdDot = Math.cos(THREE.MathUtils.DEG2RAD * thresholdAngle);
    const edge = [0, 0], edges = {};
    let edge1, edge2, key;
    const keys = ['a', 'b', 'c'];

    // prepare source geometry

    let geometry2;

    if (geometry.isBufferGeometry) {

        geometry2 = new THREE.Geometry();
        geometry2.fromBufferGeometry(geometry);

    } else {

        geometry2 = geometry.clone();

    }

    geometry2.mergeVertices();
    geometry2.computeFaceNormals();

    const sourceVertices = geometry2.vertices;
    const faces = geometry2.faces;

    // now create a data structure where each entry represents an edge with its adjoining faces

    for (let i = 0, l = faces.length; i < l; i++) {

        const face = faces[i];

        for (let j = 0; j < 3; j++) {

            edge1 = face[keys[j]];
            edge2 = face[keys[(j + 1) % 3]];
            edge[0] = Math.min(edge1, edge2);
            edge[1] = Math.max(edge1, edge2);

            key = edge[0] + ',' + edge[1];

            if (edges[key] === undefined) {

                edges[key] = { index1: edge[0], index2: edge[1], face1: i, face2: undefined };

            } else {

                edges[key].face2 = i;

            }

        }

    }

    // generate vertices
    const v3 = new THREE.Vector3();
    const n = new THREE.Vector3();
    const n1 = new THREE.Vector3();
    const n2 = new THREE.Vector3();
    const d = new THREE.Vector3();
    for (key in edges) {

        const e = edges[key];

        // an edge is only rendered if the angle (in degrees) between the face normals of the adjoining faces exceeds this value. default = 1 degree.

        if (e.face2 === undefined || faces[e.face1].normal.dot(faces[e.face2].normal) <= thresholdDot) {

            let vertex1 = sourceVertices[e.index1];
            let vertex2 = sourceVertices[e.index2];

            vertices.push(vertex1.x, vertex1.y, vertex1.z);
            vertices.push(vertex2.x, vertex2.y, vertex2.z);

            d.subVectors(vertex2, vertex1);
            collapse.push(0, 1);
            n.copy(d).normalize();
            direction.push(d.x, d.y, d.z);
            n1.copy(faces[e.face1].normal);
            n1.crossVectors(n, n1);
            d.subVectors(vertex1, vertex2);
            n.copy(d).normalize();
            n2.copy(faces[e.face2].normal);
            n2.crossVectors(n, n2);
            direction.push(d.x, d.y, d.z);

            v3.copy(vertex1).add(n1); // control0
            control0.push(v3.x, v3.y, v3.z);
            v3.copy(vertex1).add(n2); // control1
            control1.push(v3.x, v3.y, v3.z);

            v3.copy(vertex2).add(n1); // control0
            control0.push(v3.x, v3.y, v3.z);
            v3.copy(vertex2).add(n2); // control1
            control1.push(v3.x, v3.y, v3.z);
        }

    }

    // build geometry

    g.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    g.setAttribute('control0', new THREE.Float32BufferAttribute(control0, 3));
    g.setAttribute('control1', new THREE.Float32BufferAttribute(control1, 3));
    g.setAttribute('direction', new THREE.Float32BufferAttribute(direction, 3));
    g.setAttribute('collapse', new THREE.Float32BufferAttribute(collapse, 1));
    return g;

}
