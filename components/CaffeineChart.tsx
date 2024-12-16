import { Area, CartesianChart, Line } from "victory-native";
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import { format, addHours } from "date-fns";
import fontSpaceMono from "../assets/fonts/SpaceMono-Regular.ttf";

const CaffeineChart = ({ DATA }) => {
  const font = useFont(fontSpaceMono, 12);
  let maxY = DATA.reduce((max, item) => Math.max(max, item.amount), 0) * 1.05;

  return (
    <CartesianChart
      data={DATA}
      xKey="timeStamp"
      yKeys={["amount", "threshold"]}
      axisOptions={{
        font,
        formatXLabel: (h) => format(addHours(new Date(h), -1), "H"),
        formatYLabel: (mg) => `${mg}mg`,
      }}
      domain={{ y: [0, maxY === 0 ? 10 : maxY] }}
    >
      {({ points, chartBounds }) => (
        <>
          <Line points={points.threshold} color="orange" strokeWidth={1} />
          <Line
            points={points.amount}
            color="blue"
            strokeWidth={3}
            animate={{ type: "timing", duration: 500 }}
          />
          <Area
            points={points.amount}
            y0={chartBounds.bottom}
            animate={{ type: "timing", duration: 500 }}
          >
            <LinearGradient
              start={vec(chartBounds.bottom, chartBounds.top)}
              end={vec(chartBounds.bottom, chartBounds.bottom)}
              colors={["#1e40af95", "#60a5fa40"]}
            />
          </Area>
        </>
      )}
    </CartesianChart>
  );
};

export default CaffeineChart;
