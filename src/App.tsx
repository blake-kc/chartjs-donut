import {
  ArcElement as ChartJSArcElement,
  ArcOptions,
  ArcProps,
  Chart as ChartJS,
  ChartData as ChartJSData,
  Element as ChartJSElement,
  Plugin as ChartJSPlugin,
} from "chart.js";
import { AnyObject } from "chart.js/types/basic";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ChartJSArcElement);

const data: ChartJSData<"doughnut"> = {
  labels: ["blue", "red"],
  datasets: [
    {
      data: [500, 100],
      backgroundColor: ["blue", "red"],
    },
  ],
};

type RoundedArc = ChartJSElement<
  AnyObject | ArcProps,
  AnyObject | ArcOptions
> & { round?: any };

const plugins: ChartJSPlugin<"doughnut">[] = [
  {
    id: "roundedCorners",
    afterUpdate: function (chart, args, option) {
      // we only expect 1 dataset
      const { data, controller } = chart.getDatasetMeta(0);
      for (let i = data.length - 1; i >= 0; --i) {
        // todo: investigate this
        // if (Number(i) == data.length - 1) continue;
        const arc = chart.getDatasetMeta(0).data[i];
        const radiusLength = controller.outerRadius - controller.innerRadius;

        arc.round = {
          x: (chart.chartArea.left + chart.chartArea.right) / 2,
          y: (chart.chartArea.top + chart.chartArea.bottom) / 2,
          radius: controller.innerRadius + radiusLength / 2,
          thickness: radiusLength / 2 - 1,
          backgroundColor: arc.options.backgroundColor,
        };
      }
    },

    afterDraw: function (chart) {
      const { ctx } = chart;

      // we only expect 1 dataset
      const { data } = chart.getDatasetMeta(0);

      // iterate through each arc's data point
      for (var i = data.length - 1; i >= 0; --i) {
        // todo investigate this
        if (Number(i) == data.length - 1) continue;
        var arc = data[i];

        var startAngle = Math.PI / 2 - arc.startAngle;
        var endAngle = Math.PI / 2 - arc.endAngle;

        ctx.save();
        ctx.translate(arc.round.x, arc.round.y);

        ctx.fillStyle = arc.round.backgroundColor;

        ctx.beginPath();

        ctx.arc(
          arc.round.radius * Math.sin(endAngle),
          arc.round.radius * Math.cos(endAngle),
          arc.round.thickness,
          0,
          2 * Math.PI
        );
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
    },
  },
];

function App() {
  return (
    <div>
      <Doughnut
        width={300}
        height={300}
        data={data}
        plugins={plugins}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          cutout: "90%",
          plugins: {
            tooltip: { enabled: false },
            legend: { display: false },
          },
          elements: {
            // arc: {
            //   borderRadius: {
            //     outerStart: 0,
            //     innerStart: 0,
            //     outerEnd: 4,
            //     innerEnd: 4,
            //   },
            // },
          },
        }}
      />
    </div>
  );
}

export default App;
