export default function Placeholder(props) {
    return <>
        <mesh {...props}>
            <boxGeometry args={[]} />
            <meshBasicMaterial wireframe color="red" />
        </mesh>

    </>
}