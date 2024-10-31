import { CartesianChart, Line } from "victory-native";
import { useFont } from "@shopify/react-native-skia";
import fontSpaceMono from "../assets/fonts/SpaceMono-Regular.ttf";



const CaffeineChart = ({
        mgCount
    }
    ) => {
    const font = useFont(fontSpaceMono, 12);
    const halfLife = 5;          
    const hours = 36;         

    let DATA = Array.from({ length: hours }, (_, t) => ({
        time: t,
        amount: mgCount * Math.pow(0.5, t / halfLife),
    }));
    
    return (
        <CartesianChart
            data={DATA}
            xKey="time"
            yKeys={["amount"]}
            axisOptions={{ 
                font, 
                formatXLabel: (h) => `${h}h`,
                formatYLabel: (mg) => `${mg}mg`
            }}
            domain={{y: [0, (mgCount === 0 ? 10 : mgCount)]}}
            
        >

        {({ points }) => (
            <Line points={points.amount} color="blue" strokeWidth={3} />            
        )}
        </CartesianChart>
    );
};

export default CaffeineChart; 