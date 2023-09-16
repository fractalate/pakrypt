function Circle(props: {radius: number}) {
    const cx = 15, cy = 7;
    return (
        <ellipse cx={cx} cy={cy} rx={props.radius} ry={props.radius * 0.6} stroke="black" strokeWidth="5" fillOpacity="0.0" transform={"rotate(-10 " + cx + " " + cy + ")"}></ellipse>
    );
}

export default function ConcentricCircles() {
    return (
        <div>
            <svg width={200} height={200}>
                <Circle radius={80}/>
                <Circle radius={30}/>
            </svg>
        </div>
    );
}
