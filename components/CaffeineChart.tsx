import { CartesianChart, Line } from "victory-native";
import { useFont } from "@shopify/react-native-skia";
import fontSpaceMono from "../assets/fonts/SpaceMono-Regular.ttf";



const CaffeineChart = ({
        mgCount,
        DATA
    }) => {
    const font = useFont(fontSpaceMono, 12);
    
    return (
        <CartesianChart
            data={DATA}
            xKey="time"
            yKeys={["amount", "threshold"]}
            axisOptions={{ 
                font, 
                formatXLabel: (h) => `${h}h`,
                formatYLabel: (mg) => `${mg}mg`
            }}
            domain={{y: [0, (mgCount === 0 ? 10 : mgCount)]}}            
        >

        {({ points }) => (
            <>
                <Line points={points.threshold} color="orange" strokeWidth={1} /> 
                <Line points={points.amount} color="blue" strokeWidth={3} />                              
            </>
        )}
        </CartesianChart>
    );
};

export default CaffeineChart; 